const mongoose = require('mongoose')
const Schema = mongoose.Schema

const productSchema = new Schema({
	name: { type: String, required: true, maxLength: 30 },
	price: { type: Number, required: true, min: 0 },
	description: { type: String, required: true, maxLength: 300 },
	company: { type: String, required: true },
	image: { url: String, filename: String }
})

module.exports = mongoose.model('Product', productSchema)
