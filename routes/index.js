var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require ('../dbConfig');
const passport = require('passport');



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.post('/signup', async (req, res, next) => {
  let { email, first_name, last_name, password, re_password, description} = req.body;

  console.log({email, first_name, last_name, password, re_password, description});

  let errors = [];

  if(!email || !first_name || !last_name || !password || !re_password) {
    errors.push({message: "Please enter all fields!"});
  }
  if(password.length < 6) {
    errors.push({message: "Password should be at least 6 characters!"});
  }
  if(password != re_password) {
    errors.push({message: "Passwords do not match!"});
  }
  if(errors.length > 0) {
    res.render('signup', { errors })
  }
  else {
    // FORM VALIDATION HAS PASSED

    let hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword)

    pool.query(
        `SELECT * FROM lecturer
        WHERE email = $1`, [email], (err, results) => {
          if(err) {
            throw err;
          }
          console.log(results.rows);

          if(results.rows.length > 0) {
            errors.push({message: "Email already registered!"})
            res.render('signup', {errors});
          }
          else {
            pool.query(
                `INSERT INTO lecturer (email, password, first_name, last_name, lecturer_description)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING lecturer_id, password`,
                [email, hashedPassword, first_name, last_name,description],
                (err, result) => {
                  if(err) {
                    throw err;
                  }
                  console.log(results.rows);
                  req.flash('success_msg', "You are now registered. Please log in");
                  res.redirect('/login');
                }
            )
          }
        }
    );
  }
})

router.get('/login', (req, res, next) => {
  res.render('login')
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/user/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))

module.exports = router;
