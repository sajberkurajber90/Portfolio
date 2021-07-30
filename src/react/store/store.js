import { createStore } from 'redux';

const initState = { input: '', query: [], winWidth: window.innerWidth };

const reducer = function (state = initState, action) {
  switch (action.type) {
    case 'INPUT':
      return {
        input: action.input,
        query: [...state.query],
        winWidth: state.winWidth,
      };

    case 'ALL_INPUTS':
      return {
        input: state.input,
        query: action.arr ? [...action.arr] : [...state.query, state.input],
        winWidth: state.winWidth,
      };

    case 'RESIZE': {
      return {
        input: state.input,
        query: [...state.query],
        winWidth: action.width,
      };
    }
    default:
      return state;
  }
};
// let know the store who is reducer
const store = createStore(reducer);

export default store;
