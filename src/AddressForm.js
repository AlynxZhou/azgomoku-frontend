import React from 'react'
import './AddressForm.css'
import InputLabel from '@material-ui/core/InputLabel'
import TextField from '@material-ui/core/TextField'
import Container from '@material-ui/core/Container'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'

class AddressForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      'value': this.props.value
    }
  }
  onChange(event) {
    this.setState({'value': event.target.value})
  }
  onSubmit(event) {
    event.preventDefault()
    this.props.onSubmit(this.state.value)
  }
  render() {
    return (
      <Container maxWidth="sm">
        <Paper>
          <form className="address-form" onSubmit={this.onSubmit.bind(this)}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <InputLabel
                  htmlFor="address-input">
                  Please Enter Server Address:
                </InputLabel>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  id="address-input"
                  type="text"
                  value={this.state.value}
                  onChange={this.onChange.bind(this)} />
              </Grid>
              <Grid item xs={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    )
  }
}

export default AddressForm
