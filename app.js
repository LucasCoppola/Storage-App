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

const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')

app.engine('ejs', ejsMate)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(
	session({
		secret: 'secret',
		resave: false,
		saveUninitialized: true
	})
)
app.use(flash())

app.get('/', (req, res) => {
	res.render('home', { error: req.flash('error') })
})

app.use('/products', productsRouter)

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
