var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var exec = require('child_process').exec;

const auth = require('../auth')
const jwt = require('jsonwebtoken')
const config = require("../config");
const User = require('../models/user')

function getUserId(request) {
	const userToken = request.headers.authorization;
	const token = userToken.split(' ');
	const decoded = jwt.verify(token[1], config.secretKey);
	const userId = decoded._id;

	return userId
}

function findUser(request) {
	return User.findOne({_id: getUserId(request)});
}

function sendFile(request, response, fileExtension, contentType) {
	findUser(request)
		.then((user) => {
			// Do something with the user
			const username = user.username

			console.log(`sending ${fileExtension}...\n`)
			const tempFile = `./latex/${username}/main.${fileExtension}`;
			fs.readFile(tempFile, function (err, data) {
				response.contentType(contentType);
				response.send(data)
			});
			console.log('\nsent done...\n')
			// return res.send(200);
		})
}

/**
 * 1. get raw latex code
 * 2. write it into `.tex` file
 * 3. compile it
 * 4. return the `pdf` file
 */

/* GET users listing. */
router.get('/pdf',auth.verifyUser, (req, res, next) => {
	sendFile(req, res, 'pdf', 'application/pdf')
})

router.get('/tex',auth.verifyUser, (req, res, next) => {
	sendFile(req, res, 'tex', 'application/x-tex')
})

router.post('/', auth.verifyUser, (req, res, next) => {
	findUser(req)
		.then(function (user) {
		// Do something with the user
		const username = user.username
		fs.mkdirSync(`./latex/${username}`, { recursive: true })

		empty(username)
		setTimeout(() => insertBegin(username), 3000)
		// return res.send(200);
		});
	/**
	 * compile
	 * await -> insert `end` template
	 * await -> append content
	 * await -> insert `begin` template
	 * await -> empty `latex` dir
	 */
	let body = req.body
	const begin =
		'\\documentclass[12pt]{article}' +
		'\r\n' +
		'\\usepackage[UTF8, scheme = plain, heading = false]{ctex}' +
		'\r\n' +
		'\\begin{document}' +
		'\r\n'
	const end = '\\end{document}'
	console.log(body)

	function empty(user) {
		console.log('[1/5] empty ...........')
		const dir = './latex/' + user

		fs.readdir(
			dir,
			(err, files) => {
				// if (err) throw err
				if (err) return

				for (const file of files) {
					fs.unlink(path.join(dir, file), err1 => {
						if (err1) throw err1
					})
				}
			})
	}

	function insertBegin(user) {
		console.log('[2/5] insertBegin........')
		console.log('-----------begin-----------\n')
		fs.writeFile(
			`./latex/${user}/main.tex`,
			begin,
			err => {
				if (err) {
					console.log('begin err', err)
					return
				}
				appendContent(user)
			}
		)
	}

	function appendContent(user) {
		console.log('[3/5] appendContent ............')
		for (let i = 0; i < body.length; i += 1) {
			try {
				fs.appendFileSync(
					`./latex/${user}/main.tex`,
					body[i] + '\r\n' + '\r\n',
				)
			} catch (err) {
				console.log('append err', err)
				return
			}
		}
		appendEnd(user)
	}

	function appendEnd(user) {
		console.log('[4/5] appendEnd ................\n')
		try {
			fs.appendFileSync(`./latex/${user}/main.tex`, end, )
		} catch (err) {
			console.log('end err', err)
			return
		}

		console.log('\n----------- end -----------\n')

		compileTeX(user)
	}

	function compileTeX(user) {
		console.log('[5/5] compile ..................')
		console.log('...xelatex is running...\n')
		exec(`cd ./latex/${user} && xelatex main.tex`, ((error, stdout, stderr) => {
			if (error instanceof Error) {
				console.log('latex error: ', error)
				throw error
			}
			console.log('stdout: \n', stdout)
			console.log('stderr: \n', stderr)
			console.log('...xelatex finished...\n')
		}))
	}

	res.json({
		status: 'success',
		body: body
	})
})

module.exports = router;