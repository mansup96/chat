import React from "react";
import ReactDom from "react-dom";
import App from './App'

const Root = () => <App />;
/* eslint-enable */

const cont = document.querySelector(`.container`);

ReactDom.render(<Root />, cont);
