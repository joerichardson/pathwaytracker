import React, { Component } from 'react';
//import React from "react";
import { Link } from "react-router-dom";

export default class Students extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			students: [],
			studentMode: null,
			selectedStudentId: null,
			student: {
				firstName: '',
				lastName: '',
				studentId: null,
				studentPid: null,
				pathways: [],
				courses: [],
			},
			firstNameFilter: '',
			lastNameFilter: '',
			pidFilter: '',
			courses: [],
			pathways: [],
			loaded: false,
			mode: null,
			selectedStudentPathwayId: null,
			selectedStudentCourseId: null,
			selectedStudentCourse: null,
			pathwayProgress: {
				'status': null,
				'pathwayName': null,
				'courses': [],
				'pathway': null,
				'pathwayId': null,
				'cumulativeHours': null,
			},
			requiredPrerequisites: [],
		};
	}
	componentDidMount() {
		fetch('/pathways')
			.then(res => res.json())
			.then(pathways => {
				this.setState({ pathways: pathways });
			});
		fetch('/courses')
			.then(res => res.json())
			.then(courses => {
				this.setState({ courses: courses });
			});
		this.getStudents();
	}
	getStudents() {
		fetch('/students')
			.then(res => res.json())
			.then(students => {
				this.setState({ students: students, loaded: true })
			});
	}
	setAddCoursesView() {
		this.setState({ mode: 'addCourses', requiredPrerequisites: [] });
	}
	setAddPathwayView() {
		this.setState({ mode: 'addPathway' });
	}
	addSubstitution(substituteCourseId, takenCourseId) {
		fetch('/students/addSubstitution', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				takenCourseId: takenCourseId,
				substituteCourseId: substituteCourseId,
				studentId: this.state.student.studentId,
				pathwayId: this.state.pathwayProgress.pathwayId
			})
		}).then(() => {
			this.getPathwayProgress(this.state.pathwayProgress.pathwayId, this.state.selectedStudentPathwayId);
		})
	}
	deleteSubstitution(substitutionId) {
		fetch('/students/deleteSubstitution', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				substitutionId: substitutionId,
			})
		}).then(() => {
			this.getPathwayProgress(this.state.pathwayProgress.pathwayId);
		})
	}
	componentWillUnmount() {
		
	}
	getPathwayProgress(pathwayId, studentPathwayId) {
		this.setState({selectedStudentPathwayId: studentPathwayId, selectedStudentCourseId: null,})
		fetch(`/students/progress/${this.state.student.studentId}/${pathwayId}`)
		.then(res => res.json())
		.then(pathwayProgress => {
			this.setState({ pathwayProgress: pathwayProgress, mode: 'pathwayProgress' }, () => {
			});
		});
	}
	getStudentInfo(studentId) {
		this.setState({selectedStudentId: studentId, mode: null});
		fetch(`/students/details/${studentId}`)
		.then(res => res.json())
			.then(student => {
			this.setState({student: student, studentMode: 'view'})
		})
	}
	addStudent() {
		let firstName = document.getElementById('firstName').value;
		let lastName = document.getElementById('lastName').value;
		let studentPid = document.getElementById('studentPid').value;
		fetch('/students/addStudent', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				studentPid: studentPid
			})
		}).then(res => res.json())
			.then(studentId => {
				this.getStudents();
			this.getStudentInfo(studentId);
		})
	}
	saveStudent() {
		console.log('saving');
		let firstName = document.getElementById('firstName').value;
		let lastName = document.getElementById('lastName').value;
		let studentPid = document.getElementById('studentPid').value;
		let studentId = this.state.student.studentId;
		fetch('/students/saveStudent', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				studentPid: studentPid,
				studentId: studentId,
			})
		}).then(res => res.json())
			.then(() => {
				this.getStudents();
				this.getStudentInfo(studentId);
			})
	}
	deleteStudent() {
		let studentId = this.state.student.studentId;
		fetch('/students/deleteStudent', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				studentId: studentId,
			})
		})
		.then(() => {
			this.getStudents();
			this.setState({ studentMode: null });
		})
	}
	addStudentPathway() {
		let pathwayId = document.getElementById('pathwayId').value;
		let studentId = this.state.student.studentId;
		fetch('/students/addPathway', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				studentId: studentId,
				pathwayId: pathwayId
			})
		}).then(() => {
			this.getStudentInfo(this.state.student.studentId);
		})
	}
	deleteStudentPathway() {
		let studentPathwayId = this.state.selectedStudentPathwayId;
		fetch('/students/deletePathway', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				studentPathwayId: studentPathwayId,
			})
		}).then(() => {
			this.getStudentInfo(this.state.student.studentId);
		})
	}
	addStudentCourse() {
		let courseId = document.getElementById('course').value;
		let semester = document.getElementById('semester').value
		let year = document.getElementById('year').value;
		let passed = document.getElementById('passed').value;
		let status = document.getElementById('status').value;
		let studentId = this.state.student.studentId;
		fetch('/students/addCourse', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				courseId: courseId,
				semester: semester,
				passed: passed,
				studentId: studentId,
				year: year,
				status: status,
			})
		})
		.then(res => res.json())
		.then(result => {
			console.log(result);
			if (result.status == 'added') {
				this.getStudentInfo(this.state.student.studentId);
			}
			else if (result.status == 'failed') {
				this.setState({ requiredPrerequisites: result.prerequisites });
			}
		});
	}
	saveStudentCourse() {
		let studentCourseId = this.state.selectedStudentCourse.studentCourseId;
		let courseId = document.getElementById('course').value;
		let semester = document.getElementById('semester').value;
		let year =  document.getElementById('year').value;
		let passed = document.getElementById('passed').value;
		let status = document.getElementById('status').value;
		fetch('/students/saveCourse', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				studentCourseId: studentCourseId,
				courseId: courseId,
				semester: semester,
				passed: passed,
				year: year,
				status: status,
			})
		}).then(() => {
			this.getStudentInfo(this.state.student.studentId);
			this.setState({ mode: null });
		})
	}
	deleteStudentCourse() {
		let studentCourseId = this.state.selectedStudentCourse.studentCourseId;
		fetch('/students/deleteCourse', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				studentCourseId: studentCourseId,
			})
		}).then(() => {
			this.getStudentInfo(this.state.student.studentId);
			this.setState({ mode: null });
		})
	}


	render() {
		let filteredStudents = this.state.students.filter(student => student.firstName.toUpperCase().includes(this.state.firstNameFilter.toUpperCase()));
		filteredStudents = filteredStudents.filter(student => student.lastName.toUpperCase().includes(this.state.lastNameFilter.toUpperCase()));
		filteredStudents = filteredStudents.filter(student => student.studentPid.toUpperCase().includes(this.state.pidFilter.toUpperCase()));
		return (
			<>
				<div className='leftHand'>
					<div style={{ borderBottom: 'solid 1px #999', padding: '10px', flex: '0 1 0', height:'300px'}}>
					
						<div style={{ marginBottom: '15px', fontWeight: '800', display: 'flex' }}>
							<div style={{ flex: '1 1 0' }}><span>Filter</span></div>
							<div style={{ flex: '1 1 0', textAlign: 'right' }} > <input type='button' className='button createButton' value='Create' style={{ }} onClick={() => { this.setState({ studentMode: 'create', selectedStudentId: null }) }} /></div>

						</div>
						<div style={{marginBottom: '1px'}}>
							First: <input id="firstNameFilter" onChange={(e) => { this.setState({ firstNameFilter: e.target.value }) }} style={{ float: 'right', width: '250px' }} type='text' />
						</div>
						<div style={{ marginBottom: '1px' }}>
							Last: <input id="lastNameFilter" onChange={(e) => { this.setState({ lastNameFilter: e.target.value }) }} style={{ float: 'right', width: '250px' }} type='text'/>
						</div>
						<div style={{ marginBottom: '1px' }}>
							PID: <input id='pidFilter' onChange={(e) => { this.setState({ pidFilter: e.target.value }) }} style={{ float: 'right', width: '250px' }} type='text' />
						</div>
				
					</div>
					<div className='scrollSearch'>
					{this.state.loaded == false &&
						<span>LOADING...</span>
					}
					{this.state.loaded == true &&

						<ul style={{paddingInlineStart: 0}}>
						{
							filteredStudents.map(student =>
								<li className={student.studentId == this.state.selectedStudentId ? 'selectedLi searchLi' : 'unselectedLi searchLi'} onClick={() => { this.getStudentInfo(student.studentId) }} key={student.studentId}>{student.lastName}, {student.firstName} <span style={{float: 'right'}}>({student.studentPid})</span></li>
							)
						}
						</ul>
					}	
					</div>
				</div>



				<div style={{position: 'absolute', left: '325px', right: '0px', top: '75px', bottom: '0px', backgroundColor: '#ddd',margin:'auto', display: 'flex',flexFlow: 'row-wrap'}}>
					{this.state.studentMode == 'create' &&
						<>
						<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px' }}>
							<div style={{width: '275px'}}>
								<div className='header'>Add Student</div>
								<div>First Name <input id="firstName" style={{float: 'right'}} type="text" /></div>
								<div>Last Name <input id="lastName" style={{ float: 'right' }} type="text" /></div>
								<div>Student PID <input id="studentPid" style={{ float: 'right' }} type="text" /></div>
								<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap', justifyContent: 'center' }}>
									<div style={{flex: '0 1 0', textAlign: 'left', marginRight:'15px'}}><input type="button" className='button createButton' value="Add" onClick={() => { this.addStudent(); }} /></div>
									<div style={{flex: '1 1 0', textAlign: 'left'}}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ studentMode: null }); }} /></div>			
								</div>
							</div>
						</div>

						</>
					}
					{this.state.studentMode == 'edit' &&
						<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px' }}>
							<div style={{ width: '275px' }}>
							<div className='header'>Edit Student</div>
							<div>First Name <input id="firstName" defaultValue={this.state.student.firstName} style={{ float: 'right' }} type="text" /></div>
							<div>Last Name <input id="lastName" defaultValue={this.state.student.lastName} style={{ float: 'right' }} type="text" /></div>
							<div>Student PID <input id="studentPid" defaultValue={this.state.student.studentPid} style={{ float: 'right' }} type="text" /></div>
							<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap' }}>
								<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button saveButton' value="Save" onClick={() => { this.saveStudent(); }} /></div>
								<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button deleteButton' value="Delete" onClick={() => { this.deleteStudent(); }} /></div>
								<div style={{ flex: '1 1 0', textAlign: 'left' }}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ studentMode: 'view' }); }} /></div>	
							</div>
							</div>
						</div>		
					}



					{(this.state.studentMode == 'view') &&
						<>
						<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px', overflowY: 'auto'}}>
							<div style={{ width: '275px' }}>
								<div className='header'>{this.state.student.firstName} {this.state.student.lastName}<input type="button" className='button editButton' value="Edit" style={{marginLeft: '15px'}} onClick={() => { this.setState({ studentMode: 'edit' }) }} /></div>
								<div className='subHeader'>{this.state.student.studentPid}</div>
							</div>
							<div style={{ paddingBottom: '15px', paddingTop: '15px' }}>
								<div className='subHeader'>Pathways <input type='button' value='Add' className='button createButton' onClick={() => { this.setAddPathwayView() }} /></div>
								<ul>
									{
										this.state.student.pathways.map(studentPathway =>
											<li className={studentPathway.studentPathwayId == this.state.selectedStudentPathwayId && this.state.mode == 'pathwayProgress' ? 'searchLi selectedLi' : 'searchLi unselectedLi'} onClick={() => { this.getPathwayProgress(studentPathway.pathwayId, studentPathway.studentPathwayId) }} key={studentPathway.studentPathwayId}>{studentPathway.pathwayName}</li>
										)
									}
								</ul>

							</div>
							<div className='subHeader'>Courses <input type='button' className='button createButton' value='Add' onClick={() => { this.setAddCoursesView() }} /></div>
							<ul>
								{
									this.state.student.courses.map(studentCourse =>
										<li className={this.state.selectedStudentCourseId == studentCourse.studentCourseId ? 'searchLi selectedLi' : 'searchLi unselectedLi'} onClick={() => { this.setState({ selectedStudentCourse: studentCourse, mode: 'viewCourse', selectedStudentCourseId: studentCourse.studentCourseId }); console.log(studentCourse.studentCourseId); }} key={studentCourse.studentCourseId}>{studentCourse.courseName} ({studentCourse.semester} {studentCourse.year}) {studentCourse.status}</li>
									)
								}
							</ul>


						</div>	




							{this.state.mode == 'pathwayProgress' &&
							<>
							<div style={{ backgroundColor: '#eee', flex: '1 1 0', padding: '15px', borderLeft: 'solid 1px #999', overflowY: 'auto', }}>
								<div style={{  }}>
									<div className='header'>{this.state.pathwayProgress.pathwayName}<input type="button" className='button editButton' value="Delete" style={{ marginLeft: '15px' }} onClick={() => { this.deleteStudentPathway() }} /></div>
									<div className='subHeader'>{this.state.pathwayProgress.status}</div>
									<div className='subHeader'>{this.state.pathwayProgress.cumulativeHours} / {this.state.pathwayProgress.creditHours} Credit Hours</div>
									<table style={{width:'100%'}}><tbody>
										<tr>
											<th>Course Name</th>
											<th style={{ width: '100px' }}>Code</th>
											<th style={{ width: '100px' }}>Substitute</th>
											<th style={{ width: '100px' }}>Status</th>
										</tr>
										{
											this.state.pathwayProgress.courses.map(course =>
												<tr key={course.pathwayCourseId} className={ course.required == true ? 'required' : ''} >
													<td>{course.name}</td>
													<td>{course.code}</td>
													{(() => {
														let studentPassedCourses = this.state.student.courses.filter(course => course.passed == true);
														if (course.substituteCode == null && (course.passed == null || course.passed == false)) {
															return (
																<td>
																	<select style={{minWidth:'80px'}} onChange={(e) => { this.addSubstitution(course.courseId, e.target.value) }}>
																		<option></option>
																		{
																			studentPassedCourses.map(passedCourse =>
																				<option value={passedCourse.courseId}>{passedCourse.courseCode}</option>
																			)
																		}

																	</select>
																</td>
															)
														}
														else {
															return (<td>{course.substituteCode} {course.substituteCode != null ? <span style={{ color: '#f00', fontWeight: '600', cursor: 'pointer' }} onClick={() => { this.deleteSubstitution(course.substitutionId) }}>X</span> : <span></span>} </td>)
														}
													})()}
													<td>{course.status != null ? course.status : 'Incomplete'}</td>

												</tr>
											)
										}
									</tbody></table>
								</div>
							</div>	
							</>
							}
							{this.state.mode == 'addCourses' &&

							<>
							<div style={{ backgroundColor: '#eee', flex: '1 1 0', padding: '15px', borderLeft: 'solid 1px #999' }}>
								<div style={{ width: '175px' }}>
									<div className='header'>Add Course</div>
									<div>Course
										<select style={{float:'right', width:'100px'}} id="course">

											{
												this.state.courses.map(course =>
													<option value={course.courseId}>{course.courseCode}</option>
												)
											}
										</select>

									</div>
									<div>Semester
										<select id="semester" style={{ float: 'right', width: '100px'}}>
											<option value='FALL'>Fall</option>
											<option value='SPRING'>Spring</option>
											<option value='SUMMER'>Summer</option>
										</select>
									</div>
									<div>Year
										<input style={{ float: 'right', width: '100px' }} id='year' type='number' defaultValue={new Date().getFullYear()} />
									</div>
									<div>Passed
										<select id="passed" style={{ float: 'right', width: '100px'}}>
											<option value='true'>Yes</option>
											<option value='false'>No</option>
										</select>
									</div>
									<div>Status
										<select id="status" style={{ float: 'right', width: '100px' }}>
											<option value='Passed'>Passed</option>
											<option value='Failed'>Failed</option>
											<option value='In Progress'>In Progress</option>
											<option value='Widthdrew'>Widthdrew</option>
										</select>
									</div>
									<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap', justifyContent: 'center' }}>
										<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button createButton' value="Add" onClick={() => { this.addStudentCourse(); }} /></div>
										<div style={{ flex: '1 1 0', textAlign: 'left' }}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ mode: null }); }} /></div>
									</div>
								</div>
								{this.state.requiredPrerequisites.length > 0 &&
									<>
									<div style={{marginTop: '15px'}}>The following classes must be completed first:</div>
									<ul>
										{
											this.state.requiredPrerequisites.map(studentCourse =>
												<li className='searchLi' key={studentCourse.prerquisiteId}>{studentCourse.courseName} ({studentCourse.courseCode})</li>
											)
										}
									</ul>
									</>
								}

							</div>
							</>
							}
							{this.state.mode == 'editCourse' &&
							<>
							<div style={{ backgroundColor: '#eee', flex: '1 1 0', padding: '15px', borderLeft: 'solid 1px #999' }}>
								<div style={{ width: '220px' }}>
									<div className='header'>Edit Course</div>
									<div>Course
										<select disabled='true' defaultValue={this.state.selectedStudentCourse.courseId} style={{ float: 'right', width: '100px' }} id="course">

											{
												this.state.courses.map(course =>
													<option value={course.courseId}>{course.courseCode}</option>
												)
											}
										</select>

									</div>
									<div>Semester
										<select defaultValue={this.state.selectedStudentCourse.semester} id="semester" style={{ float: 'right', width: '100px' }}>
											<option value='FALL'>Fall</option>
											<option value='SPRING'>Spring</option>
											<option value='SUMMER'>Summer</option>
										</select>
									</div>
									<div>Year
										<input style={{ float: 'right', width: '100px' }} id='year' type='number' defaultValue={this.state.selectedStudentCourse.year} />
									</div>
									<div>Passed
										<select defaultValue={this.state.selectedStudentCourse.passed} id="passed" style={{ float: 'right', width: '100px' }}>
											<option value='true'>Yes</option>
											<option value='false'>No</option>
										</select>
									</div>
									<div>Status
										<select defaultValue={this.state.selectedStudentCourse.status} id="status" style={{ float: 'right', width: '100px' }}>
											<option value='Passed'>Passed</option>
											<option value='Failed'>Failed</option>
											<option value='In Progress'>In Progress</option>
											<option value='Widthdrew'>Widthdrew</option>
										</select>
									</div>
									<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap', justifyContent: 'center' }}>
										<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button saveButton' value="Save" onClick={() => { this.saveStudentCourse() }} /></div>
										<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button deleteButton' value="Delete" onClick={() => { this.deleteStudentCourse() }} /></div>
										<div style={{ flex: '1 1 0', textAlign: 'left' }}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ mode: 'viewCourse' }) }} /></div>
									</div>
								</div>
							</div>
								</>
							}
						{this.state.mode == 'viewCourse' &&



							<>
							<div style={{ backgroundColor: '#eee', flex: '1 1 0', padding: '15px', borderLeft: 'solid 1px #999' }}>
								<div style={{ width: '350px' }}>
									<div className='header'>{this.state.selectedStudentCourse.courseName}<input type="button" className='button editButton' value="Edit" style={{ marginLeft: '15px' }} onClick={() => { this.setState({ mode: 'editCourse' }) }} /></div>
									<div className='subHeader'>{this.state.selectedStudentCourse.courseCode}</div>
									<div className='subHeader'>{this.state.selectedStudentCourse.semester} {this.state.selectedStudentCourse.year}</div>
									<div className='subHeader'>Passed: {this.state.selectedStudentCourse.passed ? 'Yes': 'No'}</div>
									<div className='subHeader'>Status: {this.state.selectedStudentCourse.status}</div>
								</div>
							</div>	

								</>
							}


							{this.state.mode == 'addPathway' &&
							<>


							<div style={{ backgroundColor: '#eee', flex: '1 1 0', padding: '15px', borderLeft: 'solid 1px #999' }}>
								<div style={{ width: '175px' }}>
									<div className='header'>Add Pathway</div>
									<div>Pathway
										<select style={{ float: 'right', width: '100px' }} id="pathwayId">

											{
												this.state.pathways.map(pathway =>
													<option value={pathway.pathwayId}>{pathway.pathwayName}</option>
												)
											}
										</select>

									</div>
									<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap', justifyContent: 'center' }}>
										<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button createButton' value="Add" onClick={() => { this.addStudentPathway(); }} /></div>
										<div style={{ flex: '1 1 0', textAlign: 'left' }}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ mode: null }); }} /></div>
									</div>
								</div>
							</div>
								</>

							}

						</>
					}






				</div>
			</>
		)
	}
}