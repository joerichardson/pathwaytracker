import React, { Component } from 'react';
//import React from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ReactDOM from 'react-dom';




// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);
	return result;
};
const grid = 1;
const getItemStyle = (isDragging, draggableStyle) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: 'none',
	padding: grid * 2,
	margin: `0 0 ${grid}px 0`,

	// change background colour if dragging
	background: isDragging ? '#fff' : '',

	// styles we need to apply on draggables
	...draggableStyle,
});
const getListStyle = isDraggingOver => ({
	//background: isDraggingOver ? 'white' : '',
	padding: grid,
	//width: 250,
});





export default class Pathways extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			pathways: [],
			pathwayMode: null,
			items: [],
			pathway: {
				pathwayName: '',
				pathwayId: null,
				creditHours: null,
				pathwayCourses: [],
				courses: [],
			},
			selectedPathwayId: null,
			mode: null,
			pathwayNameFilter: '',
		};
		this.onDragEnd = this.onDragEnd.bind(this);
	}
	onDragEnd(result) {
		// dropped outside the list
		if (!result.destination) {
			return;
		}

		const items = reorder(
			this.state.items,
			result.source.index,
			result.destination.index
		);
		console.log(items);
		fetch('/pathways/updateCourseOrder', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				pathwayCourses: items,
			})
		})
		this.setState({
			items,
		});
	}
	componentDidMount() {
		fetch('/courses')
			.then(res => res.json())
			.then(courses => {
				this.setState({ courses: courses, loaded: true })
			});
		this.getPathways();
	}
	getPathways() {
		fetch('/pathways')
			.then(res => res.json())
			.then(pathways => {
				this.setState({ pathways: pathways, loaded: true })
			});
	}
	getPathwayInfo(pathwayId) {
		this.setState({ selectedPathwayId: pathwayId })
		fetch('/pathways/details', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				pathwayId: pathwayId,
			})
		}).then(res => res.json())
			.then(pathway => {
				console.log(pathway)
				this.setState({ pathway: pathway, pathwayMode: 'view', items: pathway.pathwayCourses });
			})
	}
	addPathway() {
		let creditHours = document.getElementById('creditHours').value;
		let pathwayName = document.getElementById('pathwayName').value;
		fetch('/pathways/addPathway', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				creditHours: creditHours,
				pathwayName: pathwayName,
			})
		}).then(res => res.json())
			.then(pathwayId => {
				console.log(pathwayId);
				this.getPathwayInfo(pathwayId);
				this.getPathways();
			})
	}
	savePathway() {
		console.log('saving');
		let pathwayId = this.state.selectedPathwayId;
		let creditHours = document.getElementById('creditHours').value;
		let pathwayName = document.getElementById('pathwayName').value;
		fetch('/pathways/savePathway', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				creditHours: creditHours,
				pathwayName: pathwayName,
				pathwayId: pathwayId,
			})
		}).then(res => res.json())
			.then(() => {
				this.getPathwayInfo(this.state.selectedPathwayId);
				this.getPathways();
			})
	}
	deletePathway() {
		let pathwayId = this.state.selectedPathwayId;
		fetch('/pathways/deletePathway', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				pathwayId: pathwayId,
			})
		}).then(res => res.json())
			.then(() => {
				this.setState({ selectedPathwayId: null, pathwayMode: null });
				this.getPathways();
			})
	}
	deletePathwayCourse(pathwayCourseId) {
		fetch('/pathways/deletePathwayCourse', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				pathwayCourseId: pathwayCourseId,
			})
		})
		.then(res => res.json())
		.then(() => {
			this.getPathwayInfo(this.state.selectedPathwayId);
		})
	}
	addPathwayCourse(courseId, pathwayId) {
		fetch('/pathways/addPathwayCourse', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				pathwayId: this.state.selectedPathwayId,
				courseId: document.getElementById('pathwayCourse').value,
				required: document.getElementById('required').value,
			})
		})
		.then(res => res.json())
		.then(() => {
			this.getPathwayInfo(this.state.selectedPathwayId);
			this.setState({ mode: null });
		})

	}
	render() {
		let filteredPathways = this.state.pathways.filter(pathway => pathway.pathwayName.toUpperCase().includes(this.state.pathwayNameFilter.toUpperCase()));
		return (
			<>
				<div className='leftHand'>
					<div style={{ borderBottom: 'solid 1px #999', padding: '10px', flex: '0 1 0', height: '300px' }}>

						<div style={{ marginBottom: '15px', fontWeight: '800', display: 'flex' }}>
							<div style={{ flex: '1 1 0' }}><span>Filter</span></div>
							<div style={{ flex: '1 1 0', textAlign: 'right' }} > <input type='button' className='button createButton' value='Create' style={{}} onClick={() => { this.setState({ pathwayMode: 'create', selectedPathwayId: null }) }} /></div>

						</div>
						<div style={{ marginBottom: '1px' }}>
							Name: <input id="nameFilter" onChange={(e) => { this.setState({ pathwayNameFilter: e.target.value }) }} style={{ float: 'right', width: '250px' }} type='text' />
						</div>
					</div>
					<div className='scrollSearch'>
						{this.state.loaded == false &&
							<span>LOADING...</span>
						}
						{this.state.loaded == true &&

							<ul style={{ paddingInlineStart: 0 }}>
								{
									filteredPathways.map(pathway =>
										<li className={pathway.pathwayId == this.state.selectedPathwayId ? 'selectedLi searchLi' : 'unselectedLi searchLi'} onClick={() => { this.getPathwayInfo(pathway.pathwayId) }} key={pathway.pathwayId}>{pathway.pathwayName}</li>
									)
								}
							</ul>
						}
					</div>
				</div>






				<div style={{ position: 'absolute', left: '325px', right: '0px', top: '75px', bottom: '0px', backgroundColor: '#ddd', margin: 'auto', display: 'flex', flexFlow: 'row-wrap' }}>
					{this.state.pathwayMode == 'view' &&
						<>
						<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px', overflowY: 'auto' }}>
							<div style={{ width: '100%', paddingBottom: '15px' }}>
								<div className='header'>{this.state.pathway.pathwayName}<input type="button" className='button editButton' value="Edit" style={{ marginLeft: '15px' }} onClick={() => { this.setState({ pathwayMode: 'edit' }) }} /></div>
								<div className='subHeader'>{this.state.pathway.creditHours} Credit Hours</div>
							</div>
							<div className='subHeader'>Courses<span> </span>
								{this.state.mode == null &&
									<input type='button' className='button createButton' value='Add' onClick={() => { this.setState({ mode: 'addCourse' }) }} />
								}
								{this.state.mode == 'addCourse' &&
									<input type='button' className='button cancelButton' value='Cancel' onClick={() => { this.setState({ mode: null }) }} />
								}
							</div>
							<div>
								{this.state.mode == 'addCourse' &&
									<>
									<select id='pathwayCourse'>
										<option></option>
										{this.state.courses.map(course =>
											<>
												<option key={course.courseId} value={course.courseId}>{course.courseName}</option>
											</>
										)}
									</select>
									<select style={{marginLeft: '5px'}} id='required'>
										<option value={true}>Required</option>
										<option value={false}>Not Required</option>
									</select>
									<input type='button' style={{ marginLeft: '5px' }} value='Save' onClick={() => { this.addPathwayCourse(); }} className='createButton button' />
									</>
								}
							</div>
							<DragDropContext onDragEnd={this.onDragEnd}>
								<Droppable droppableId="droppable">
									{(provided, snapshot) => (
										<div
											ref={provided.innerRef}
											style={getListStyle(snapshot.isDraggingOver)}
										>
											{this.state.items.map((item, index) => (
												<Draggable key={item.pathwayCourseId} draggableId={item.pathwayCourseId} index={index}>
													{(provided, snapshot) => (
														<div
															ref={provided.innerRef}
															{...provided.draggableProps}
															{...provided.dragHandleProps}
															style={getItemStyle(
																snapshot.isDragging,
																provided.draggableProps.style
															)}
															className='searchLi'
														>
															<span className='deleteX' onClick={() => { this.deletePathwayCourse(item.pathwayCourseId); }}> X </span>
															{item.courseName} {item.required == true ? '(Required)' : ''}
														</div>
													)}
												</Draggable>
											))}
											{provided.placeholder}
										</div>
									)}
								</Droppable>
							</DragDropContext>
						</div>	
						</>
					}
					{this.state.pathwayMode == 'create' &&
						<>

						<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px' }}>
							<div style={{ width: '300px' }}>
								<div className='header'>Add Pathway</div>
								<div>Pathway Name <input id="pathwayName" style={{ float: 'right' }} type="text" /></div>
								<div>Credit Hours <input id="creditHours" type='number' style={{ float: 'right' }} type="text" /></div>
								<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap', justifyContent: 'center' }}>
									<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button createButton' value="Add" onClick={() => { this.addPathway(); }} /></div>
									<div style={{ flex: '1 1 0', textAlign: 'left' }}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ pathwayMode: null }); }} /></div>
								</div>
							</div>
						</div>


						</>
					}
					{this.state.pathwayMode == 'edit' &&
						<>
						<div style={{ backgroundColor: '#ddd', flex: '1 1 0', padding: '15px' }}>
							<div style={{ width: '300px' }}>
								<div className='header'>Edit Pathway</div>
								<div>Pathway Name <input id="pathwayName" defaultValue={this.state.pathway.pathwayName} style={{ float: 'right' }} type="text" /></div>
								<div>Credit Hours <input id="creditHours" defaultValue={this.state.pathway.creditHours} type='number' style={{ float: 'right' }} /></div>
								<div style={{ marginTop: '15px', display: 'flex', flexFlow: 'row-wrap', justifyContent: 'center' }}>
									<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button saveButton' value="Save" onClick={() => { this.savePathway(); }} /></div>
									<div style={{ flex: '0 1 0', textAlign: 'left', marginRight: '15px' }}><input type="button" className='button deleteButton' value="Delete" onClick={() => { this.deletePathway(); }} /></div>
									<div style={{ flex: '1 1 0', textAlign: 'left' }}><input type="button" className='button cancelButton' value="Cancel" onClick={() => { this.setState({ pathwayMode: 'view' }); }} /></div>
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