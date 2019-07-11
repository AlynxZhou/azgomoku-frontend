import React from 'react'
import './App.css'
import Status from './Status'
import Launch from './Launch'
import List from './List'
import Session from './Session'
import Container from '@material-ui/core/Container'

class App extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			'status': Status.LAUNCH,
			'socket': null,
			'server': null,
			'wid': null,
			'sid': null
		}
		this.passProps = {
			'getAppState': this.getAppState.bind(this),
			'setAppState': this.setAppState.bind(this)
		}
	}
	getAppState() {
		return this.state
	}
	setAppState(obj) {
		return this.setState(obj)
	}
	renderContent() {
		switch (this.state.status) {
			case Status.LIST:
				return <List {...this.passProps} />
			case Status.SESSION_CREATE:
				return <Session {...this.passProps} />
			case Status.SESSION_JOIN:
				return <Session isWatching={false} {...this.passProps} />
			case Status.SESSION_WATCH:
				return <Session isWatching={true} {...this.passProps} />
			default:
				return <Launch {...this.passProps} />
		}
	}
	render() {
		return (
			<Container maxWidth="md">
				<div className="app">
					{this.renderContent()}
				</div>
			</Container>
		)
	}
}

export default App
