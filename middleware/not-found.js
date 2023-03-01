const notFound = (req, res) => {
	req.flash('error', 'Route does not exist')
	return res.status(404).redirect('/')
}

module.exports = notFound
