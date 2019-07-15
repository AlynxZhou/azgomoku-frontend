import React from 'react'
import './Session.css'
import Status from './Status'
import Button from '@material-ui/core/Button'

const Color = {'NONE': 1, 'WHITE': 2, 'BLACK': 3}
const DEFAULT_MAPX = 15
const DEFAULT_MAPY = 15

class Grid extends React.Component {
  render() {
    let content = ''
    switch (this.props.value) {
      case Color.WHITE:
        content = '白'
        break
      case Color.BLACK:
        content = '黑'
        break
      default:
        content = ''
        break
    }
    return (
      <button className="grid" onClick={this.props.onClick}>{content}</button>
    );
  }
}

class Map extends React.Component {
  renderRow(row) {
    return (
      <div className="map-row">
        {row.map(this.renderGrid.bind(this))}
      </div>
    )
  }
  renderGrid(g) {
    return <Grid value={g.v} onClick={() => {this.props.onClick(g.x, g.y)}} />
  }
  render() {
    const rows = [[]]
    const {map, mapx, mapy} = this.props.data
    for (let v of map) {
      rows[rows.length - 1].push({
        'v': v,
        'x': rows[rows.length - 1].length,
        'y': rows.length - 1
      })
      if (rows[rows.length - 1].length >= mapx && rows.length < mapy) {
        rows.push([])
      }
    }
    return (
      <div className="map">
        {rows.map(this.renderRow.bind(this))}
      </div>
    )
  }
}

class Session extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'color': null,
      'nextColor': Color.NONE,
      'result': null,
      'isWatching': this.props.isWatching,
      'map': new Array(DEFAULT_MAPX * DEFAULT_MAPY).fill(Color.NONE),
      'mapx': DEFAULT_MAPX,
      'mapy': DEFAULT_MAPY,
      'sayonara': null
    }
  }
  componentDidMount() {
    const {socket, wid, sid} = this.props.getAppState()
    socket.on('map', (msg) => {
      const data = JSON.parse(msg)
      this.setState(data)
    })
    socket.on('sayonara', (msg) => {
      const data = JSON.parse(msg)
      this.setState(data)
    })
    socket.on('arimasen', (msg) => {
      this.props.setAppState({'status': Status.LIST, 'sid': null})
    })
    if (this.state.isWatching) {
      socket.emit('sumimasen', JSON.stringify({'wid': wid, 'sid': sid}))
    } else {
      socket.on('kochirakoso', (msg) => {
        const data = JSON.parse(msg)
        const {color} = data
        this.setState({color})
      })
      socket.emit('yoroshiku', JSON.stringify({'wid': wid, 'sid': sid}))
    }
  }
  onGridClick(x, y) {
    if (this.state.nextColor !== this.state.color ||
        this.state.isWatching) {
      return
    }
    const {socket, wid, sid} = this.props.getAppState()
    socket.emit('step', JSON.stringify({
      'sid': sid,
      'wid': wid,
      'step': {'x': x, 'y': y}
    }))
  }
  onListButtonClick() {
    this.props.setAppState({'status': Status.LIST})
  }
  onDisconnectButtonClick() {
    const {socket, wid} = this.props.getAppState()
    socket.emit('sayonara', JSON.stringify({wid}))
    socket.disconnect()
    this.props.setAppState({
      'status': Status.LAUNCH,
      'socket': null,
      'sid': null,
      'wid': null
    })
  }
  getResult() {
    if (this.state.sayonara === Color.BLACK) {
      return 'Black Escaped!'
    } else if (this.state.sayonara === Color.WHITE) {
      return 'White Escaped!'
    }
    switch (this.state.result) {
      case Color.BLACK:
        return 'Black Wins!'
      case Color.WHITE:
        return 'White Wins!'
      case Color.NONE:
        return 'No One Wins!'
      default:
        return 'Not Finished.'
    }
  }
  getNext() {
    if (this.state.isWatching) {
      return 'Keep Quiet While Watching.'
    }
    return this.state.nextColor === this.state.color
      ? 'My Turn!'
      : 'Not My Turn!'
  }
  render() {
    return (
      <div className="session">
        <h1>Session {this.state.sid}</h1>
        <h2>{this.getResult()}</h2>
        <h2>{this.getNext()}</h2>
        <div className="buttons">
          <Button
            variant="contained"
            color="primary" onClick={this.onListButtonClick.bind(this)}>
            List
          </Button> <Button
            variant="contained"
            color="primary" onClick={this.onDisconnectButtonClick.bind(this)}>
            Disconnect
          </Button>
        </div>
        <Map data={{
          'map': this.state.map,
          'mapx': this.state.mapx,
          'mapy': this.state.mapy
        }} onClick={this.onGridClick.bind(this)} />
      </div>
    )
  }
}

export default Session
