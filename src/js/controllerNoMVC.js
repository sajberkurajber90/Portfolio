'use strict';
// imports
import viewNavigation from './views/viewNavigation.js';

// selected elements
const gameSec = document.getElementById('#game');
const btnGame = document.querySelector('.btn-game');
const RADTODEG = Math.PI / 180;
const scoreLH = document.querySelector('.game--score-l');
const scoreRH = document.querySelector('.game--score-r');
const scoreRoundLH = document.querySelector('.game--round-l');
const scoreRoundRH = document.querySelector('.game--round-r');
const modal = document.querySelector('.modal');
const backdrop = document.querySelector('.backdrop');
const modalCloseBtn = document.querySelector('.modal__button');

// game elements
const display = document.querySelector('.section-game__display');
const leftBar = document.querySelector('.section-game__bracket--left');
const rightBar = document.querySelector('.section-game__bracket--right');
const ball = document.querySelector('.section-game__ball');
const displayMsg = document.querySelector('.game__message');
const randomIntfromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// game stats
const gameProps = {
  leftPoint: 0,
  rightPoint: 0,
  leftRound: 0,
  rightRound: 0,
  round: 1,
  msgLeft: 'LEFT WINS',
  msgRight: 'RIGHT WINS',
  endGame: true,
  disebleKeys: ['ArrowUp', 'ArrowDown', ' '],
  showModal: false,
  blockPaddle: false,
  init() {
    this.rightPoint = 0;
    this.leftPoint = 0;
  },
  reInitGame() {
    this.rightPoint = 0;
    this.leftPoint = 0;
    this.round = 1;
    this.leftRound = 0;
    this.rightRound = 0;
    this.endGame = true;
  },
};

// display Msg - insert coin
const insertCoinMsg = function (str) {
  const newStr = [...str];
  newStr.splice(newStr.indexOf(' '), 1); // inplace
  displayMsg.textContent = '';
  let i = 0;

  return setInterval(() => {
    if (i < newStr.length) {
      newStr[i] === 't'
        ? (displayMsg.textContent = displayMsg.textContent + newStr[i] + ' ')
        : (displayMsg.textContent = displayMsg.textContent + newStr[i]);
      ++i;
    } else {
      i = 0;
      displayMsg.textContent = '';
    }
  }, 500);
};

let intervalMsg = insertCoinMsg('Insert Coin');

// --game-

class Coordinates {
  constructor(element) {
    this.element = element;
  }

  posX() {
    return this.element.getBoundingClientRect().x - window.pageXOffset;
  }

  posY() {
    return this.element.getBoundingClientRect().y - window.pageYOffset;
  }

  posBottom() {
    return this.element.getBoundingClientRect().bottom - window.pageYOffset;
  }
  posRight() {
    return this.element.getBoundingClientRect().right - window.pageXOffset;
  }
}

// Bar class
class Bar extends Coordinates {
  constructor(element, disp, keys, depth) {
    super(element);
    this.disp = disp;
    this._position = [this.posY() - this.disp.posY()];
    this._initPos = this.posY() - this.disp.posY();
    this._keys = keys;
    this._keyUP = true;
    this._keyDown = true;
    this.pressKey = '';
    this._height = [100, 90, 80];
    this._depth = depth;
    this.maxYFlag = false;
    this._maxY =
      this.disp.posBottom() -
      this.disp.posY() -
      (this.posBottom() - this.posY());
  }

  init(round) {
    const adaptor = (this._height[0] - this._height[round]) / 2;
    // return paddles to neutral position - take in account the round
    this._position = [this._initPos + adaptor];
    // adjustment for maxY - codnitionaly try if statement
    if (this.maxYFlag) {
      this._maxY = this._maxY + 10;
    }
    this.element.style = `top:${this._position[0]}px;height:${this._height[round]}px;
    left:${this._depth[round]}px;`;
    // reset flag
    this.maxYFlag = false;
  }

  move(round) {
    // moveUp
    if (this.pressKey === this._keys[0]) {
      this._position.push(
        this._position[0] - 10 > 0 ? this._position[0] - 10 : 0
      );
      // pop previous state
      this._position.shift();
      // set style
      this.element.style = `top:${this._position[0]}px;height:${this._height[round]}px;
      left:${this._depth[round]}px;`;
    }
    // moveDown
    if (this.pressKey === this._keys[1]) {
      this._position.push(
        this._position[0] + 10 < this._maxY
          ? this._position[0] + 10
          : this._maxY
      );
      // pop previous state
      this._position.shift();
      // set style
      this.element.style = `top:${this._position[0]}px;height:${this._height[round]}px;
      left:${this._depth[round]}px;`;
    }
  }
}

