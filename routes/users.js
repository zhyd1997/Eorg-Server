var express = require('express');
var router = express.Router();

const bodyParser = require('body-parser')
const passport = require('passport')
const User = require('../models/user')

const auth = require('../auth')

router.use(bodyParser.json())

/* GET users listing. */
router.get('/', auth.verifyUser, (req, res) => {
  User.find({})
      .then((users) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json({ users })
      })
      .catch((err) => {
        res.statusCode = 500
        res.setHeader('Content-Type', 'application/json')
        res.json({ err })
      })
})

router.post('/signup', (req, res) => {
  User.register(new User(
      { username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.json({ err })
        } else {
          user.save(() => {
            if (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.json({ err })
            }
          })
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200
            res.setHeader('Content-Type', 'application/json')
            res.json({
              success: true,
              status : 'Registration Successful!',
            })
          })
        }
      })
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      res.json({
        success: false,
        status : 'Login Unsuccessful!',
        err    : info,
      })
    }
    req.logIn(user, () => {
      if (err) {
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json')
        res.json({
          success: false,
          status : 'Login Unsuccessful!',
          err    : 'Could not log in user!',
        })
      }

      const token = auth.getToken({ _id: req.user._id })
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.json({
        success: true,
        token,
        status : 'Login Successful!',
      })
    })
  })(req, res, next)
})

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy()
    res.clearCookie('session-id')
    res.redirect('/')
  } else {
    const err = new Error('You are not logged in!')
    err.status = 403
    next(err)
  }
})

router.get('/checkJWTToken', (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err)

    if (!user) {
      res.statusCode = 401
      res.setHeader('Content-Type', 'application/json')
      return res.json({
        status : 'JWT invalid',
        success: false,
        err    : info,
      })
    }
    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    return res.json({
      status : 'JWT valid!',
      success: true,
      user,
    })
  })(req, res)
})

module.exports = router;
