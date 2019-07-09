import React from 'react'
import './List.css'
import {Link} from "react-router-dom"
import AppContext from './AppContext'

class List extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'sessions': []
    }
  }
  componentDidMount() {
    const {socket, wid} = this.context
    this.setState({'wid': wid})
    socket.on('list', (msg) => {
      console.log(msg)
      this.setState(JSON.parse(msg))
    })
    socket.emit('list', JSON.stringify({'wid': wid}))
  }
  onButtonClick() {
    const {socket, wid} = this.context
    socket.on('session', (msg) => {
      const data = JSON.parse(msg)
      this.props.history.push(`/session/${data.sid}`)
    })
    socket.emit('session', JSON.stringify({'wid': wid}))
  }
  renderList(session) {
    return (
      <li>
        sid: {session.sid}, numbers: {session.watchersLength}, <Link to={`/session/${session.sid}`}>join</Link>
      </li>
    )
  }
  render() {
    return (
      <div className='list'>
        <span>Session List</span>
        <ul>
          {this.state.sessions.map(this.renderList.bind(this))}
        </ul>
        <button onClick={this.onButtonClick.bind(this)}>New</button>
      </div>
    )
  }
}

List.contextType = AppContext

export default List