// Ball class
class Ball extends Coordinates {
  observer; // observer obj
  constructor(element, prop, disp) {
    super(element);
    this._prop = prop;
    this.state = '';
    this.element = element;
    this._addObserver(this.element);
    this.caseState = 'init';
    this._positionX = [];
    this._positionY = [];
    this.disp = disp;
    this.randPos = '';
    this.nextState = 'goRightUp';
    this.transparence = true;
    this.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
    this.dx = 10;
    this.dy = 0;
  }

  _intersection(entries) {
    const [entry] = entries;
    entry.isIntersecting ? (this.state = true) : (this.state = false);
  }

  _addObserver(element) {
    this.observer = new IntersectionObserver(
      this._intersection.bind(this),
      this._prop
    );
    this.observer.observe(element);
  }

  // set Left/Bottom style property
  setPosition(x, y) {
    if (this.caseState === 'init' || this.transparence) {
      this.element.style = `left:${x}px;
     bottom:${y}px; opacity:0;`;
    }
    if (this.caseState !== 'init') {
      this.element.style = `left:${x}px;
      bottom:${y}px; opacity:${this.transparence ? 0 : 1};`;
      if (y > 50 && y < this.disp.posBottom() - this.disp.posY() - 50) {
        this.transparence = false;
      }
    }
  }

  move() {
    switch (this.caseState) {
      case 'init':
        this._positionX[0] =
          (this.disp.posRight() - this.disp.posX()) / 2 -
          (this.posRight() - this.posX()) / 2;
        if (this.randPos === 'top') {
          this._positionY[0] =
            -this.disp.posY() +
            this.disp.posBottom() -
            (-this.posY() + this.posBottom());
        } else if (this.randPos === 'middle') {
          this._positionY[0] =
            (-this.disp.posY() + this.disp.posBottom()) / 2 -
            (-this.posY() + this.posBottom());
        } else {
          this._positionY[0] = 0;
        }

        this.transparence = true;
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
      case 'goRightUp':
        this.dy = this.dx * this.randAngle;
        this._positionX.push(this._positionX[0] + this.dx);
        this._positionX.shift();
        this._positionY.push(this._positionY[0] + this.dy);
        this._positionY.shift();
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
      case 'goRightDown':
        this.dy = this.dx * this.randAngle;
        this._positionX.push(this._positionX[0] + this.dx);
        this._positionX.shift();
        this._positionY.push(this._positionY[0] - this.dy);
        this._positionY.shift();
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
      case 'goLeftUp':
        this.dy = this.dx * this.randAngle;
        this._positionX.push(this._positionX[0] - this.dx);
        this._positionX.shift();
        this._positionY.push(this._positionY[0] + this.dy);
        this._positionY.shift();
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
      case 'goLeftDown':
        this.dy = this.dx * this.randAngle;
        this._positionX.push(this._positionX[0] - this.dx);
        this._positionX.shift();
        this._positionY.push(this._positionY[0] - this.dy);
        this._positionY.shift();
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
    }
  }
}

