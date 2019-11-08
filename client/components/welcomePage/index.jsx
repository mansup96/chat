import React from 'react'

function WelcomePage() {
  return (
    <div className="modal">
      <div className="header"></div>
      <div className="modalContent">
        <div className="modalHeader">
          <h1 className="">TelegramKiller</h1>
          <span>
            Добро пожаловать в TelegramKiller. Быстрейший и безопаснейший клиент
          </span>
          <input
            type="button"
            className="start"
            value="Начать общение"
          />
        </div>
      </div>
    </div>
  )
}

export default WelcomePage
