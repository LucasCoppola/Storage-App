if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config()
}
require('express-async-errors')

const express = require('express')
const app = express()
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

const connectDB = require('./db/connect')

const authRouter = require('./routes/auth')
const productRouter = require('./routes/products')

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
	secret: 'thisisnotcomplexbutisasecret',
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: 1000 * 60 * 60 * 24 * 7
	}
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
	res.locals.currentUser = req.user
	res.locals.success = req.flash('success')
	res.locals.error = req.flash('error')
	next()
})

app.use((req, res, next) => {
	if (req.url.includes('favicon.ico')) {
		// Serve the favicon.ico file from the public directory
		res.sendFile(path.join(__dirname, 'public', 'favicon.ico'))
	} else {
		// Call the next middleware function for all other requests
		next()
	}
})

app.use('/', authRouter)
app.use('/products', productRouter)

app.get('/', (req, res) => {
	res.render('home')
})

const notFoundMiddleware = require('./middleware/not-found')
const errorMiddleware = require('./middleware/error-handler')

app.use(notFoundMiddleware)
app.use(errorMiddleware)

const port = process.env.PORT || 8080
const dbUrl = process.env.DB_URL

const start = async () => {
	try {
		await connectDB(dbUrl).then(console.log('Database Connected'))
		app.listen(port, () => console.log(`Server is listening port ${port}...`))
	} catch (error) {
		console.log(error)
	}
}

start()