const game = function (disp, lhBar, rhBar, hitBall) {
  // Round Check - Left Bar
  if (gameProps.leftPoint === 5) {
    gameProps.init();
    hitBall.caseState = 'init';
    hitBall.nextState = 'goLeftUp';
    // reinit scores on disp with delay
    setTimeout(() => {
      scoreLH.textContent = `${gameProps.leftPoint}`;
      scoreRH.textContent = `${gameProps.rightPoint}`;
    }, 500);
    // increas a round for left
    ++gameProps.leftRound;
    // reset round score on display with delay
    setTimeout(() => {
      scoreRoundLH.textContent = `${gameProps.leftRound}`;
    }, 500);
    if (gameProps.leftRound === 3) {
      displayMsg.textContent = gameProps.msgLeft;
      setTimeout(() => {
        displayMsg.textContent = '';
      }, 1000);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    } else {
      // update the message round
      ++gameProps.round;
      displayMsg.textContent = `Round ${gameProps.round}`;
      setTimeout(() => (displayMsg.textContent = ''), 2000);
      // adjust maxY with a flag
      lhBar.maxYFlag = true;
      // resize the bar
      lhBar.init(gameProps.leftRound);
    }
  }

  // Round Check - Right Bar
  if (gameProps.rightPoint === 5) {
    gameProps.init();
    hitBall.caseState = 'init';
    hitBall.nextState = 'goRightUp';
    // reinit scores on disp with delay
    setTimeout(() => {
      scoreLH.textContent = `${gameProps.leftPoint}`;
      scoreRH.textContent = `${gameProps.rightPoint}`;
    }, 500);
    // increas a round for right
    ++gameProps.rightRound;
    // reset round score on display with delay
    setTimeout(() => {
      scoreRoundRH.textContent = `${gameProps.rightRound}`;
    }, 500);
    // after 3 won rounds -> kill game
    if (gameProps.rightRound === 3) {
      displayMsg.textContent = gameProps.msgRight;
      setTimeout(() => {
        displayMsg.textContent = '';
      }, 1000);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    } else {
      // update the message
      ++gameProps.round;
      displayMsg.textContent = `Round ${gameProps.round}`;
      setTimeout(() => (displayMsg.textContent = ''), 2000);
      // adjust maxY with a flag
      rhBar.maxYFlag = true;
      // resize a bar
      rhBar.init(gameProps.rightRound);
    }
  }

  // paddle movement
  if (gameProps.showModal) {
    lhBar.move(gameProps.leftRound);
    rhBar.move(gameProps.rightRound);
  }

  // ball movement
  switch (hitBall.caseState) {
    case 'init':
      hitBall.move();
      (['p', 'l'].includes(rhBar.pressKey) ||
        ['w', 's'].includes(lhBar.pressKey)) &&
      gameProps.showModal
        ? (hitBall.caseState = hitBall.nextState)
        : (hitBall.caseState = 'init');
      break;
    case 'goRightUp':
      hitBall.move();
      if (
        hitBall.posRight() + 10 > rhBar.posX() &&
        hitBall.posBottom() > rhBar.posY() - 10 &&
        hitBall.posY() < rhBar.posBottom() + 10
      ) {
        hitBall.caseState = 'goLeftUp';
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      if (hitBall.posY() - 10 < disp.posY()) {
        hitBall.caseState = 'goRightDown';
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }

      if (!hitBall.state) {
        // score update
        scoreLH.textContent = `${++gameProps.leftPoint}`;
        lhBar.init(gameProps.leftRound);
        rhBar.init(gameProps.rightRound);
        hitBall.caseState = 'init';
        hitBall.randPos = hitBall.randPos === 'top' ? 'middle' : 'top';
        hitBall.nextState = 'goRightDown';
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(40 * RADTODEG);
      }
      break;
    case 'goRightDown':
      hitBall.move();
      if (
        hitBall.posRight() + 10 > rhBar.posX() &&
        hitBall.posBottom() > rhBar.posY() - 10 &&
        hitBall.posY() < rhBar.posBottom() + 10
      ) {
        hitBall.caseState = 'goLeftDown';
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      if (hitBall.posBottom() + 10 > disp.posBottom()) {
        hitBall.caseState = 'goRightUp';
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      if (!hitBall.state) {
        // score update
        scoreLH.textContent = `${++gameProps.leftPoint}`;
        lhBar.init(gameProps.leftRound);
        rhBar.init(gameProps.rightRound);
        hitBall.caseState = 'init';
        hitBall.randPos = hitBall.randPos === 'bottom' ? 'middle' : 'bottom';
        hitBall.nextState = 'goRightUp';
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(40 * RADTODEG);
      }
      break;
    case 'goLeftDown':
      hitBall.move();
      if (
        hitBall.posX() - 10 < lhBar.posRight() &&
        hitBall.posBottom() > lhBar.posY() - 10 &&
        hitBall.posY() < lhBar.posBottom() + 10
      ) {
        hitBall.caseState = 'goRightDown';
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }

      if (hitBall.posBottom() + 10 > disp.posBottom()) {
        hitBall.caseState = 'goLeftUp';
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }

      if (!hitBall.state) {
        scoreRH.textContent = `${++gameProps.rightPoint}`;
        lhBar.init(gameProps.leftRound);
        rhBar.init(gameProps.rightRound);
        hitBall.caseState = 'init';
        hitBall.randPos = hitBall.randPos === 'bottom' ? 'middle' : 'bottom';
        hitBall.nextState = 'goLeftUp';
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(40 * RADTODEG);
      }
      break;
    case 'goLeftUp':
      hitBall.move();
      if (
        hitBall.posX() - 10 < lhBar.posRight() &&
        hitBall.posBottom() > lhBar.posY() - 10 &&
        hitBall.posY() < lhBar.posBottom() + 10
      ) {
        hitBall.caseState = 'goRightUp';
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      if (hitBall.posY() - 10 < disp.posY()) {
        hitBall.caseState = 'goLeftDown';
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }

      if (!hitBall.state) {
        scoreRH.textContent = `${++gameProps.rightPoint}`;
        lhBar.init(gameProps.leftRound);
        rhBar.init(gameProps.rightRound);
        hitBall.caseState = 'init';
        hitBall.randPos = hitBall.randPos === 'top' ? 'middle' : 'top';
        hitBall.nextState = 'goLeftDown';
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(40 * RADTODEG);
      }
      break;
  }

  // block paddles for 0.2s
  if (!hitBall.state && !gameProps.blockPaddle) {
    gameProps.blockPaddle = true;
    setTimeout(() => {
      gameProps.blockPaddle = false;
    }, 400);
  }

  const animId = window.requestAnimationFrame(
    game.bind(null, disp, lhBar, rhBar, hitBall)
  );

  // kill the game
  if (gameProps.endGame) {
    window.cancelAnimationFrame(animId);
  }
};

// game start
btnGame.addEventListener('click', e => {
  e.preventDefault();
  // center the page
  gameSec.scrollIntoView({ behavior: 'smooth' });
  // disable btn
  btnGame.style.pointerEvents = 'none';

  // stop inserCoinMSG
  clearInterval(intervalMsg);
  // clear message
  displayMsg.textContent = '';
  // enable game recursion
  gameProps.endGame = false;
  // kill overflow
  setTimeout(() => {
    document.body.style = 'overflow:hidden;height:100%';
  }, 500);

  // insert modal and backdrop
  if (!gameProps.showModal) {
    backdrop.classList.remove('hidden');
    backdrop.classList.add('backdrop__animation--in');
    modal.classList.add('modal__animation--in');
  } else {
    setTimeout(() => {
      // disp current game round
      displayMsg.textContent = `Round ${gameProps.round}`;
      // play the sound
      document.querySelector('.ready-to-fight').play();
      // clear message
      setTimeout(() => {
        displayMsg.textContent = '';
      }, 1000);
    }, 1000);
  }

  const modalHandler = event => {
    if (
      [
        // event bubling
        backdrop,
        modalCloseBtn,
      ].includes(event.target) &&
      !gameProps.showModal
    ) {
      // modal remove animation
      modal.classList.remove('modal__animation--in');
      backdrop.classList.remove('backdrop__animation--in');
      modal.classList.add('modal__animation--out');
      backdrop.classList.add('backdrop__animation--out');
      gameProps.showModal = true;
      setTimeout(() => {
        backdrop.classList.add('hidden');
        // disp current game round
        displayMsg.textContent = `Round ${gameProps.round}`;
        // play the sound
        document.querySelector('.ready-to-fight').play();
        // clear message
        setTimeout(() => {
          displayMsg.textContent = '';
        }, 1000);
      }, 1000);
    }
  };

  // add short circuiting
  backdrop.addEventListener('click', modalHandler);

  const disp = new Coordinates(display);
  const lhBar = new Bar(leftBar, disp, ['w', 's'], [50, 60, 70]);
  const rhBar = new Bar(rightBar, disp, ['p', 'l'], [1242, 1232, 1222]);

  btnGame.textContent = 'Press Esc to Exit';

  const hitBall = new Ball(
    ball,
    {
      root: display,
      threshold: 1,
      rootMargin: `10px -50px 10px -50px`,
    },
    disp
  );

  const onRelease = function (e) {
    if (e.key === 'p') {
      rhBar.pressKey = '';
    }
    if (e.key === 'w') {
      lhBar.pressKey = '';
    }
    if (e.key === 'l') {
      rhBar.pressKey = '';
    }
    if (e.key === 's') {
      lhBar.pressKey = '';
    }
  };

  const onStrocke = function (e) {
    if (e.key === 'p') {
      rhBar.pressKey = gameProps.blockPaddle ? '' : e.key;
    }
    if (e.key === 'w') {
      lhBar.pressKey = gameProps.blockPaddle ? '' : e.key;
    }
    if (e.key === 'l') {
      rhBar.pressKey = gameProps.blockPaddle ? '' : e.key;
    }
    if (e.key === 's') {
      lhBar.pressKey = gameProps.blockPaddle ? '' : e.key;
    }

    gameProps.disebleKeys.includes(e.key) ? e.preventDefault() : '';

    // during modal open simply return
    if (!gameProps.showModal) return;

    // end game
    if (e.key === 'Escape') {
      hitBall.caseState = 'init';
      lhBar.init(0); // reinit paddle position
      rhBar.init(0); // reinit paddle position
      gameProps.reInitGame();
      setTimeout(() => {
        document.body.style = ''; // reinit scroll bar
        [scoreLH, scoreRH].forEach(score => {
          score.textContent = '0';
        });
        [scoreRoundLH, scoreRoundRH].forEach(score => {
          score.textContent = '0';
        });
        btnGame.textContent = 'Play';
        intervalMsg = insertCoinMsg('Insert Coin');
        btnGame.style.pointerEvents = 'auto';
      }, 1500);

      document.removeEventListener('keydown', onStrocke);
      document.removeEventListener('keyup', onRelease);
      document.removeEventListener('click', modalHandler);
    }
  };

  document.addEventListener('keydown', onStrocke);
  document.addEventListener('keyup', onRelease);
  window.requestAnimationFrame(game.bind(null, disp, lhBar, rhBar, hitBall));
});

// ############################################################
// init the event listeners
// ############################################################
