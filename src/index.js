import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import data from './data';
import './index.css';

ReactDOM.render(<App {...data} />, document.getElementById('root'));
