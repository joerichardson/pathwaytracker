import React, { Component } from 'react';
//import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import logo from './logo.svg';
import './App.css';
import Students from './components/students/Students';
import Courses from './components/courses/Courses';
import Pathways from './components/pathways/Pathways';
import Index from './components/index/Index';


class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			courses: [],
			pathways: [],
			students: [],
		};
	}
	componentDidMount() {
		//fetch('/pathways')
		//	.then(res => res.json())
		//	.then(pathways => {
		//		this.setState({ pathways: pathways }, () => {
		//			console.log(this.state.pathways);
		//		});
		//	});
		//fetch('/courses')
		//	.then(res => res.json())
		//	.then(courses => {
		//		this.setState({ courses: courses }, () => {
		//			console.log(this.state.courses);
		//		});
		//	});
		//fetch('/students')
		//	.then(res => res.json())
		//	.then(students => {
		//		this.setState({ students : students}, () => {
		//			console.log(this.state.students);
		//		});
		//	});

	}
	render() {
		return (
			<Router>
				<>
					<div className="App" style={{ 'height': '75px' }}>
						<img style={{ width: '100px', position: 'absolute', 'left': 0, top: 0, }} src='http://floridaprospect.shortcart.com/wp-content/uploads/sites/27/2018/02/IRSC-Logo.png' />

					<div><Link to="/student">Students</Link></div>
					<div><Link to="/courses">Courses</Link></div>
					<div><Link to="/pathways">Pathways</Link></div>
				</div>
					<Route path="/student/" component={Students} />
					<Route path="/courses/" component={Courses} />
					<Route path="/pathways/" component={Pathways} />
					<Route exact="" path="/" component={Index} />
				</>
			</Router>
		);
	}
}

export default App;
