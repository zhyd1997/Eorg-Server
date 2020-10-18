const express = require('express')
const multer = require('multer')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const jwt = require('jsonwebtoken')
const auth = require('../auth')
const config = require('../config')
const Figure = require('../models/figure')
const User = require('../models/user')

function getUserId(request) {
	const userToken = request.headers.authorization
	const token = userToken.split(' ')
	const decoded = jwt.verify(token[1], config.secretKey)

	return decoded._id // userID
}

function findUser(request) {
	return User.findOne({ _id: getUserId(request) })
}

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		findUser(req)
			.then((user) => {
				const { username } = user
				const dir = `./latex/${username}/images`
				fs.mkdirSync(dir, { recursive: true })
				cb(null, dir)
			})
	},
	filename: (req, file, cb) => {
		cb(null, file.originalname)
	},
})
const upload = multer({ storage: storage })

router.get('/:blockKey', auth.verifyUser, (req, res) => {
	Figure.find({ key: req.params.blockKey})
		.then((figure) => {
			console.log(figure)
			const lastOne = figure.length - 1
			console.log(figure.length, figure[lastOne].path)
			fs.readFile(figure[lastOne].path, (err, data) => {
				res.statusCode = 200
				res.contentType('image/jpeg')
				res.send(data)
			})
		}, (err) => console.log(err))
		.catch((err) => console.log(err))
})

router.post('/', auth.verifyUser, upload.single('test'), (req, res) => {
	// step1: store it into ./latex/${user}/
	findUser(req)
		.then((user) => {
			const { username } = user
			// step2: set mongoose.
			console.log(req.body)

			Figure.create({
				path: `./latex/${username}/images/${req.file.filename}`,
				key: req.body.id,
				user: user,
			})
				.then((figure) => {
					res.statusCode = 200
					res.setHeader('Content-Type', 'multipart/form-data')
					res.json(figure)
				}, (err) => console.log('create error: ', err))
				.catch((err) => console.log('something error: ', err))
		})
})

module.exports = router