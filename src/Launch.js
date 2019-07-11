import React from 'react'
import io from 'socket.io-client'
import Status from './Status'
import AddressForm from './AddressForm'

class Launch extends React.Component {
	onSubmit(server) {
		const socket = io(server)
		this.props.setAppState({server, socket})
		socket.on('watcher', (msg) => {
			const data = JSON.parse(msg)
			const {wid} = data
			this.props.setAppState({'status': Status.LIST, wid})
		})
		socket.emit('watcher', JSON.stringify({}))
	}
	render() {
		return (
			<AddressForm
			  onSubmit={this.onSubmit.bind(this)}
				value={this.props.getAppState().server || 'http://localhost:3003'} />
		)
	}
}

export default Launch
