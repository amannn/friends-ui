import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import data from './data';
import './index.css';

const element = <App {...data} />;
const node = document.getElementById('root');
ReactDOM.createRoot(node).render(element);
