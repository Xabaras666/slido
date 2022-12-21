var express = require('express');
var router = express.Router();
const { pool } = require ('../dbConfig');

router.get('/dashboard', (req, res, next) => {
    pool.query(
        `SELECT * FROM lecture
        WHERE lecturer_id = $1`, [req.user.lecturer_id], (err, results) => {
            if(err) {
                throw err;
            }
            req.lectures = results.rows;
            return next()
        }
    )
}, (req, res, next) => {
  res.render('dashboard', { user_first_name: req.user.first_name,
                                         user_last_name: req.user.last_name,
                                         user_description: req.user.lecturer_description,
                                         user_image: '/images/profile_pictures/' + req.user.image,
                                         lectures: req.lectures})
})

module.exports = router;
