import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import io from 'socket.io-client'
import './App.css'
import List from './List'
import Session from './Session'
import AppContext from './AppContext'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			'socket': null,
			'wid': null,
			'isConnected': false,
			'isConnecting': false,
			'isBusy': false
		}
	}
	componentDidMount() {
		this.setState({'isConnecting': true})
		const socket = io('http://localhost:3003')
		socket.on('connected', (msg) => {
			const data = JSON.parse(msg)
			const {wid} = data
			this.setState({
				'socket': socket,
				'wid': wid,
				'isConnecting': false,
				'isConnected': true
			})
		})
	}
	renderContent() {
		if (!this.state.isConnected) {
			return (
				<span>Loading</span>
			)
		}
		return (
			<AppContext.Provider value={{
				'socket': this.state.socket,
				'wid': this.state.wid
			}}>
				<Router>
					<Route path="/session/:sid" component={Session} />
					<Route path="/session" exact component={Session} />
					<Route path="/" exact component={List} />
				</Router>
			</AppContext.Provider>
		)
	}
	render() {
		return (
			<div className="app">
				{this.renderContent()}
			</div>
		)
	}
}

export default App
