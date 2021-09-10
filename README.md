![GitHub](https://img.shields.io/github/license/zhyd1997/Eorg-Server)

This is the backend of [Eorg](https://github.com/zhyd1997/Eorg).

## Before start

1. Your machine must have installed [TeXLive](https://www.tug.org/texlive/) to support
   for compiling `.tex` files. (except for you don't want to integrate with FE.)

2. Add a `.env` file in the project root path.

```env
	NODE_ENV=development | production
	PORT=eg, 5000

	MONGO_URI=Your own MongoDB url which can get from MongoDB Atlas

	SMTP_HOST=Retrieve SMTP_ fields from https://mailtrap.io/ for devlopment or real email account that supports SMTP (eg, Gmail) for production
	SMTP_PORT=...
	SMTP_USER=...
	SMTP_PWD=...
	FROM_EMAIL=...
	FROM_NAME=...

	JWT_SECRET=Your custom secret key
	JWT_EXPIRE=Custom
	JWT_COOKIE_EXPIRE=Custom
```

## How to start

```bash
	yarn install
	yarn start
```
