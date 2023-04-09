const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')

router.get('/register', (req, res) => {
	res.render('auth/register')
})

router.post('/register', async (req, res, next) => {
	const { email, username, password } = req.body
	const newUser = new User({ email, username })
	const registeredUser = await User.register(newUser, password)
	req.login(registeredUser, (err) => {
		if (err) return next(err)

		req.flash('success', `Welcome, ${username}`)
		res.redirect('/products')
	})
})

router.get('/login', (req, res) => {
	res.render('auth/login')
})

router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), (req, res) => {
	const { username } = req.body
	req.flash('success', `Welcome back, ${username}`)
	res.redirect('/products')
})

router.get('/logout', function (req, res, next) {
	req.logout((err) => {
		if (err) return next(err)
		res.redirect('/')
	})
})

module.exports = router
