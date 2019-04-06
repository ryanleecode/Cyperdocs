import BlueBirdPromise from 'bluebird';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.scss';
import * as serviceWorker from './serviceWorker';
const isProd = process.env.NODE_ENV === 'production';

global.Promise = BlueBirdPromise;
if (!isProd) {
  BlueBirdPromise.config({
    longStackTraces: true,
    warnings: false,
  });
} else {
  BlueBirdPromise.config({
    longStackTraces: false,
    warnings: false,
  });
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
