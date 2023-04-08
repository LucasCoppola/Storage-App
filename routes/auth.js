const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/register', (req, res) => {
	res.render('auth/register')
})

router.post('/register', async (req, res) => {
	const { email, username, password } = req.body
	const newUser = new User({ email, username })
	await User.register(newUser, password)
	req.flash('success', `Welcome, ${username}`)
	res.redirect('/products')
})

module.exports = router
