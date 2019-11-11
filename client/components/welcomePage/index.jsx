import React from 'react'
import cn from 'classnames'
import style from './style.css'
import paperPlane from '../../resources/images/plane.png'
import StartButton from '../startButton'
import LoginInputs from '../loginInputs'

class WelcomePage extends React.PureComponent {
  state = {
    flyAction: false,
	}

  flyAway = () => {
    if (this.state.flyAction === false) {
      this.setState({ flyAction: true })
    } else {
      this.setState({ flyAction: false })
    }
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
                Ваш логин и пароль
              </h1>
            </div>
            <div
              className={cn(style.description, {
                [style.descriptionFlight]: this.state.flyAction,
              })}
            >
              Добро пожаловать в Telegram Killer.
              <br /> Быстрейший и безопаснейший клиент.
            </div>
            <form noValidate>
              <div
                className={cn(style.formClass, {
                  [style.inputsAnim]: this.state.flyAction,
                })}
              >
                {this.state.flyAction ? (
                  <LoginInputs
                    onClick={this.inputsAction}
                    flyAction={this.state.flyAction}
                  />
                ) : null}
              </div>
              <StartButton content={buttonCont} onClick={this.flyAway} />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default WelcomePage
