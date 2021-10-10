import viewNavigation from './views/viewNavigation.js'; // init navigation
import viewAbout from './views/viewAboutMe.js'; // init about section
import viewGameScreen from './views/viewGameScreen.js'; // init game section
import * as model from './model.js'; // access state obj

// random number generator - for angle calculation - on colision with wall or paddle
const randomIntfromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};
const RADTODEG = Math.PI / 180;

const gameHandler = function (
  disp,
  lhBar,
  rhBar,
  hitBall,
  scoreLH,
  scoreRH,
  scoreRoundLH,
  scoreRoundRH,
  displayMsg
) {
  // Round Check - Left Bar
  if (model.state.leftPoint === 5) {
    model.init();
    hitBall.caseState = 'init';
    hitBall.nextState = 'goLeftUp';
    // reinit scores on disp with delay
    setTimeout(() => {
      scoreLH.textContent = `${model.state.leftPoint}`;
      scoreRH.textContent = `${model.state.rightPoint}`;
    }, 500);
    // increas a round for left
    ++model.state.leftRound;
    // reset round score on display with delay
    setTimeout(() => {
      scoreRoundLH.textContent = `${model.state.leftRound}`;
    }, 500);
    if (model.state.leftRound === 3) {
      displayMsg.textContent = model.state.msgLeft;
      setTimeout(() => {
        displayMsg.textContent = '';
      }, 1000);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    } else {
      // update the message round
      ++model.state.round;
      displayMsg.textContent = `Round ${model.state.round}`;
      setTimeout(() => (displayMsg.textContent = ''), 2000);
      // adjust maxY with a flag
      lhBar.maxYFlag = true;
      // resize the bar
      lhBar.init(model.state.leftRound);
    }
  }

  // Round Check - Right Bar
  if (model.state.rightPoint === 5) {
    model.init();
    hitBall.caseState = 'init';
    hitBall.nextState = 'goRightUp';
    // reinit scores on disp with delay
    setTimeout(() => {
      scoreLH.textContent = `${model.state.leftPoint}`;
      scoreRH.textContent = `${model.state.rightPoint}`;
    }, 500);
    // increas a round for right
    ++model.state.rightRound;
    // reset round score on display with delay
    setTimeout(() => {
      scoreRoundRH.textContent = `${model.state.rightRound}`;
    }, 500);
    // after 3 won rounds -> kill game
    if (model.state.rightRound === 3) {
      displayMsg.textContent = model.state.msgRight;
      setTimeout(() => {
        displayMsg.textContent = '';
      }, 1000);
      document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    } else {
      // update the message
      ++model.state.round;
      displayMsg.textContent = `Round ${model.state.round}`;
      setTimeout(() => (displayMsg.textContent = ''), 2000);
      // adjust maxY with a flag
      rhBar.maxYFlag = true;
      // resize a bar
      rhBar.init(model.state.rightRound);
    }
  }
  // paddle movement
  if (model.state.showModal && !model.state.blockPaddle) {
    lhBar.move(model.state.leftRound);
    rhBar.move(model.state.rightRound);
  }

  // ball movement
  switch (hitBall.caseState) {
    case 'init':
      hitBall.move();
      (['p', 'l'].includes(rhBar.pressKey) ||
        ['w', 's'].includes(lhBar.pressKey)) &&
      model.state.showModal &&
      !model.state.blockPaddle
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
        scoreLH.textContent = `${++model.state.leftPoint}`;
        lhBar.init(model.state.leftRound);
        rhBar.init(model.state.rightRound);
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
        scoreLH.textContent = `${++model.state.leftPoint}`;
        lhBar.init(model.state.leftRound);
        rhBar.init(model.state.rightRound);
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
        scoreRH.textContent = `${++model.state.rightPoint}`;
        lhBar.init(model.state.leftRound);
        rhBar.init(model.state.rightRound);
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
        scoreRH.textContent = `${++model.state.rightPoint}`;
        lhBar.init(model.state.leftRound);
        rhBar.init(model.state.rightRound);
        hitBall.caseState = 'init';
        hitBall.randPos = hitBall.randPos === 'top' ? 'middle' : 'top';
        hitBall.nextState = 'goLeftDown';
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(40 * RADTODEG);
      }
      break;
  }

  // block paddles for 0.4s
  if (!hitBall.state && !model.state.blockPaddle) {
    model.state.blockPaddle = true;
    setTimeout(() => {
      model.state.blockPaddle = false;
    }, 400);
  }

  const animId = window.requestAnimationFrame(
    gameHandler.bind(
      null,
      disp,
      lhBar,
      rhBar,
      hitBall,
      scoreLH,
      scoreRH,
      scoreRoundLH,
      scoreRoundRH,
      displayMsg
    )
  );

  // kill the game
  if (model.state.endGame) {
    window.cancelAnimationFrame(animId);
  }
};

