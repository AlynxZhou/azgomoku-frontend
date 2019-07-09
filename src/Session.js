import React from 'react'
import './Session.css'
import AppContext from './AppContext'

const Color = {NONE: 0, WHITE: 1, BLACK: 2}
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
      'socket': null,
      'wid': null,
      'sid': this.props.match.params.sid,
      'color': null,
      'nextColor': Color.NONE,
      'result': Color.NONE,
      'map': Array(DEFAULT_MAPX * DEFAULT_MAPY).fill(Color.NONE),
      'mapx': DEFAULT_MAPX,
      'mapy': DEFAULT_MAPY
    }
  }
  componentDidMount() {
    const {socket, wid} = this.context
    this.setState({'socket': socket, 'wid': wid})

    socket.on('kochirakoso', (msg) => {
      console.log(msg)
      const data = JSON.parse(msg)
      this.setState(data)
    })

    socket.on('map', (msg) => {
      console.log(msg)
      const data = JSON.parse(msg)
      this.setState(data)
    })

    socket.emit('yoroshiku', JSON.stringify({
      'wid': wid,
      'sid': this.state.sid
    }))
  }
  onButtonClick(x, y) {
    if (this.state.nextColor !== this.state.color) {
      return
    }
    const {socket, wid, sid} = this.state
    socket.emit('step', JSON.stringify({
      'sid': sid,
      'wid': wid,
      'step': {'x': x, 'y': y}
    }))
  }
  getResult() {
    switch (this.state.result) {
      case Color.BLACK:
        return '黑方获胜'
      case Color.WHITE:
        return '白方获胜'
      default:
        return '胜负未分'
    }
  }
  render() {
    return (
      <div className="session">
        <p>{this.getResult()}</p>
        <p>{
          this.state.nextColor === this.state.color ? '轮到我了' : '等待对方'
        }</p>
        <Map data={{
          'map': this.state.map,
          'mapx': this.state.mapx,
          'mapy': this.state.mapy
        }} onClick={this.onButtonClick.bind(this)} />
      </div>
    )
  }
}

Session.contextType = AppContext

export default Session
