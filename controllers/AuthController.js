const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

class AuthController {
    constructor() {

    }

    async sendConfirmationEmail(req, res) {
        try {

        } catch (e)  {
            console.log(e)
            await res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async confirmEmail(req, res) {

        try {

        } catch (e)  {
            console.log(e)
            await res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async login(req, res) {

        try {

        } catch (e)  {
            console.log(e)
            await res.status(500).json({
                message: "Internal server error"
            })
        }
    }

    async signup(req, res) {
        try {

        } catch (e)  {
            console.log(e)
            await res.status(500).json({
                message: "Internal server error"
            })
        }

    }

    static async checkToken(req, res) {
        try {

        } catch (e)  {
            console.log(e)
            await res.status(500).json({
                message: "Internal server error"
            })
        }
    }
};


