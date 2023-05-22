const axios = require("axios");
const mongoose = require("mongoose");

const User = require("../models/User");
const Book = require("../models/Book");

const email = "vlad_moryakov_prog@mail.ru";
const password = "не вам госпада решить кто жив а кто будет жить";

describe("getting books", () => {
  test("getting books and checking status code", async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/books");
    const res = await axios.get("http://localhost:8080/books/all");

    expect(res.status).toBe(200);
    const httpBooks = res.data;
    const dbBooks = await Book.find({});
    expect(JSON.stringify(httpBooks)).toBe(JSON.stringify(dbBooks));

    mongoose.connection.close();
  });

  test("getting favorite books and checking status code", async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/books");

    await User.deleteOne({ email: email });

    const resSignUp = await axios.post("http://localhost:8080/auth/signup", {
      email: email,
      password: password,
    });

    expect(resSignUp.status).toBe(200);

    await User.updateOne({ email: email }, { isEmailConfirmed: true });

    const resLogin = await axios.post("http://localhost:8080/auth/login", {
      email: email,
      password: password,
    });

    expect(resLogin.status).toBe(200);

    const { token } = resLogin.data;

    console.log(token);
    let responseStatus = 0;
    const res = await axios
      .get(`http://localhost:8080/books/fav/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .catch((error) => {
        responseStatus = error.response.status;
      });

    const books = await Book.find({});

    for (let book of books) {
      const addToFavorites = await axios.put(
        `http://localhost:8080/books/fav/${book._id.valueOf()}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      expect(addToFavorites.status).toBe(200);
    }

    const newRes = await axios.get(`http://localhost:8080/books/fav/`, {
      headers: { Authorization: `Bearer ${token}` },
    });


    expect(responseStatus).toBe(404);
    expect(newRes.status).toBe(200);

    await User.deleteOne({ email: email });

    mongoose.connection.close();
  });
});

describe("authentication", () => {
  test("sign up new user and status code checking", async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/books");

    await User.deleteOne({ email: email });

    const res = await axios.post("http://localhost:8080/auth/signup", {
      email: email,
      password: password,
    });

    expect(res.status).toBe(200);

    const data = res.data;

    await User.deleteOne({ email: email });

    mongoose.connection.close();
  });

  test("login without confirmation and status-code checking", async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/books");

    await User.deleteOne({ email: email });

    const resSignUp = await axios.post("http://localhost:8080/auth/signup", {
      email: email,
      password: password,
    });

    expect(resSignUp.status).toBe(200);

    let responseStatus;
    const resLogin = await axios
      .post("http://localhost:8080/auth/login", {
        email: email,
        password: password,
      })
      .catch((error) => {
        responseStatus = error.response.status;
      });

    expect(responseStatus).toBe(403);

    await User.deleteOne({ email: email });

    mongoose.connection.close();
  });

  test("login with confirmation and status-code checking", async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/books");

    await User.deleteOne({ email: email });

    const resSignUp = await axios.post("http://localhost:8080/auth/signup", {
      email: email,
      password: password,
    });

    expect(resSignUp.status).toBe(200);

    await User.updateOne({ email: email }, { isEmailConfirmed: true });

    const resLogin = await axios.post("http://localhost:8080/auth/login", {
      email: email,
      password: password,
    });

    expect(resLogin.status).toBe(200);

    await User.deleteOne({ email: email });

    mongoose.connection.close();
  });
});

describe("fav books", () => {
  test("add to favorites", async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/books");

    await User.deleteOne({ email: email });

    const resSignUp = await axios.post("http://localhost:8080/auth/signup", {
      email: email,
      password: password,
    });

    expect(resSignUp.status).toBe(200);

    await User.updateOne({ email: email }, { isEmailConfirmed: true });

    const resLogin = await axios.post("http://localhost:8080/auth/login", {
      email: email,
      password: password,
    });

    expect(resLogin.status).toBe(200);

    const { token } = resLogin.data;

    const oldUser = await User.findOne({ email: email });

    const books = await Book.find({});

    for (let book of books) {
      const addToFavorites = await axios.put(
        `http://localhost:8080/books/fav/${book._id.valueOf()}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      expect(addToFavorites.status).toBe(200);
    }

    const newUser = await User.findOne({ email: email });

    expect(oldUser).not.toBe(newUser);

    await User.deleteOne({ email: email });

    mongoose.connection.close();
  });

  test("remove from favorites", async () => {
    await mongoose.connect("mongodb://127.0.0.1:27017/books");

    await User.deleteOne({ email: email });

    const resSignUp = await axios.post("http://localhost:8080/auth/signup", {
      email: email,
      password: password,
    });

    expect(resSignUp.status).toBe(200);

    await User.updateOne({ email: email }, { isEmailConfirmed: true });

    const resLogin = await axios.post("http://localhost:8080/auth/login", {
      email: email,
      password: password,
    });

    expect(resLogin.status).toBe(200);

    const { token } = resLogin.data;

    const oldUser = await User.findOne({ email: email });

    const books = await Book.find({});

    for (let book of books) {
      const addToFavorites = await axios.put(
        `http://localhost:8080/books/fav/${book._id.valueOf()}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      expect(addToFavorites.status).toBe(200);
    }

    for (let book of books) {
      const addToFavorites = await axios.delete(
        `http://localhost:8080/books/fav/${book._id.valueOf()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      expect(addToFavorites.status).toBe(200);
    }

    const newUser = await User.findOne({ email: email });

    expect(JSON.stringify(oldUser)).toBe(JSON.stringify(newUser));

    await User.deleteOne({ email: email });

    mongoose.connection.close();
  });
});

// describe("book reading", () => {
//   test("read book", async () => {
//     await mongoose.connect("mongodb://127.0.0.1:27017/books");
//
//     await User.deleteOne({ email: email });
//
//     const resSingUp = await axios.post("http://localhost:8080/auth/signup", {
//       email: email,
//       password: password,
//     });
//
//     expect(resSingUp.status).toBe(200);
//
//     await User.updateOne({ email: email }, { isEmailConfirmed: true });
//
//     const resLogin = await axios.post("http://localhost:8080/auth/login", {
//       email: email,
//       password: password,
//     });
//
//     expect(resLogin.status).toBe(200);
//
//     const { token } = resLogin.data;
//
//     const dbBooks = await Book.find({});
//
//     for (let book of dbBooks) {
//       const getFirstPage = await axios.get(`http://localhost:8080/books/${book._id.valueOf()}/0/1000`, {
//         headers: {
//           Authorization: "Bearer " + token,
//         },
//       });
//       const data = getFirstPage.data;
//       const {pages} = data;
//
//       for (let i = 0; i < parseInt(pages); i++) {
//         const getFirstPage = await axios.get(`http://localhost:8080/books/${book._id.valueOf()}/${i}/1000`, {
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         });
//         expect(getFirstPage.status).toBe(200);
//       }
//     }
//
//     await User.deleteOne({ email: email });
//
//     mongoose.connection.close();
//   }, 1000 * 60 * 2);
// });
