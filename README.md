The project is using [express application generator](http://expressjs.com/en/starter/generator.html)

Your machine must have installed [TeXLive](https://www.tug.org/texlive/) to support
 for compiling `.tex` files.
 
Before start, add a `config.js` in project root.
```js
module.exports = {
	secretKey: 'Your custom secret key',
	mongoUrl : 'Your own MongoDB url which can get from MongoDB Atlas',
}
```  