import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { Provider } from 'react-redux';
import store from './store/store';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

ReactDOM.render(React.createElement(
  HashRouter,
  null,
  React.createElement(
    Provider,
    { store: store },
    React.createElement(App, null)
  )
), document.getElementById('root'));