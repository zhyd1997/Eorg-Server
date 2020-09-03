var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path')
var exec = require('child_process').exec;

/**
 * 1. get raw latex code
 * 2. write it into `.tex` file
 * 3. compile it
 * 4. return the `pdf` file
 */

/* GET users listing. */
router.get('/', (req, res, next) => {
	console.log('sending pdf...\n')
	var tempFile="./latex/main.pdf";
	fs.readFile(tempFile, function (err,data){
		res.contentType("application/pdf");
		res.send(data)
	});
	console.log('\nsent done...\n')
});

router.get('/latex', (req, res, next) => {
	var tempFile="./latex/main.pdf";
	fs.readFile(tempFile, function (err,data){
		res.contentType("application/pdf");
		res.send(data)
	});
})

router.post('/', (req, res, next) => {
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

	function empty() {
		console.log('[1/5] empty ...........')
		const dir = './latex/'

		fs.readdir(
			dir,
			(err, files) => {
				if (err) throw err

				for (const file of files) {
					fs.unlink(path.join(dir, file), err1 => {
						if (err1) throw err1
					})
				}
			})
	}

	function insertBegin() {
		console.log('[2/5] insertBegin........')
		console.log('-----------begin-----------\n')
		fs.writeFile(
			'./latex/main.tex',
			begin,
			err => {
				if (err) {
					console.log('begin err', err)
					return
				}
			}
		)
		setTimeout(() => appendContent(), 3000)
	}

	function appendContent() {
		console.log('[3/5] appendContent ............')
		for (let i = 0; i < body.length; i += 1) {
			try {
				fs.appendFileSync(
					'./latex/main.tex',
					body[i] + '\r\n' + '\r\n',
				)
			} catch (err) {
				console.log('append err', err)
				return
			}
		}
		appendEnd()
	}

	function appendEnd() {
		console.log('[4/5] appendEnd ................\n')
		try {
			fs.appendFileSync('./latex/main.tex', end, )
		} catch (err) {
			console.log('end err', err)
			return
		}

		console.log('\n----------- end -----------\n')

		compileTeX()
	}

	function compileTeX() {
		console.log('[5/5] compile ..................')
		console.log('...xelatex is running...\n')
		exec('cd ./latex && xelatex main.tex', ((error, stdout, stderr) => {
			if (error instanceof Error) {
				console.log('latex error: ', error)
				throw error
			}
			console.log('stdout: \n', stdout)
			console.log('stderr: \n', stderr)
			console.log('...xelatex finished...\n')
		}))
	}

	empty()
	setTimeout(insertBegin, 3000)

	res.json({
		status: 'success',
		body: body
	})
})

module.exports = router;