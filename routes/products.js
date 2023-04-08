const express = require('express')
const router = express.Router()
const Product = require('../models/product')
const multer = require('multer')
const { storage, cloudinary } = require('../cloudinary')
const upload = multer({ storage })

router.get('/', async (req, res) => {
	const { search } = req.query
	let products = []
	if (search) {
		// If a search query is present, search for products that match the query
		products = await Product.find({ name: { $regex: search, $options: 'i' } })
	} else {
		// If no search query is present, show all products
		products = await Product.find({}).sort({ name: 'ascending' })
	}
	res.render('products/index', { products, error: req.flash('error'), success: req.flash('success') })
})

router.get('/new', (req, res) => {
	res.render('products/new')
})

router.post('/', upload.single('image'), async (req, res) => {
	const { name, price, company, description } = req.body
	const product = new Product({ name, price, company, description })

	if (JSON.stringify(product.image) !== '{}') {
		product.image = { url: req.file.path, filename: req.file.filename }
	}

	await product.save()
	req.flash('success', 'New Product Added')
	res.redirect('/products')
})

router.get('/:id', async (req, res) => {
	const { id } = req.params
	const product = await Product.findById(id)
	if (!product) {
		req.flash('error', 'Product Not Found')
		res.redirect('/products')
	}
	res.render('products/details', { product })
})

router.get('/:id/edit', async (req, res) => {
	const { id } = req.params
	const product = await Product.findById(id)
	if (!product) {
		req.flash('error', 'Product Not Found')
		res.redirect('/products')
	}
	res.render('products/edit', { product })
})

router.put('/:id', upload.single('image'), async (req, res) => {
	const { id } = req.params
	const product = await Product.findById(id)

	// delete the old image from Cloudinary if there was one
	if (product.image && product.image.filename) {
		await cloudinary.uploader.destroy(product.image.filename)
	}

	product.name = req.body.name
	product.price = req.body.price
	product.company = req.body.company
	product.description = req.body.description
	product.image = req.file
	if (req.file) {
		// Access properties of req.file
		product.image = { url: req.file.path, filename: req.file.filename }
	}

	await product.save()

	req.flash('success', 'Product Edited')
	res.redirect(`/products/${id}`)
})

router.delete('/:id', async (req, res) => {
	const { id } = req.params
	await Product.findByIdAndDelete(id, { ...req.body })
	req.flash('success', 'Product Deleted')
	res.redirect('/products')
})

router.delete('/:id/image', async (req, res) => {
	const { id } = req.params

	// retrieve product from the database
	const product = await Product.findById(id)

	// delete the image from Cloudinary if there was one
	if (product.image && product.image.filename) {
		await cloudinary.uploader.destroy(product.image.filename)
		product.image = undefined
		await product.save()
	}

	req.flash('success', 'Product image deleted')
	res.redirect(`/products/${id}`)
})

module.exports = router
