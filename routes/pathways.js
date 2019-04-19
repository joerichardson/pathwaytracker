var express = require('express');
var router = express.Router();
var db = require('../db.js');
var sql = require('sql-template-strings');

/* GET users listing. */
router.get('/', function (req, res, next) {
	db.query(`select pathwayId, pathwayName, credithours from pathways`, (err, result) => {
		res.json(result);
	});
});
router.post('/addPathway', function (req, res, next) {
	db.query(sql`insert into pathways (pathwayName, CreditHours) values (${req.body.pathwayName}, ${req.body.creditHours})`, (err, result) => {
		res.json(result.insertId);
	});
});
router.post('/savePathway', function (req, res, next) {
	console.log(req.body);
	db.query(sql`update pathways set pathwayName = ${req.body.pathwayName}, creditHours = ${req.body.creditHours} where pathwayId = ${req.body.pathwayId}`, (err, result) => {
		res.json('updated');
	});
});
router.post('/deletePathway', function (req, res, next) {
	db.query(sql`delete from pathways where pathwayId = ${req.body.pathwayId}`, (err, result) => {
		res.json('deleted');
	});
});
router.post('/addPathwayCourse', function (req, res, next) {
	console.log(req.body);
	db.query(sql`insert into pathwaycourses (pathwayId, courseId, required) values (${req.body.pathwayId}, ${req.body.courseId}, ${req.body.required == 'true'? true : false})`, (err, result) => {
		res.json(result.insertId);
	});
});
router.post('/deletePathwayCourse', function (req, res, next) {
	db.query(sql`delete from pathwaycourses where pathwayCourseId = ${req.body.pathwayCourseId}`, (err, result) => {
		res.json('deleted');
	});
});
router.post('/updateCourseOrder', function (req, res, next) {
	console.log('updating course order');
	req.body.pathwayCourses.forEach((pathwayCourse, index) => {
		db.query(sql`update pathwaycourses set courseOrder = ${index+1} where pathwayCourseId = ${pathwayCourse.pathwayCourseId}`);

	});
	res.json('ok');
});
router.post('/details', function (req, res, next) {
	let pathwayInfo = {
		'creditHours': null,
		'pathwayName': null,
		'pathwayId': req.body.pathwayId,
		'pathwayCourses': [],
	}
	let pathwayInfoPromise = new Promise((resolve, reject) => {
		db.query(sql`select pathwayName, creditHours from pathways where pathwayId = ${req.body.pathwayId}`, (err, results) => {
			pathwayInfo.creditHours = results[0].creditHours;
			pathwayInfo.pathwayName = results[0].pathwayName;
			resolve();
		});
	});
	let pathwayCoursesPromise = new Promise((resolve, reject) => {
		db.query(`
		SELECT pathwayCourseId, courseName, courseCode, courses.creditHours, pathwaycourses.required FROM pathwaycourses
		join courses on pathwaycourses.courseid = courses.courseId
		where pathwaycourses.pathwayId = ${req.body.pathwayId}
		order by pathwaycourses.courseOrder;
		`, (err, results) => {
			pathwayInfo.pathwayCourses = results;
			let x = 0;
			results.forEach(pathwayCourse => {
				pathwayCourse.index = x;
				x++;
			});
			resolve();
		});
	});
	Promise.all([pathwayInfoPromise, pathwayCoursesPromise]).then(() => {
		res.json(pathwayInfo);
	});
});
module.exports = router;
