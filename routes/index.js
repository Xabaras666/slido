var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { pool } = require ('../dbConfig');
const passport = require('passport');

const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/profile_pictures')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {message: ""});
});

router.post('/', (req, res, next) => {
    let code = Number(req.body.code);
    pool.query(
        `SELECT * FROM lecture
        WHERE lecture_id = $1`, [code], (err, results) => {
            if(err) {
                throw err;
            }
            if(results.rows.length > 0 && results.rows[0].status) {
                res.redirect(`/lecture?code=${code}`)
            }
            else {
                res.render('index', {message: "Please enter a valid code!"});
            }
        }

    )

})

router.get('/share/:id', (req, res, next) => {
    res.render('share', {code: req.params.id})
})


router.get('/signup', (req, res, next) => {
  res.render('signup')
})

router.post('/signup', upload.single("image"), async (req, res, next) => {
  let { email, first_name, last_name, password, re_password, description} = req.body;
  let imagePath = req.file.path;
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

    pool.query(
        `SELECT * FROM lecturer
        WHERE email = $1`, [email], (err, results) => {
          if(err) {
            throw err;
          }

          if(results.rows.length > 0) {
            errors.push({message: "Email already registered!"})
            res.render('signup', {errors});
          }
          else {
            pool.query(
                `INSERT INTO lecturer (email, password, first_name, last_name, lecturer_description, image)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING lecturer_id, password`,
                [email, hashedPassword, first_name, last_name,description, imagePath],
                (err, result) => {
                  if(err) {
                    throw err;
                  }
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
