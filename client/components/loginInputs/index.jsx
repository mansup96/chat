/* eslint-disable no-underscore-dangle */
import React from 'react'
import PropTypes from 'prop-types'
import cn from 'classnames'
import style from './style.css'

class LoginInputs extends React.PureComponent {
  logLine = React.createRef()

  passLine = React.createRef()

  state = {
    passInput: '',
    passLength: true,
  }

  passValid = event => {
    const trimmed = event.target.value.trim()
    this.setState({ passInput: trimmed })
    if (this.props.flyAction && trimmed && event.target.value.length < 6) {
      this.setState({ passLength: false })
    }
  }

  shrinkLogLine = () => {
    this.logLine.current.classList.add(style.shrinkLine)
  }

  blurLogLine = () => {
    this.logLine.current.classList.remove(style.shrinkLine)
  }

  shrinkPassLine = () => {
    this.passLine.current.classList.add(style.shrinkLine)
  }

  blurPassLine = () => {
    this.passLine.current.classList.remove(style.shrinkLine)
  }

  render() {
    return (
      <div className="inputsShell">
        <input
          className={cn(style.loginInput)}
          autoСomplete="off"
          placeholder="Login"
          onClick={this.shrinkLogLine}
          onBlur={this.blurLogLine}
        />
        <div className={cn(style.logUnderline)}>
          <div className={cn(style.lineContainer)}>
            <div ref={this.logLine} className={style.line}></div>
          </div>
        </div>
        <input
          className={cn(style.passInput)}
          type="password"
          name="password"
          placeholder="Password"
          onClick={this.shrinkPassLine}
          onBlur={this.blurPassLine}
          onChange={this.passValid}
          value={this.state.passInput}
        />
        <div className={cn(style.passUnderline)}>
          <div className={cn(style.lineContainer)}>
            <div ref={this.passLine} className={cn(style.line)}></div>
          </div>
        </div>
        {this.state.passLength === false ? <div>Пароль должен содержать больше 6 символов</div> : null}
      </div>
    )
  }
}

export default LoginInputs
