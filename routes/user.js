var express = require('express');
var router = express.Router();
const { pool } = require ('../dbConfig');
const passport = require('passport');


router.get('/dashboard', (req, res, next) => {
    pool.query(
        `SELECT * FROM lecture
        WHERE lecturer_id = $1`, [req.user.lecturer_id], (err, results) => {
            if(err) {
                throw err;
            }
            req.lectures = results.rows;
            next()
        }
    )
}, (req, res, next) => {
    pool.query(
        `SELECT * FROM question`, (err, results) => {
            if(err) {
                throw err;
            }
            req.questions = results.rows;
            next();
        }
    )
}, (req, res, next) => {

  res.render('dashboard', { user_first_name: req.user.first_name,
                                         user_last_name: req.user.last_name,
                                         user_description: req.user.lecturer_description,
                                         user_image: req.user.image.slice(6),
                                         lectures: req.lectures,
                                         questions: req.questions})
})

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;