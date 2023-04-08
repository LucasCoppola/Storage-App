const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

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

router.get('/login', (req, res) => {
	res.render('auth/login', { error: req.flash('error') })
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
	const { username } = req.body
	req.flash('success', `Welcome back, ${username}`)
	res.redirect('/products')
})

module.exports = router
