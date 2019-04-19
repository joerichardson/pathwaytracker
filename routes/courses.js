var express = require('express');
var router = express.Router();
var db = require('../db.js');
var sql = require('sql-template-strings');

/* GET users listing. */
router.get('/', function (req, res, next) {
	db.query(sql`select courseId, courseName, courseCode, credithours from courses order by coursecode`, (err, result) => {
		res.json(result);
	});
});
router.post('/details', function (req, res, next) {
	let courseInfo = {
		'courseId': null,
		'courseName': null,
		'courseCode': null,
		'creditHours': null,
		'prerequisites': [],
	}

	let courseInfoPromise = new Promise((resolve, reject) => {
		db.query(sql`select courseId, courseName, courseCode, creditHours from courses where courseId = ${req.body.courseId}`, (err, result) => {
			courseInfo.courseName = result[0].courseName;
			courseInfo.courseCode = result[0].courseCode;
			courseInfo.courseId = result[0].courseId;
			courseInfo.creditHours = result[0].creditHours;
			resolve();
		});
	})
	let prerequisitesPromise = new Promise((resolve, reject) => {
		db.query(sql`
			SELECT prerequisiteId, courseName, courseCode, creditHours FROM prerequisites
			join courses on prerequisitecourseid = courses.courseId
			where prerequisites.courseId = ${req.body.courseId};
		`, (err, results) => {
			courseInfo.prerequisites = results;
			resolve();
		})
	})
	Promise.all([courseInfoPromise, prerequisitesPromise]).then(() => {
		res.json(courseInfo);
	})

});
router.post('/addCourse', function (req, res, next) {
	db.query(sql`insert into courses (courseName, courseCode, creditHours) values (${req.body.courseName}, ${req.body.courseCode}, ${req.body.creditHours})`, (err, result) => {
		res.json(result.insertId);
	});
});
router.post('/saveCourse', function (req, res, next) {
	db.query(sql`update courses set courseName = ${req.body.courseName}, courseCode = ${req.body.courseCode}, creditHours = ${req.body.creditHours} where courseId = ${req.body.courseId}`, (err, result) => {
		res.json('saved');
	});
});
router.post('/deleteCourse', function (req, res, next) {
	db.query(sql`delete from courses where courseId = ${req.body.courseId}`, (err, result) => {
		res.json('deleted');
	});
});
router.post('/deletePrerequisite', function (req, res, next) {
	db.query(sql`delete from prerequisites where prerequisiteId = ${req.body.prerequisiteId}`, (err, result) => {
		res.json('deleted');
	});
});
router.post('/addPrerequisite', function (req, res, next) {
	db.query(sql`insert into prerequisites (prerequisiteCourseId, courseId) values (${req.body.prerequisiteCourseId}, ${req.body.courseId})`, (err, result) => {
		res.json('added');
	});
});


module.exports = router;
