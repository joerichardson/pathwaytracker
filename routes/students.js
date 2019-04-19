var express = require('express');
var router = express.Router();
var db = require('../db.js');
var sql = require('sql-template-strings');


/* GET users listing. */
router.get('/', function (req, res, next) {
    db.query(`select studentId, firstName, lastName, studentPid from students order by lastName`, (err, result) => {
		res.send(JSON.stringify(result));
    });
});
router.post('/addCourse', function (req, res, next) {
	let studentId = req.body.studentId;
	let semester = req.body.semester;
	let year = req.body.year;
	let passed = req.body.passed == 'true' ? true : false;
	let status = req.body.status;
	let courseId = req.body.courseId;
	let prerequisitesPromise = new Promise((resolve, reject) => {
		db.query(sql`
			SELECT prerequisiteId, prerequisites.PrerequisiteCourseId, courseName, courseCode, creditHours FROM student.prerequisites
			join courses on prerequisitecourseId = courses.courseId
			where prerequisites.courseId = ${courseId}
			and prerequisites.prerequisiteCourseId not in (select courseId from studentCourses where studentId = ${studentId});
		`, (err, results) => {
			console.log('err');
				if (results.length > 0) {
					reject(results);
				}
				else {
					resolve();
				}
			})
	})
	.then(() => {
		db.query(sql`
		insert into studentcourses (studentid, courseid, passed, semester, year, status) values (${studentId}, ${courseId}, ${passed}, ${semester}, ${year}, ${status});
	`, (err, results) => {
				res.json({ status: 'added' });
			});
	}).catch(results => {
		res.json({
			'status': 'failed',
			'prerequisites': results,
		});
	});
});
router.post('/saveCourse', function (req, res, next) {
	let studentCourseId = req.body.studentCourseId;
	let semester = req.body.semester;
	let year = req.body.year;
	let status = req.body.status;
	let passed = req.body.passed == 'true' ? true : false;
	let courseId = req.body.courseId;
	db.query(sql`
		update studentcourses set courseId = ${courseId}, passed = ${passed}, semester = ${semester}, year = ${year}, status = ${status} where studentCourseId = ${studentCourseId};
	`, (err, results) => {
		res.send('done');
	});
});
router.post('/deleteCourse', function (req, res, next) {
	let studentCourseId = req.body.studentCourseId;
	db.query(sql`
		delete from studentcourses where studentCourseId = ${studentCourseId};
	`, (err, results) => {
		res.send('done');
	});
});
router.post('/addPathway', function (req, res, next) {
	let studentId = req.body.studentId;
	let pathwayId = req.body.pathwayId;
	db.query(sql`
		insert into studentpathways (studentid, pathwayid) values (${studentId}, ${pathwayId});
	`, (err, results) => {
		res.send('done');
	});
});
router.post('/deletePathway', function (req, res, next) {
	db.query(sql`
		delete from studentpathways where studentPathwayId = ${req.body.studentPathwayId};
	`, (err, results) => {
		res.send('done');
	});
});
router.post('/addSubstitution', function (req, res, next) {
	db.query(sql`
		insert into substitutions (studentid, takencourseid, substitutecourseid, pathwayid) values (${req.body.studentId}, ${req.body.takenCourseId}, ${req.body.substituteCourseId}, ${req.body.pathwayId});
	`, (err, results) => {
		res.send('done');
	});
});
router.post('/addStudent', function (req, res, next) {
	db.query(sql`
		insert into students (firstName, lastName, studentPid) values (${req.body.firstName}, ${req.body.lastName}, ${req.body.studentPid});
	`, (err, result) => {
			res.json(result.insertId);
		});
});
router.post('/saveStudent', function (req, res, next) {
	db.query(sql`
		update students set firstName = ${req.body.firstName}, lastName = ${req.body.lastName}, studentPid = ${req.body.studentPid} where studentId =${req.body.studentId};
	`, (err, result) => {
			res.json('sent back');
		});
});
router.post('/deleteStudent', function (req, res, next) {
	db.query(sql`
		delete from students where studentId =${req.body.studentId};
	`, (err, result) => {
			res.json('sent back');
		});
});
router.post('/deleteSubstitution', function (req, res, next) {
	db.query(sql`
		delete from substitutions where substitutionId = ${req.body.substitutionId};
	`, (err, results) => {
			res.send('done');
		});
});
router.get('/progress/:studentId/:pathwayId', (req, res, next) => {
	let pathwayProgress = {
		'pathwayName': null,
		'creditHours': null,
		'cumulativeHours': null,
		'courses': [],
		'status': ''
	};
	let studentId = req.params.studentId;
	let pathwayId = req.params.pathwayId;
	let pathwayCoursesPromise = new Promise((resolve, reject) => {
		db.query(sql`
			select distinct courses.CourseName as 'name',
            pathwaycourses.pathwayCourseId,
			courses.coursecode as 'code',
			pathwaycourses.courseId as 'courseId',
			pathwaycourses.required as 'required',
			pathwaycourses.courseOrder as 'courseOrder',
			substitutions.substitutionId as 'substitutionId',
			courses.credithours as 'creditHours',
			(select passed from studentcourses where studentid = ${studentId} and courseid = pathwaycourses.courseid order by passed desc limit 1) as 'passed',
			(select status from studentcourses where studentid = ${studentId} and courseid = pathwaycourses.courseid order by field(status, 'Passed', 'In Progress', 'Widthdrew', 'Failed') limit 1) as 'status',
			substitutecourses.coursename as 'substituteName',
            substitutecourses.courseCode as 'substituteCode',
			substitutecourses.credithours as 'substituteCreditHours',
			(select passed from studentcourses where studentid = ${studentId} and courseid = substitutions.takencourseid order by passed desc limit 1 ) as 'substitutePassed',
			(select status from studentcourses where studentid = ${studentId} and courseid = substitutions.takencourseid order by field(status, 'Passed', 'In Progress', 'Withdrew', 'Failed') limit 1 ) as 'substituteStatus'
			from pathwaycourses
			join courses on pathwaycourses.courseid = courses.courseid
			left join studentcourses on pathwaycourses.courseid = studentcourses.courseid and studentid = ${studentId}
			left join substitutions on pathwaycourses.courseid = substitutions.substitutecourseid and substitutions.studentid =  ${studentId}
			left join courses as substitutecourses on substitutecourses.courseid = substitutions.takencourseid and substitutions.studentid = ${studentId}
			where pathwaycourses.pathwayid = ${pathwayId}
			order by pathwaycourses.courseOrder
		`, (err, results) => {
			pathwayProgress.courses = results;
			resolve();
		})
	});
	let pathwayInfoPromise = new Promise((resolve, reject) => {
		db.query(sql`select pathwayName, creditHours, pathwayId from pathways where pathwayid = ${pathwayId}`, (err, results) => {
			pathwayProgress.pathwayName = results[0].pathwayName;
			pathwayProgress.creditHours = results[0].creditHours;
			pathwayProgress.pathwayId = results[0].pathwayId;
			resolve();
		});
	});
	Promise.all([pathwayCoursesPromise, pathwayInfoPromise]).then(() => {
		let cumulativeCreditHours = 0;
		let pendingCreditHours = 0;
		let allRequired = true;
		let pendingRequired = true;
		pathwayProgress.courses.forEach(course => {
			if (course.status == 'Passed') {
				cumulativeCreditHours += course.creditHours;
			}
			else if (course.substituteStatus == 'Passed') {
				cumulativeCreditHours += course.substituteCreditHours;
			}
			else if (course.status == 'In Progress') {
				pendingCreditHours += course.creditHours
			}
			else if (course.substituteStatus == 'In Progress') {
				pendingCreditHours += course.substituteCreditHours
			}
			if (course.required == true) {
				if (course.status == 'In Progress' || course.substituteStatus == 'In Progress') {
					allRequired = false;
				}
				else if(course.status != 'Passed' && course.substituteStatus != 'Passed') {
					allRequired = false;
					pendingRequired = false;
				}
			}
		});
		if (cumulativeCreditHours >= pathwayProgress.creditHours && allRequired == true) {
			pathwayProgress.status = 'Complete';
		}
		else if (cumulativeCreditHours + pendingCreditHours >= pathwayProgress.creditHours && (allRequired == true || pendingRequired == true)) {
			pathwayProgress.status = 'Prospective Graduate';
		}
		else {
			pathwayProgress.status = 'In Progress';
		}
		pathwayProgress.cumulativeHours = cumulativeCreditHours;
		res.json(pathwayProgress);
	})


});
router.get('/details/:studentId', (req, res, next) => {
	let studentId = req.params.studentId;
	let studentInfo = {
		'firstName': null,
		'lastName': null,
		'studentPid': null,
		'studentId': req.params.studentId,
		'pathways': [],
		'courses': [],
	};
	let studentInfoPromise = new Promise((resolve, reject) => {
		db.query(sql`
			select firstName, lastName, studentPid from students where studentid = ${studentId}
		`, (err, results) => {
			studentInfo.firstName = results[0].firstName;
			studentInfo.lastName = results[0].lastName;
			studentInfo.studentPid = results[0].studentPid;
			resolve();
		});
	});
	let studentCoursesPromise = new Promise((resolve, reject) => {
		db.query(sql`
			select passed, semester, year, courseName, courseCode, courses.courseId, studentcourses.studentCourseId, status from studentcourses
			join courses on studentcourses.courseid = courses.courseid
			where studentid = ${studentId}
		`, (err, results) => {
			studentInfo.courses = results;
			resolve();
		});
	});
	let studentPathwaysPromise = new Promise((resolve, reject) => {
		db.query(sql`
			select studentPathwayId, pathways.pathwayId, pathwayName from studentpathways
			join pathways on studentpathways.pathwayid = pathways.pathwayid
			where studentid = ${studentId}
		`, (err, results) => {
			studentInfo.pathways = results;
			resolve();

		});
	});
	Promise.all([studentInfoPromise, studentCoursesPromise, studentPathwaysPromise]).then(() => {
		res.json(studentInfo);
	});
});
module.exports = router;
