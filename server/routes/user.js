const express = require('express')
const user = require("../models/user")
const router = express.Router()

router
.get('/getUsers', async (req, res) => {
  try {
    const users = await User.getAllUsers()
    res.send(users)
  } catch(err) {
    res.status(401).send({message: err.message})
  }
})

.post('/login', async (req, res) => {
    try {
      let User = await user.login(req.body)
      res.send({...User, Password: undefined})
    } catch(err) {
      res.status(401).send({message: err.message})
    }
  })
  
.post('/register', async(req, res) => {
try {
    let User = await user.register(req.body)
    res.send({...User, Password: undefined})
} catch(err) {
    res.status(401).send({message: err.message})
})

.put('/update', async(req, res) => {
  try {
    let user = await User.updateEmail(req.body)
    res.send({...user, Password: undefined})
  } catch(err) {
    res.status(401).send({message: err.message})
  }
})

.delete('/delete', async(req, res) => {
  try {
    let user = await User.deleteAccount(req.body)
    res.send({success: "We will miss you! :("})
  } catch(err) {
    res.status(401).send({message: err.message})
  }
})

module.exports = router
