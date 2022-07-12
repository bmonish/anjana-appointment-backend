const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const { check, validationResult } = require("express-validator");

// Bringing in user model
const User = require("../../models/User");

router.post(
  "/",
  [
    check("username", "Username is required").not().isEmpty(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, userType } = req.body;

    try {
      // See if user exists - Since email is same as the key writing it once is enough
      let user = await User.findOne({ username });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      // Creating the instance of the user
      user = new User({
        username,
        password,
        userType,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10); // Greater the number, more secure will be the password but the application gets slower

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken
      res.json();
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server-error");
    }
  }
);

module.exports = router;
