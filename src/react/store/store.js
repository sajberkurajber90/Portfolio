import { createStore } from 'redux';
console.log('INIT STORE');
const initState = {
  input: '',
  winWidth: window.innerWidth,
  currentWeather: [],
  onClickLocation: '',
  currentUrl: [],
  replaceHistory: false,
  inputSource: false,
  modalHidden: true,
  errorLocation: [],
};

// the following is handeled in the store:
// - update url on refreash
// - make sure to match url with city names
// - url update on error
// - modal for not displayed cities
// - error handling
// - Chard handling

const reducer = function (state = initState, action) {
  switch (action.type) {
    case 'INPUT':
      return {
        input: action.input, // last input
        winWidth: state.winWidth, // win size for responsive design
        currentWeather: [...state.currentWeather], // current weather data
        onClickLocation: state.onClickLocation, // clicked location
        currentUrl: [...state.currentUrl], // currentUrl data
        replaceHistory: state.replaceHistory, // replace history flag
        inputSource: state.inputSource, // is event comming from home input field or manual url update
        modalHidden: state.modalHidden, // logic for showing and hidding modal
        errorLocation: [...state.errorLocation], // list of the error queryies
      };

    case 'ALL_INPUTS':
      return {
        input: state.input,
        winWidth: state.winWidth,
        currentWeather: [...state.currentWeather],
        onClickLocation: state.onClickLocation,
        currentUrl: action.payload
          ? [...action.payload]
          : [...state.currentUrl, state.input],
        replaceHistory: false,
        inputSource: action.source ? action.source : false,
        modalHidden: state.modalHidden,
        errorLocation: [...state.errorLocation],
      };

    case 'RESIZE': {
      return {
        input: state.input,
        winWidth: action.width,
        currentWeather: [...state.currentWeather],
        onClickLocation: state.onClickLocation,
        currentUrl: [...state.currentUrl],
        replaceHistory: state.replaceHistory,
        inputSource: state.inputSource,
        modalHidden: state.modalHidden,
        errorLocation: [...state.errorLocation],
      };
    }

    case 'ALL_CURRENT':
      // repalce city name with correct one
      let currentUrl = [...state.currentUrl];
      const city = action.city;
      let replaceHistory = false;
      if (city !== action.current.name) {
        const index = currentUrl.indexOf(city);
        console.log(index);
        index > -1 ? (currentUrl[index] = action.current.name) : '';
        replaceHistory = true;
      }

      // different input same result - remove input from url
      const isIncluding = state.currentWeather
        .map(element => element.id)
        .includes(action.current.id);

      // exclude from url the results which yild sam result
      if (isIncluding) {
        currentUrl = currentUrl.filter(element => {
          return element !== city;
        });
        replaceHistory = true;
      }

      return {
        input: state.input,
        winWidth: state.winWidth,
        currentWeather: state.currentWeather
          .map(element => element.id)
          .includes(action.current.id)
          ? [...state.currentWeather]
          : [...state.currentWeather, action.current],
        onClickLocation: state.onClickLocation,
        currentUrl: [...currentUrl],
        replaceHistory: replaceHistory,
        inputSource: false,
        modalHidden: state.modalHidden,
        errorLocation: [...state.errorLocation],
      };

    case 'MODAL':
      return {
        input: state.input,
        winWidth: state.winWidth,
        currentWeather: [...state.currentWeather],
        onClickLocation: state.onClickLocation,
        currentUrl: [...state.currentUrl],
        replaceHistory: state.replaceHistory,
        inputSource: state.inputSource,
        modalHidden: action.payload,
        errorLocation: [...state.errorLocation],
      };

    case 'ERROR':
      let errorCity;
      let errorLocation;
      let url;
      if (typeof action.payload !== 'object') {
        errorCity = action.payload;
        errorLocation = [...state.errorLocation];
        errorLocation.push(errorCity);
        // handle duplciates
        errorLocation = [...new Set(errorLocation)];
        // filter out url
        url = [...state.currentUrl].filter(element => {
          return element !== errorCity;
        });
      }

      return {
        input: state.input,
        winWidth: state.winWidth,
        currentWeather: [...state.currentWeather],
        onClickLocation: state.onClickLocation,
        currentUrl: action.clear ? [...state.currentUrl] : [...url],
        replaceHistory: action.replaceHistory ? true : false,
        inputSource: false,
        modalHidden: state.modalHidden,
        errorLocation: action.clear ? [] : [...errorLocation],
      };

    case 'ON_CARD_CLICK':
      return {
        input: state.input,
        winWidth: state.winWidth,
        currentWeather: [...state.currentWeather],
        onClickLocation: action.payload,
        currentUrl: [...state.currentUrl],
        replaceHistory: false,
        inputSource: false,
        modalHidden: state.modalHidden,
        errorLocation: [...state.errorLocation],
      };

    default:
      return state;
  }
};

// let know the store who is reducer
const store = createStore(reducer);

export default store;
