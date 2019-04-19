import React, { Component } from 'react';
//import React from "react";
import { Link } from "react-router-dom";

export default class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		};
	}


	render() {
		return (
			<>
				<div style={{backgroundColor: "#ddd", position: 'absolute', left: '0px', top: '75px', bottom: '0px', right:'0px', 'textAlign': 'center'}}>
					<h1 style={{marginTop: '150px'}}>Welcome to the IRSC Student Pathway Progress Tracking Database</h1>
				</div>
			</>
		)
	}
}