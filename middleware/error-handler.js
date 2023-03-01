const errorHandlerMiddleware = async (err, req, res, next) => {
	console.log(err)
	req.flash('error', err.message)
	return res.status(500).redirect('/')
}

module.exports = errorHandlerMiddleware
