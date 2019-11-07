import React from 'react'
import ReactDom from 'react-dom'
import App from './App'

const Root = () => <App />

const cont = document.querySelector('#app')

ReactDom.render(<Root />, cont)
