var express = require('express');
var router = express.Router();
const { pool } = require ('../dbConfig');

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

module.exports = router;