import React, { Component } from 'react';
//import React from "react";
import { Link } from "react-router-dom";

export default class Courses extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: [],
			courseMode: null,
			course: {
				courseName: '',
				courseCode: '',
				courseId: null,
				creditHours: null,
				prerequisites: [],
			},
			selectedCourseId: null,
			mode: null,
			courseNameFilter: '',
			courseCodeFilter: ''
		};
	}
	componentDidMount() {
		this.getCourses();
	}
	getCourses() {
		fetch('/courses')
			.then(res => res.json())
			.then(courses => {
				this.setState({ courses: courses, loaded: true })
			});
	}
	getCourseInfo(courseId) {
		this.setState({selectedCourseId: courseId})
		fetch('/courses/details', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				courseId: courseId,
			})
		}).then(res => res.json())
			.then(course => {
				this.setState({ course: course, courseMode: 'view' });
			})
	}
	addCourse() {
		let creditHours = document.getElementById('creditHours').value;
		let courseName = document.getElementById('courseName').value;
		let courseCode = document.getElementById('courseCode').value;
		fetch('/courses/addCourse', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				creditHours: creditHours,
				courseName: courseName,
				courseCode: courseCode,
			})
		}).then(res => res.json())
			.then(courseId => {
				console.log(courseId);
				this.getCourseInfo(courseId);
				this.getCourses();
			})
	}
	saveCourse() {
		let courseId = this.state.selectedCourseId;
		let creditHours = document.getElementById('creditHours').value;
		let courseName = document.getElementById('courseName').value;
		let courseCode = document.getElementById('courseCode').value;
		fetch('/courses/saveCourse', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				creditHours: creditHours,
				courseName: courseName,
				courseCode: courseCode,
				courseId: courseId,
			})
		}).then(res => res.json())
			.then(() => {
				this.getCourseInfo(this.state.selectedCourseId);
				this.getCourses();
			})
	}
	deleteCourse() {
		let courseId = this.state.selectedCourseId;
		fetch('/courses/deleteCourse', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				courseId: courseId,
			})
		}).then(res => res.json())
			.then(() => {
				this.setState({ selectedCourseId: null, courseMode: null });
				this.getCourses();
			})
	}
	deletePrerequisite(prerequisiteId) {
		fetch('/courses/deletePrerequisite', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				prerequisiteId: prerequisiteId,
			})
		})
		.then(res => res.json())
		.then(() => {
			this.getCourseInfo(this.state.selectedCourseId);
		})
	}
	addPrerequisite(prerequisiteCourseId, courseId) {
		fetch('/courses/addPrerequisite', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				prerequisiteCourseId: prerequisiteCourseId,
				courseId, courseId,
			})
		})
		.then(res => res.json())
		.then(() => {
			this.getCourseInfo(this.state.selectedCourseId);
			this.setState({ mode: null });
		})

	}

	render() {
		let filteredCourses = this.state.courses.filter(course => course.courseName.toUpperCase().includes(this.state.courseNameFilter.toUpperCase()));
		filteredCourses = filteredCourses.filter(course => course.courseCode.toUpperCase().includes(this.state.courseCodeFilter.toUpperCase()));
		return (
			<>
				<div className='leftHand'>
					<div style={{ borderBottom: 'solid 1px #999', padding: '10px', flex: '0 1 0', height: '300px' }}>

						<div style={{ marginBottom: '15px', fontWeight: '800', display: 'flex' }}>
							<div style={{ flex: '1 1 0' }}><span>Filter</span></div>
							<div style={{ flex: '1 1 0', textAlign: 'right' }} > <input type='button' className='button createButton' value='Create' style={{}} onClick={() => { this.setState({ courseMode: 'create', selectedCourseId: null }) }} /></div>

						</div>
						<div style={{ marginBottom: '1px' }}>
							Name: <input id="firstNameFilter" onChange={(e) => { this.setState({ courseNameFilter: e.target.value }) }} style={{ float: 'right', width: '250px' }} type='text' />
						</div>
						<div style={{ marginBottom: '1px' }}>
							Code: <input id="lastNameFilter" onChange={(e) => { this.setState({ courseCodeFilter: e.target.value }) }} style={{ float: 'right', width: '250px' }} type='text' />
						</div>
					</div>
					<div className='scrollSearch'>
						{this.state.loaded == false &&
							<span>LOADING...</span>
						}
						{this.state.loaded == true &&

							<ul style={{ paddingInlineStart: 0 }}>
							{
								filteredCourses.map(course =>
										<li className={course.courseId == this.state.selectedCourseId ? 'selectedLi searchLi' : 'unselectedLi searchLi'} onClick={() => { this.getCourseInfo(course.courseId) }} key={course.courseId}>{course.courseName}<span style={{ float: 'right' }}>({course.courseCode})</span></li>
									)
								}
							</ul>
						}
					</div>
				</div>







				<div style={{ position: 'absolute', left: '325px', right: '0px', top: '75px', bottom: '0px', backgroundColor: '#ddd', margin: 'auto', display: 'flex', flexFlow: 'row-wrap' }}>
					{this.state.courseMode == 'view' &&
						<>
						<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px', overflowY: 'auto' }}>
							<div style={{ width: '100%', paddingBottom: '15px' }}>
								<div className='header'>{this.state.course.courseName} ({this.state.course.courseCode})<input type="button" className='button editButton' value="Edit" style={{ marginLeft: '15px' }} onClick={() => { this.setState({ courseMode: 'edit' }) }} /></div>
								<div className='subHeader'>{this.state.course.creditHours} Credit Hours</div>
							</div>
							<div className='subHeader'>Prerequisites<span> </span> 
							{this.state.mode == null &&
								 <input type='button' className='button createButton' value='Add' onClick={() => { this.setState({ mode: 'addPrerequisite' }) }} />
							}
							{this.state.mode == 'addPrerequisite' &&
								<input type='button' className='button cancelButton' value='Cancel' onClick={() => { this.setState({ mode: null}) }} />
							}
							</div>
							<div>
							{this.state.mode == 'addPrerequisite' &&
								<select onChange={(e) => { this.addPrerequisite(e.target.value, this.state.selectedCourseId); }}>
									<option></option>
									{this.state.courses.map(course =>
										<>
											<option key={course.courseId} value={course.courseId}>{course.courseName}</option>
										</>
									)}
								</select>
							}
							</div>
							<ul>
								{
									this.state.course.prerequisites.map(course =>
										<li className='searchLi' key={course.prerequisiteId}><span className='deleteX' onClick={() => { this.deletePrerequisite(course.prerequisiteId); }}>X</span> {course.courseName} ({course.courseCode})</li>
									)
								}
							</ul>
						</div>	
					</>
					}
					{this.state.courseMode == 'create' &&
						<>
						<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px' }}>
							<div style={{ width: '275px' }}>
								<div className='header'>Add Course</div>
								<div>Course Name: <input id="courseName" style={{ float: 'right' }} type="text" /></div>
								<div>Course Code: <input id="courseCode" style={{ float: 'right' }} type="text" /></div>
								<div>Credit Hours: <input id="creditHours" style={{ float: 'right' }} type="text" /></div>
								<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap', justifyContent: 'center' }}>
									<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button createButton' value="Add" onClick={() => { this.addCourse(); }} /></div>
									<div style={{ flex: '1 1 0', textAlign: 'left' }}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ courseMode: null }); }} /></div>
								</div>
							</div>
						</div>
						</>
					}
					{this.state.courseMode == 'edit' &&
						<>
							<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px' }}>
								<div style={{ width: '275px' }}>
									<div className='header'>Edit Course</div>
									<div>Course Name: <input id="courseName" defaultValue={this.state.course.courseName} style={{ float: 'right' }} type="text" /></div>
									<div>Course Code: <input id="courseCode" defaultValue={this.state.course.courseCode} style={{ float: 'right' }} type="text" /></div>
									<div>Credit Hours: <input id="creditHours" defaultValue={this.state.course.creditHours} style={{ float: 'right' }} type="text" /></div>
									<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap', justifyContent: 'center' }}>
										<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button saveButton' value="Save" onClick={() => { this.saveCourse(); }} /></div>
										<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button deleteButton' value="Delete" onClick={() => { this.deleteCourse(); }} /></div>
										<div style={{ flex: '1 1 0', textAlign: 'left' }}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ courseMode: 'view' }); }} /></div>
									</div>
								</div>
							</div>
						</>
					}







				</div>
			</>
		)
	}
}