const modalAddHandler = (backdrop, modal, displayMsg) => {
  if (!model.state.showModal) {
    // on first run
    backdrop.classList.remove('hidden');
    backdrop.classList.add('backdrop__animation--in');
    modal.classList.add('modal__animation--in');
    // enable game loop
    model.state.endGame = false;
  } else {
    // enable game loop
    model.state.endGame = false;
    // second, third .. run
    setTimeout(() => {
      // disp current game round
      displayMsg.textContent = `Round ${model.state.round}`;
      // play the sound
      document.querySelector('.ready-to-fight').play();
      // clear message
      setTimeout(() => {
        displayMsg.textContent = '';
      }, 1000);
    }, 1000);
  }
};

const modalRemoveHandler = (
  event,
  backdrop,
  modalCloseBtn,
  modal,
  displayMsg
) => {
  if (
    [
      // event bubling
      backdrop,
      modalCloseBtn,
    ].includes(event.target) &&
    !model.state.showModal
  ) {
    // modal remove animation
    modal.classList.remove('modal__animation--in');
    backdrop.classList.remove('backdrop__animation--in');
    modal.classList.add('modal__animation--out');
    backdrop.classList.add('backdrop__animation--out');
    model.state.showModal = true; // disable paddles movement during
    setTimeout(() => {
      backdrop.classList.add('hidden');
      // disp current game round
      displayMsg.textContent = `Round ${model.state.round}`;
      // play the sound
      document.querySelector('.ready-to-fight').play();
      // clear message
      setTimeout(() => {
        displayMsg.textContent = '';
      }, 1000);
    }, 1000);
  }
};

const onReleaseKeyHandler = function (lhBar, rhBar, e) {
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

const onStrockeKeyHandler = function (
  lhBar,
  rhBar,
  hitBall,
  scoreLH,
  scoreRH,
  btnGame,
  scoreRoundLH,
  scoreRoundRH,
  mainViewObj,
  insertCoinMsg,
  e
) {
  if (e.key === 'p') {
    rhBar.pressKey = model.state.blockPaddle ? '' : e.key;
  }
  if (e.key === 'w') {
    lhBar.pressKey = model.state.blockPaddle ? '' : e.key;
  }
  if (e.key === 'l') {
    rhBar.pressKey = model.state.blockPaddle ? '' : e.key;
  }
  if (e.key === 's') {
    lhBar.pressKey = model.state.blockPaddle ? '' : e.key;
  }
  // disable arrow up arrow down
  model.state.disebleKeys.includes(e.key) ? e.preventDefault() : '';

  // modal open simply return
  if (!model.state.showModal) return;

  // end game
  if (e.key === 'Escape') {
    hitBall.caseState = 'init'; // reinit pong position
    lhBar.init(0, true); // reinit paddle position
    rhBar.init(0, true); // reinit paddle position
    model.reInitGame();
    setTimeout(() => {
      document.body.style = ''; // reinit scroll bar
      [scoreLH, scoreRH].forEach(score => {
        score.textContent = '0';
      });
      [scoreRoundLH, scoreRoundRH].forEach(score => {
        score.textContent = '0';
      });
      btnGame.textContent = 'Play';
      mainViewObj.interval = insertCoinMsg();
      btnGame.style.pointerEvents = 'auto';
    }, 1500);

    // remove event listener on game end
    document.removeEventListener('keydown', mainViewObj.keyPressId);
    document.removeEventListener('keyup', mainViewObj.keyReleasId);
    window.removeEventListener('resize', mainViewObj.resizeId);
  }
};

// change language handler
const changeLanguageHandler = function (lang) {
  // update state
  model.changeLanguage(lang);
  // update markup
  viewAbout.update(0, 'update-language', model.state.language);
};

// #######################
// INIT handlers
// Game
viewGameScreen.addHandlerGameStartBtn(
  modalAddHandler,
  onStrockeKeyHandler,
  onReleaseKeyHandler,
  gameHandler
);
viewGameScreen.addHandlerModalClose(modalRemoveHandler);
// About
viewAbout.addHandlerLanguageToggle(changeLanguageHandler);
viewAbout.render(model.state.profiles); // init render
