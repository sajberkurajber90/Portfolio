// handling modal on game init, insert coin message and game btn
import ViewPong from './viewPong.js';
import ViewPaddle from './viewPaddle.js';
import ScreenCoordinates from '../../helper/screenCoordinates.js';

class ViewGameScreen {
  interval; // placeholder to clear interval timer id
  keyPressId; // key press handler id
  keyReleasId; // key lift handler id
  resizeId; // resize event handler id
  constructor() {
    // ############# game elements ##########
    this._gameSec = document.getElementById('#game'); // game section to scroll into
    this._btnGame = document.querySelector('.btn-game'); // btn to start the game
    this._scoreLH = document.querySelector('.game--score-l'); // current score lh
    this._scoreRH = document.querySelector('.game--score-r'); // current score rh
    this._scoreRoundLH = document.querySelector('.game--round-l'); // round score lh
    this._scoreRoundRH = document.querySelector('.game--round-r'); // round score rh
    this._modal = document.querySelector('.modal'); // intoduction modal
    this._backdrop = document.querySelector('.backdrop'); // backdrop
    this._modalCloseBtn = document.querySelector('.modal__button'); // modal close btn
    this._displayMsg = document.querySelector('.game__message'); // running message or round info
    this._display = document.querySelector('.section-game__display'); // display/screen element
    this._gameHeading = document.querySelector('.section-game__heading'); // game heading
    // game main elements
    this._leftPaddleDOM = document.querySelector(
      '.section-game__bracket--left'
    );
    this._rightPaddleDOM = document.querySelector(
      '.section-game__bracket--right'
    );
    this._pongDOM = document.querySelector('.section-game__ball');
    // ##########################################
    // ############# init game objects ##########
    // left paddle
    this.leftPaddle = new ViewPaddle(
      this._leftPaddleDOM,
      this._display,
      ['w', 's'],
      [50, 60, 70]
    );
    // right paddle
    this.rightPaddle = new ViewPaddle(
      this._rightPaddleDOM,
      this._display,
      ['p', 'l'],
      [1242, 1232, 1222]
    );
    // pong
    this.pong = new ViewPong(
      this._pongDOM,
      this._generateObjIntersection('pong'),
      this._display
    );
    // ##########################################
    // ########## init interval message #########
    this.interval = this._initMessageInterval('Insert Coin');

    // ##########################################
    // ####### init observer for heading ########
    this._observer = new IntersectionObserver(
      this._observerHandler.bind(this),
      this._generateObjIntersection('gameHeader')
    );
    this._observer.observe(this._gameHeading);
  }

  _observerHandler(elements) {
    const [element] = elements;
    if (element.isIntersecting) {
      this._gameHeading.classList.add('section-game__heading--in');
      this._observer.disconnect();
    }
  }
  // generate an obj setup for intersection observer
  _generateObjIntersection(useCase) {
    switch (useCase) {
      case 'gameHeader':
        return { root: null, threshold: 0.5 };

      case 'pong':
        const { _display: display } = this;
        return {
          root: display,
          threshold: 1,
          rootMargin: `10px -50px 10px -50px`,
        };
    }
  }
  // interval msg init
  _initMessageInterval(str) {
    const newStr = [...str];
    newStr.splice(newStr.indexOf(' '), 1); // inplace
    this._displayMsg.textContent = '';
    let i = 0;

    return setInterval(() => {
      if (i < newStr.length) {
        newStr[i] === 't'
          ? (this._displayMsg.textContent =
              this._displayMsg.textContent + newStr[i] + ' ')
          : (this._displayMsg.textContent =
              this._displayMsg.textContent + newStr[i]);
        ++i;
      } else {
        i = 0;
        this._displayMsg.textContent = '';
      }
    }, 500);
  }

  // start game loop
  addHandlerGameStartBtn(
    addModalHandler,
    onStrockeKeyHandler,
    onReleaseKeyHandler,
    gameHandler
  ) {
    const gameSec = this._gameSec;
    const btnGame = this._btnGame;
    const displayMsg = this._displayMsg;
    const mainObj = this;
    const backdrop = this._backdrop;
    const modal = this._modal;
    const leftPaddle = this.leftPaddle;
    const rightPaddle = this.rightPaddle;
    const pong = this.pong;
    const scoreLH = this._scoreLH;
    const scoreRH = this._scoreRH;
    const scoreRoundLH = this._scoreRoundLH;
    const scoreRoundRH = this._scoreRoundRH;
    const initMessageInterval = this._initMessageInterval.bind(
      this,
      'Insert Coin'
    );
    const disp = new ScreenCoordinates(this._display);
    // play btn event listener
    this._btnGame.addEventListener('click', event => {
      event.preventDefault();
      // make full screen and reinit disp prop
      console.log('width', window.screen.width, 'height', window.screen.height);
      console.log(window.outerHeight, window.outerWidth);
      if (
        Math.abs(window.screen.width - window.outerWidth) > 100 &&
        Math.abs(window.screen.height - window.outerHeight) > 100
      ) {
        alert('Please maximize the window and try again');
        return;
      }
      // center page
      gameSec.scrollIntoView({ behavior: 'smooth' });
      // disable btn during game
      btnGame.style.pointerEvents = 'none';
      // clear message and mainObj
      clearInterval(mainObj.interval);
      displayMsg.textContent = '';
      // remove scroll bar
      setTimeout(() => {
        document.body.style = 'overflow:hidden;height:100%';
      }, 500);
      // modal-backdrop handling - open
      addModalHandler(backdrop, modal, displayMsg);
      // change the btn description
      btnGame.textContent = 'Press Esc to Exit';
      // add keyboard event listeners
      mainObj.keyPressId = onStrockeKeyHandler.bind(
        null,
        leftPaddle,
        rightPaddle,
        pong,
        scoreLH,
        scoreRH,
        btnGame,
        scoreRoundLH,
        scoreRoundRH,
        mainObj,
        initMessageInterval
      );

      mainObj.keyReleasId = onReleaseKeyHandler.bind(
        null,
        leftPaddle,
        rightPaddle
      );

      // stop the game on resize
      mainObj.resizeId = function () {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      };

      document.addEventListener('keydown', mainObj.keyPressId);
      document.addEventListener('keyup', mainObj.keyReleasId);
      window.addEventListener('resize', mainObj.resizeId);

      // recursive call
      window.requestAnimationFrame(
        gameHandler.bind(
          null,
          disp,
          leftPaddle,
          rightPaddle,
          pong,
          scoreLH,
          scoreRH,
          scoreRoundLH,
          scoreRoundRH,
          displayMsg
        )
      );
    });
  }

  // remove modal on clicking close btn or backdrop
  addHandlerModalClose(handler) {
    // after modal close - event listener is removed
    const backdrop = this._backdrop;
    const modal = this._modal;
    const modalCloseBtn = this._modalCloseBtn;
    const displayMsg = this._displayMsg;
    [this._modalCloseBtn, this._backdrop].forEach(item => {
      item.addEventListener('click', event => {
        handler(event, backdrop, modalCloseBtn, modal, displayMsg),
          { once: true };
      });
    });
  }
}

export default new ViewGameScreen();
