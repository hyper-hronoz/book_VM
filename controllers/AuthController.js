const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

class AuthController {
    constructor() {
        if (AuthController._instance) {
            return AuthController._instance;
        }
        AuthController._instance = this;
    }

    async sendConfirmationEmail(req, res) {
        try {
            console.log("Email confirmation started");
            const {
                email,
            } = req.body;

            const user = await User.findOne({
                email,
            });

            if (!user) {
                console.log("Странно но юзер не найден");
                return res.status(404).message({
                    message: "User not found",
                });
            }

            if (user.isEmailConfirmed) {
                console.log("Емайл подтвержден");
                return res.status(409).json({
                    message: "Email already confirmed",
                });
            }

            if (!user.email) {
                console.log("оказалось у пользователя нет email");
                return res.status(409).json({
                    message: "Как так можно было устроить я хз, регайся заново",
                });
            }

            const jwtConfirmationLink = jwt.sign(
                {
                    email,
                },
                process.env["book_VM_secret"],
                {
                    expiresIn: "10h",
                },
            );

            const transporter = nodemailer.createTransport({
                service: "gmail",
                port: 587,
                secure: false,
                auth: {
                    user: "nodemailertest228@gmail.com",
                    pass: process.env["book_VM_password"],
                },
                tls: {
                    rejectUnauthorized: false,
                },
            });

            const host = req.get("host");

            const letterTemplate = await ejs.renderFile(
                path.join(__dirname, "..", "/public/email_template.ejs"),
                {
                    confirmationLink:
                        `http://${host}/auth/confirm/${jwtConfirmationLink}`,
                },
            );

            const info = await transporter.sendMail({
                from: '"Fred Foo 👻"',
                to: email,
                subject: "Email confirmation ✔",
                text: "Please confirm email to get access to application",
                html: letterTemplate,
            });

            console.log("Message sent: %s", info.messageId);

            await res.status(200).json({
                message: "User successfull created and email sent",
            });
        } catch (e) {
            console.log(e);
            await res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    async finishEmailConfirmation(req, res) {
        try {
            const token = req.params.token;

            const email = jwt.verify(token, process.env["book_VM_secret"]).email;

            if (!email) {
                return res.status(400).json({
                    message: "incorret confirmation",
                });
            }

            const user = await User.findOne({
                email,
            });

            if (!user) {
                return res.status(404).json({
                    message: "User not found",
                });
            }

            if (!user.isEmailConfirmed) {
                console.log("Обновляем статус аккаунта");
                await User.updateOne({
                    email,
                }, {
                    isEmailConfirmed: true,
                });
            }

            return res.send(
                await ejs.renderFile(
                    path.join(
                        __dirname,
                        "..",
                        "/public/email_confirmed_congratulations.ejs",
                    ),
                ),
            );
        } catch (e) {
            console.log(e);
            await res.status(500).json({
                message: "Internal server error",
            });
        }
    }

     login = async (req, res) => {
        try {
            const {
                email,
                password,
            } = req.body;

            const user = await User.findOne({
                email,
            });

            if (!user) {
                console.log("Пользователя не существует");
                return res.status(404).json({
                    message: `Пользователь c ${email} не найден`,
                });
            }

            if (!user.isEmailConfirmed) {
                console.log("Пользователь не подтвержден");
                return res.status(403).json({
                    message: "Email is not confirmed, please confirm it",
                });
            }

            const isValidPassword = bcrypt.compareSync(password, user.password);

            if (!isValidPassword) {
                console.log("Введен не верный пароль");
                return res.status(400).json({
                    message: `Введен неверный пароль`,
                });
            }

            const token = this.generateAccessToken(user._id);

            console.log(token);

            return res.status(200).json({
                token,
            });
        } catch (e) {
            console.log(e);
            await res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    generateAccessToken(id) {
        const payload = {
            id,
        };
        return jwt.sign(payload, process.env.book_VM_secret, {
            expiresIn: "2160h",
        });
    }

    signup = async (req, res) => {
        try {
            await check("email").isEmail().run(req);
            await check("password").isLength({ min: 6 }).run(req);

            const result = validationResult(req);
            if (!result.isEmpty()) {
                return res.status(400).json({ errors: result.array() });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            console.log("Registration");

            const {
                email,
                password,
            } = req.body;

            console.log(email, password);

            const passwordHashed = bcrypt.hashSync(password, 7);

            const isUserAlreadyExists = await User.findOne({
                email,
            });

            console.log("Checking user with same email", isUserAlreadyExists);

            if (isUserAlreadyExists) {
                if (
                    isUserAlreadyExists.email == email &&
                    isUserAlreadyExists.isEmailConfirmed
                ) {
                    console.log("User already exists");
                    return res.status(422).json({
                        message: "User with this email already exists",
                    });
                }

                if (
                    isUserAlreadyExists.email == email &&
                    !isUserAlreadyExists.isEmailConfirmed
                ) {
                    await User.deleteOne({
                        email,
                    });
                    console.log("User has been deleted");
                }
            }

            const id = uuidv4().toString();
            console.log(typeof id);
            const user = new User({
                id: id,
                email,
                password: passwordHashed,
                isEmailConfirmed: false,
            });

            await user.save();
            this.sendConfirmationEmail(req, res);
        } catch (e) {
            console.log(e);
            await res.status(500).json({
                message: "Internal server error",
            });
        }
    };

    async checkTokenMiddleware(req, res) {
        try {
            console.log("проходим авторизацию");
            const token = req.headers.authorization.split(" ")[1];
            console.log(token);
            if (!token) {
                return res.status(401).json({ message: "Unautorized" });
            }
            const decodedData = jwt.verify(token, process.env.book_VM_secret);
            req.user = decodedData;
            console.log("пользователь авторизовался");
        } catch (e) {
            console.log(e);
            await res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}

module.exports = new AuthController();
