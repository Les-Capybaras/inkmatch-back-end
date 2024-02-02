const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Car = require("../models/Car");
const { validationResult } = require("express-validator");

async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const encryptedPassword = await bcrypt.hash(password, salt);
  return encryptedPassword;
}
 
// Login
exports.login = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Check for existing user
    const user = await User.findOne({ where: { email: email } });

    if (!user) {
      return res.status(400).json({ msg: "User Does not exist" });
    }

    // Check for password match
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Create and assign a token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    
    res.json({
      token,
      user: {
        id: user.id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Create and Save a new User
exports.create = async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Create a User object
  const user = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: await hashPassword(req.body.password),
    birthdate: req.body.birthdate,
  };

  try {
    const dbUser = await User.create(user);
    return res.status(201).json(dbUser);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Some error occurred while creating the user." });
  }
};

// Retrieve all users from the database.
exports.findAll = (req, res) => {
  User.findAll({ include: Car })
    .then((data) => {
      let users = [];
      data.forEach((user) => {
        let { password, ...userWithoutPassword } = user.dataValues;
        users.push(userWithoutPassword);
      });
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

// // Find a single User with an id
exports.findOne = (req, res) => {
  const id = req.user.id;

  User.findByPk(id, { include: Car })
    .then((data) => {
      let { password, ...userWithoutPassword } = data.dataValues;
      res.send(userWithoutPassword);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error retrieving User with id=" + id,
      });
    });
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was updated successfully.",
        });
      } else {
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.send({
          message: `Cannot delete User with id=${id}. Maybe User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete User with id=" + id,
      });
    });
};
