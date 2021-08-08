![GitHub](https://img.shields.io/github/license/zhyd1997/Eorg-Server)

The project is using [express application generator](http://expressjs.com/en/starter/generator.html)

Your machine must have installed [TeXLive](https://www.tug.org/texlive/) to support
for compiling `.tex` files.

Before start, add a `.env` file in project root.

```env
	NODE_ENV=<development | production>
	PORT=<eg, 5000>

	MONGO_URI=<Your own MongoDB url which can get from MongoDB Atlas>

	SMTP_HOST=<Retrieve SMTP_ fields from https://mailtrap.io/>
	SMTP_PORT=<...>
	SMTP_USER=<...>
	SMTP_PWD=<...>
	FROM_EMAIL=<...>
	FROM_NAME=<...>

	JWT_SECRET=<Your custom secret key>
	JWT_EXPIRE=<Custom>
	JWT_COOKIE_EXPIRE=<Custom>
```
