var express = require('express');
var router = express.Router();
const { pool } = require ('../dbConfig');
const passport = require('passport');

const multer = require('multer');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images/lecture_covers')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({storage: storage})

router.get('/', (req, res, next) => {
    pool.query(
        `SELECT * FROM lecture WHERE lecture_id = $1`, [req.query.code], (err, result) => {
            if(err){
                throw err;
            }
            req.lecture = result.rows[0];
            next()
        }
    )
}, (req, res, next) => {
    pool.query(
        `SELECT * FROM question WHERE lecture_id = $1`, [req.query.code], (err, result) => {
            if(err){
                throw err;
            }
            req.questions = result.rows;
            next()
        }
    )
}, (req, res, next) => {
    pool.query(
        `SELECT * FROM answer`, (err, result) => {
            if(err) {
                throw err;
            }
            req.answers = result.rows
            next()
        }
    )

}, (req, res, next) => {
    res.render('guestlecture', {
        title: req.lecture.title,
        code: req.query.code,
        description: req.lecture.description,
        creation_date: req.lecture.creation_date,
        ending_date: req.lecture.ending_date,
        image: req.lecture.image.slice(7),
        questions: req.questions,
        answers: req.answers})
})




router.get('/newlecture', (req, res, next) => {
    res.render('newlecture', )
})

router.post('/newlecture', upload.single("image"), (req, res, next) => {
    let {title, code, description, ending_date} = req.body;
    let imagePath = req.file.path;
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

        if(code == "") {
            pool.query(
                `INSERT INTO lecture (lecturer_id, title, description, creation_date, ending_date, image)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [current_lecturer, title, description, current_date, ending_date, imagePath],
                (err, result) => {
                    if(err) {
                        throw err;
                    }
                    res.redirect('/user/dashboard')
                }
            )
        }
        else {
            pool.query(
                `INSERT INTO lecture (lecture_id, lecturer_id, title, description, creation_date, ending_date)
                VALUES ($1, $2, $3, $4, $5, $6)`,
                [code, current_lecturer, title, description, current_date, ending_date],
                (err, result) => {
                    if(err) {
                        throw err;
                    }
                    res.redirect('/user/dashboard')
                }
            )
        }

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

}, (req, res, next) => {
    pool.query(
        `SELECT * FROM question WHERE lecture_id = $1`, [req.params.lecture_id], (err, result) => {
            if(err){
                throw err;
            }
            req.questions = result.rows;
            next()
        }
    )
}, (req, res, next) => {
    pool.query(
        `SELECT * FROM answer`, (err, result) => {
            if(err) {
                throw err;
            }
            req.answers = result.rows
            next()
        }
    )

} , (req, res, next) => {

    res.render('lecture', {
        title: req.lecture.title,
        code: req.params.lecture_id,
        description: req.lecture.description,
        creation_date: req.lecture.creation_date,
        ending_date: req.lecture.ending_date,
        image: req.lecture.image.slice(7),
        status: req.lecture.status,
        questions: req.questions,
        answers: req.answers})
})

router.post('/:lecture_id/delete', (req, res, next) => {
    pool.query(
        `UPDATE lecture SET status = NOT status WHERE lecture_id = $1`,
        [req.params.lecture_id],
        (err, result) => {
            if (err) {
                throw err;
            }
            //res.redirect('/user/dashboard')
        }
    )
})

router.post('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;