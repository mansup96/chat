import React from 'react'
import cn from 'classnames'
import style from './style.css'

class StartButton extends React.PureComponent {
  roundContainer = React.createRef()

  round = React.createRef()

  // state = {
  //   mouseDown: false,
  // }

  roundShrink = event => {
    this.round.current.classList.remove(style.roundShrink)
    const coordX = event.nativeEvent.offsetX
    const coordY = event.nativeEvent.offsetY

    setTimeout(() => {
      this.roundContainer.current.style.top = `${coordY - 35}px`
      this.roundContainer.current.style.left = `${coordX}px`
      this.round.current.classList.add(style.roundShrink)
    }, 1)
  }

  coordsToNull = event => {
    setTimeout(() => {
      this.round.current.classList.remove(style.roundShrink)
    }, 300)
  }

  render() {
    return (
      <button
        type="button"
        onClick={this.props.onClick}
        onMouseDown={this.roundShrink}
        onMouseUp={this.coordsToNull}
        className={style.startButton}
      >
        {this.props.content}
        <div ref={this.roundContainer} className={style.roundContainer}>
          <div
            ref={this.round}
            className={cn(style.round, {
              // [style.roundShrink]: this.state.mouseDown,
            })}
          />
        </div>
      </button>
    )
  }
}


export default StartButton
