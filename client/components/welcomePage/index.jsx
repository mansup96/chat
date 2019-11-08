import React from 'react'
import cn from 'classnames'
import style from './style.css'
import paperPlane from '../../resources/images/plane.png'

class WelcomePage extends React.PureComponent {
  state = {
    flyAction: false,
  }

  flyAway = () => {
    this.setState({ flyAction: true })
  }

  render() {
    let buttonCont = ''
    if (this.state.flyAction === false) {
      buttonCont = 'начать общение'
    } else {
      buttonCont = 'продолжить'
    }
    return (
      <div className={cn(style.modal)}>
        <div
          className={cn(style.header, {
            [style.headerFlight]: this.state.flyAction,
          })}
        >
          <img
            className={cn(style.plane, {
              [style.planeFlight]: this.state.flyAction,
            })}
            src={paperPlane}
            alt="plane"
          />
        </div>
        <div
          className={cn(style.modalContent, {
            [style.modalContentFlight]: this.state.flyAction,
          })}
        >
          <div className={cn(style.modalWindow)}>
            <div className={cn(style.changeHeading)}>
              <h1
                className={cn(style.title, {
                  [style.titleFlight]: this.state.flyAction,
                })}
              >
                TelegramKiller
              </h1>
              <h1
                className={cn(style.title, style.login, {
                  [style.loginFlight]: this.state.flyAction,
                })}
              >
                Привет, епта!
              </h1>
            </div>
            <div className={cn(style.description)}>
              Добро пожаловать в Telegram Killer.
              <br /> Быстрейший и безопаснейший клиент.
            </div>
            <button
              type="button"
              onClick={this.flyAway}
              className={style.startButton}
            >
              {buttonCont}
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default WelcomePage
