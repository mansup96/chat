import React from "react";
import ReactDom from "react-dom";
import App from './Apps'

const Root = () => <App />;
/* eslint-enable */

const cont = document.querySelector(`#app`);

ReactDom.render(<Root />, cont);
