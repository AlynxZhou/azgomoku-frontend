import React from 'react'
import './List.css'
import Status from './Status'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'sessions': []
    }
  }
  componentDidMount() {
    const {socket, wid} = this.props.getAppState()
    socket.on('list', (msg) => {
      const data = JSON.parse(msg)
      const {sessions} = data
      this.setState({sessions})
    })
    socket.emit('list', JSON.stringify({wid}))
  }
  onNewButtonClick() {
    const {socket, wid} = this.props.getAppState()
    socket.on('session', (msg) => {
      const data = JSON.parse(msg)
      const {sid} = data
      this.props.setAppState({'status': Status.SESSION_JOIN, sid})
    })
    socket.emit('session', JSON.stringify({wid}))
  }
  onJoinButtonClick(sid) {
    this.props.setAppState({'status': Status.SESSION_JOIN, sid})
  }
  onWatchButtonClick(sid) {
    this.props.setAppState({'status': Status.SESSION_WATCH, sid})  
  }
  renderSession(session) {
    return (
      <TableRow key={session.sid}>
        <TableCell component="th" scope="row">{session.sid}</TableCell>
        <TableCell align="right">{session.wids.length}</TableCell>
        <TableCell align="right">
          {session.canJoin
            ? <Button variant="contained"
                color="primary"
                onClick={() => {
                  this.onJoinButtonClick(session.sid)
                }}>
                Join
              </Button>
            : ''}
          <br />
          <Button variant="contained"
            color="primary"
            onClick={() => {
              this.onWatchButtonClick(session.sid)
            }}>
            Watch
          </Button>
        </TableCell>
      </TableRow>
    )
  }
  render() {
    return (
      <div className='list'>
        <h1>Session List</h1>
        <Button
          variant="contained"
          color="primary"
          onClick={this.onNewButtonClick.bind(this)}>
          New
        </Button>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Session ID</TableCell>
              <TableCell align="right">Watchers Number</TableCell>
              <TableCell align="right">Operation</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.sessions.map(this.renderSession.bind(this))}
          </TableBody>
        </Table>
      </div>
    )
  }
}

export default List
