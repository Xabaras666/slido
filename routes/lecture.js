var express = require('express');
var router = express.Router();
const { pool } = require ('../dbConfig');
const passport = require('passport');


router.get('/newlecture', (req, res, next) => {
    res.render('newlecture')
})

router.post('/newlecture', (req, res, next) => {
    let {title, description, ending_date} = req.body;
    let errors = [];

    if(!title || !description || !ending_date) {
        errors.push({message: "Please enter all fields!"});
    }
    if(errors.length > 0) {
        res.render('newlecture', { errors })
    }
    else {
        let current_lecturer = req.user.lecturer_id;
        let current_date = new Date();

        pool.query(
            `INSERT INTO lecture (lecturer_id, title, description, creation_date, ending_date)
            VALUES ($1, $2, $3, $4, $5)`,
            [current_lecturer, title, description, current_date, ending_date],
            (err, result) => {
                if(err) {
                    throw err;
                }
                res.redirect('/user/dashboard')
            }
        )
    }
})

router.get('/:lecture_id', (req, res, next) => {
    pool.query(
        `SELECT * FROM lecture WHERE lecture_id = $1`, [req.params.lecture_id], (err, result) => {
            if(err){
                throw err;
            }
            req.lecture = result.rows[0];
            next()
        }
    )

} , (req, res, next) => {
    res.render('lecture', {
        title: req.lecture.title,
        creation_date: req.lecture.creation_date,
        ending_date: req.lecture.ending_date})
})

router.post('/:lecture_id/delete', (req, res, next) => {
    pool.query(
        `DELETE FROM lecture WHERE lecture_id = $1`,
        [req.params.lecture_id],
        (err, result) => {
            if (err) {
                throw err;
            }
            return res.redirect('/user/dashboard')
        }
    )
})


module.exports = router;