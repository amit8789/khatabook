const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY;

const authenticateJWT = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        req.flash("error", "You must be logged in.");
        console.log("you must be logged in");
        return res.redirect("/login");
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            req.flash("error", "Session expired. Please log in again.");
            return res.redirect("/login");
        }
        req.user = user;
        next();
    });
};

module.exports = { authenticateJWT };
