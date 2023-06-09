const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const fetchUser = require('../middleware/fetchUser')

// const jwtSecret = process.env.JWT_SECRET;
const JWT_SECRET = "GouravBi$wa$"



// ROUTE 1: Create a user using: POST "/api/auth/createuser". Dosen't require Auth
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('username', 'Enter a username').isLength({ min: 8 }),
  body('password', 'Type a strong passowrd').isLength({ min: 8 }).isStrongPassword(),
  body('phone', 'Enter a valid phone number').isMobilePhone().isLength({ min: 10 })
], async (req, res) => {
  let success = false
  // If there are errors, return bad request and the erros
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  // Check wheather the user with this email or phone exisst already
  try {
    let user = await User.findOne({ email: req.body.email, phone: req.body.phone, username: req.body.username });
    if (user) {
      return res.status(400).json({ success, errors: [{ msg: 'User already exists' }] });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt)

    // Create a new user
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      username: req.body.username,
      password: secPass,
      phone: req.body.phone
    })

    const data = {
      user: {
        id: user.id
      }
    }

    const authToken = jwt.sign(data, JWT_SECRET)
    success = true
    res.json({ success, authToken })
  }
  catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error")
  }
})

// ROUTE 2: Authenticate a user using: POST "/api/auth/login". 
router.post('/login', [
  body('username', 'Enter a username').isLength({ min: 8 }),
  body('password', 'Write your password').exists()
], async (req, res) => {

  // If there are errors, return bad request and the erros
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    success = false
    return res.status(400).json({ success, errors: errors.array() });
  }

  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      success = false
      return res.status(400).json({ success, errors: [{ msg: 'Please try to login with correct credentials' }] });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      success = false
      return res.status(400).json({ success, errors: [{ msg: 'Please try to login with correct credentials' }] });
    }

    const data = {
      user: {
        id: user.id
      }
    }
    const authToken = jwt.sign(data, JWT_SECRET)
    success = true
    res.json({ success, authToken })

  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error")
  }
})


// ROUTE 3: Get loggedin USer details using: POST "/api/auth/getuser". login required
router.post('/getuser', fetchUser, async (req, res) => {

  try {
    userId = req.user.id
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error")
  }
})
module.exports = router;