"use strict";
// selected elements
const toToggle = document.querySelector(".icon-1");
const navList = document.querySelector(".nav__list");
const cardGame = document.querySelector(".card-game");
const gameSec = document.getElementById("#game");
const btnGame = document.querySelector(".btn-game");
const RADTODEG = Math.PI / 180;
const scoreLH = document.querySelector(".game--score-l");
const scoreRH = document.querySelector(".game--score-r");
const scoreRoundLH = document.querySelector(".game--round-l");
const scoreRoundRH = document.querySelector(".game--round-r");
const modal = document.querySelector(".modal");
const backdrop = document.querySelector(".backdrop");
const modalCloseBtn = document.querySelector(".modal__button");
const modalCloseIcon = document.querySelector(".modal__svg");

// game elements
const display = document.querySelector(".section-game__display");
const leftBar = document.querySelector(".section-game__bracket--left");
const rightBar = document.querySelector(".section-game__bracket--right");
const ball = document.querySelector(".section-game__ball");
const displayMsg = document.querySelector(".game__message");
const randomIntfromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// game stats
const gameProps = {
  leftPoint: 0,
  rightPoint: 0,
  leftRound: 1,
  rightRound: 1,
  round: 1,
  msgLeft: "LEFT WINS",
  msgRight: "RIGHT WINS",
  endGame: true,
  disebleKeys: ["ArrowUp", "ArrowDown", " "],
  modalShow: false,
  init: function () {
    this.rightPoint = 0;
    this.leftPoint = 0;
  },
  reInitGame: function () {
    this.rightPoint = 0;
    this.leftPoint = 0;
    this.round = 1;
    this.leftRound = 1;
    this.rightRound = 1;
    this.endGame = true;
  },
};

// dropdown event handler
toToggle.addEventListener("click", function () {
  if (navList.classList.contains("collapsible__extanded")) {
    navList.classList.remove("collapsible__extanded");
    navList.classList.add("collapsible__content");
    navList.style = `transition:0.5s`;
    return;
  }

  if (navList.classList.contains("collapsible__content")) {
    navList.classList.remove("collapsible__content");
    navList.classList.add("collapsible__extanded");
    navList.style = `transition:0.5s`;
    return;
  }
});

//  intersection observer

// display Msg - insert coin
const insertCoinMsg = function (str) {
  const newStr = [...str];
  newStr.splice(newStr.indexOf(" "), 1); // inplace
  displayMsg.textContent = "";
  let i = 0;

  return setInterval(() => {
    if (i < newStr.length) {
      newStr[i] === "t"
        ? (displayMsg.textContent = displayMsg.textContent + newStr[i] + " ")
        : (displayMsg.textContent = displayMsg.textContent + newStr[i]);
      ++i;
    } else {
      i = 0;
      displayMsg.textContent = "";
    }
  }, 500);
};

let intervalMsg = insertCoinMsg("Insert Coin");

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

class Bar extends Coordinates {
  constructor(element, disp, keys) {
    super(element);
    this.disp = disp;
    this._position = [this.posY() - this.disp.posY()];
    this._initPos = this.posY() - this.disp.posY();
    this._keys = keys;
    this._keyUP = true;
    this._keyDown = true;
    this.pressKey = "";
    this._maxY =
      this.disp.posBottom() -
      this.disp.posY() -
      (this.posBottom() - this.posY());
  }

  init() {
    this._position = [this._initPos];
    this.element.style = `top:${this._position[0]}px`;
  }

  move() {
    // moveUp
    if (this.pressKey === this._keys[0] && this._keyUP) {
      this._position.push(
        this._position[0] - 10 > 0 ? this._position[0] - 10 : this._position[0]
      );
      this._position.shift();
      this.element.style = `top:${this._position[0]}px`;
      this._keyDown = true;
    }
    // moveDown
    if (this.pressKey === this._keys[1] && this._keyDown) {
      this._position.push(
        this._position[0] + 10 < this._maxY
          ? this._position[0] + 10
          : this._position[0]
      );
      this._position.shift();
      this.element.style = `top:${this._position[0]}px`;
      this._keyUP = true;
    }
  }
}

// Ball class
class Ball extends Coordinates {
  observer; // observer obj
  constructor(element, prop, disp) {
    super(element);
    this._prop = prop;
    this.state = "";
    this.element = element;
    this._addObserver(this.element);
    this.caseState = "init";
    this._positionX = [];
    this._positionY = [];
    this.disp = disp;
    this.randPos = "";
    this.nextState = "goRightUp";
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
    if (this.caseState === "init" || this.transparence) {
      this.element.style = `left:${x}px;
     bottom:${y}px; opacity:0;`;
    }
    if (this.caseState !== "init") {
      this.element.style = `left:${x}px;
      bottom:${y}px; opacity:${this.transparence ? 0 : 1};`;
      if (y > 50 && y < this.disp.posBottom() - this.disp.posY() - 50) {
        this.transparence = false;
      }
    }
  }

  move() {
    switch (this.caseState) {
      case "init":
        this._positionX[0] =
          (this.disp.posRight() - this.disp.posX()) / 2 -
          (this.posRight() - this.posX()) / 2;
        if (this.randPos === "top") {
          this._positionY[0] =
            -this.disp.posY() +
            this.disp.posBottom() -
            (-this.posY() + this.posBottom());
        } else if (this.randPos === "middle") {
          this._positionY[0] =
            (-this.disp.posY() + this.disp.posBottom()) / 2 -
            (-this.posY() + this.posBottom());
        } else {
          this._positionY[0] = 0;
        }

        this.transparence = true;
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
      case "goRightUp":
        this.dy = this.dx * this.randAngle;
        this._positionX.push(this._positionX[0] + this.dx);
        this._positionX.shift();
        this._positionY.push(this._positionY[0] + this.dy);
        this._positionY.shift();
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
      case "goRightDown":
        this.dy = this.dx * this.randAngle;
        this._positionX.push(this._positionX[0] + this.dx);
        this._positionX.shift();
        this._positionY.push(this._positionY[0] - this.dy);
        this._positionY.shift();
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
      case "goLeftUp":
        this.dy = this.dx * this.randAngle;
        this._positionX.push(this._positionX[0] - this.dx);
        this._positionX.shift();
        this._positionY.push(this._positionY[0] + this.dy);
        this._positionY.shift();
        this.setPosition(this._positionX[0], this._positionY[0]);
        break;
      case "goLeftDown":
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
  //check if modal is closed
  if (gameProps.modalShow) {
    lhBar.move();
    rhBar.move();
  }

  // Round Check
  if (gameProps.leftPoint >= 5) {
    console.log(gameProps.leftRound);
    hitBall.caseState = "init";
    hitBall.nextState = "goRightUp";
    gameProps.init();
    [scoreLH, scoreRH].forEach((score) => {
      score.textContent = "Score 0";
    });
    if (gameProps.leftRound >= 3) {
      displayMsg.textContent = `${gameProps.msgLeft}`;
      scoreRoundLH.textContent = `Round ${gameProps.leftRound}`;
      setTimeout(() => {
        displayMsg.textContent = "";
      }, 2000);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    } else {
      ++gameProps.round;
      ++gameProps.leftRound;
      scoreRoundLH.textContent = `Round ${gameProps.leftRound - 1}`;
      displayMsg.textContent = `Round ${gameProps.round}`;
      setTimeout(() => {
        displayMsg.textContent = "";
      }, 2000);
    }
  }

  if (gameProps.rightPoint >= 5) {
    hitBall.caseState = "init";
    hitBall.nextState = "goLeftUp";
    gameProps.init();
    [scoreLH, scoreRH].forEach((score) => {
      score.textContent = "Score 0";
    });
    if (gameProps.rightRound >= 3) {
      displayMsg.textContent = `${gameProps.msgRight}`;
      scoreRoundLH.textContent = `Round ${gameProps.rightRound}`;
      setTimeout(() => {
        displayMsg.textContent = "";
      }, 2000);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    } else {
      ++gameProps.rightRound;
      ++gameProps.round;
      scoreRoundLH.textContent = `Round ${gameProps.rightRound - 1}`;
      displayMsg.textContent = `Round ${gameProps.round}`;
      setTimeout(() => {
        displayMsg.textContent = "";
      }, 2000);
    }
  }
  // ball movement
  switch (hitBall.caseState) {
    case "init":
      hitBall.move();
      (["p", "l"].includes(rhBar.pressKey) ||
        ["w", "s"].includes(lhBar.pressKey)) &&
      gameProps.modalShow
        ? (hitBall.caseState = hitBall.nextState)
        : (hitBall.caseState = "init");
      break;
    case "goRightUp":
      hitBall.move();
      if (
        hitBall.posRight() + 10 > rhBar.posX() &&
        hitBall.posBottom() > rhBar.posY() - 10 &&
        hitBall.posY() < rhBar.posBottom() + 10
      ) {
        hitBall.caseState = "goLeftUp";
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      if (hitBall.posY() - 10 < disp.posY()) {
        hitBall.caseState = "goRightDown";
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }

      if (!hitBall.state) {
        // score update
        scoreLH.textContent = `Score: ${++gameProps.leftPoint}`;
        lhBar.init();
        rhBar.init();
        hitBall.caseState = "init";
        hitBall.randPos = hitBall.randPos === "top" ? "middle" : "top";
        hitBall.nextState = "goRightDown";
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      break;
    case "goRightDown":
      hitBall.move();
      if (
        hitBall.posRight() + 10 > rhBar.posX() &&
        hitBall.posBottom() > rhBar.posY() - 10 &&
        hitBall.posY() < rhBar.posBottom() + 10
      ) {
        hitBall.caseState = "goLeftDown";
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      if (hitBall.posBottom() + 10 > disp.posBottom()) {
        hitBall.caseState = "goRightUp";
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      if (!hitBall.state) {
        // score update
        scoreLH.textContent = `Score: ${++gameProps.leftPoint}`;
        lhBar.init();
        rhBar.init();
        hitBall.caseState = "init";
        hitBall.randPos = hitBall.randPos === "bottom" ? "middle" : "bottom";
        hitBall.nextState = "goRightUp";
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      break;
    case "goLeftDown":
      hitBall.move();
      if (
        hitBall.posX() - 10 < lhBar.posRight() &&
        hitBall.posBottom() > lhBar.posY() - 10 &&
        hitBall.posY() < lhBar.posBottom() + 10
      ) {
        hitBall.caseState = "goRightDown";
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }

      if (hitBall.posBottom() + 10 > disp.posBottom()) {
        hitBall.caseState = "goLeftUp";
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }

      if (!hitBall.state) {
        scoreRH.textContent = `Score: ${++gameProps.rightPoint}`;
        lhBar.init();
        rhBar.init();
        hitBall.caseState = "init";
        hitBall.randPos = hitBall.randPos === "bottom" ? "middle" : "bottom";
        hitBall.nextState = "goLeftUp";
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      break;
    case "goLeftUp":
      hitBall.move();
      if (
        hitBall.posX() - 10 < lhBar.posRight() &&
        hitBall.posBottom() > lhBar.posY() - 10 &&
        hitBall.posY() < lhBar.posBottom() + 10
      ) {
        hitBall.caseState = "goRightUp";
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      if (hitBall.posY() - 10 < disp.posY()) {
        hitBall.caseState = "goLeftDown";
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }

      if (!hitBall.state) {
        scoreRH.textContent = `Score: ${++gameProps.rightPoint}`;
        lhBar.init();
        rhBar.init();
        hitBall.caseState = "init";
        hitBall.randPos = hitBall.randPos === "top" ? "middle" : "top";
        hitBall.nextState = "goLeftDown";
        hitBall.transparence = true;
        hitBall.randAngle = Math.tan(randomIntfromInterval(10, 45) * RADTODEG);
      }
      break;
  }

  const animId = window.requestAnimationFrame(
    game.bind(null, disp, lhBar, rhBar, hitBall)
  );
  if (gameProps.endGame) {
    window.cancelAnimationFrame(animId);
  }
};

// game start
btnGame.addEventListener("click", (e) => {
  // center the page
  gameSec.scrollIntoView({ behavior: "smooth" });
  // disable btn
  btnGame.style.pointerEvents = "none";

  // stop inserCoinMSG
  clearInterval(intervalMsg);
  // clear message
  displayMsg.textContent = "";
  // enable game recursion
  gameProps.endGame = false;
  // kill overflow
  setTimeout(() => {
    document.body.style = "overflow:hidden;height:100%";
  }, 500);

  // insert modal and backdrop
  if (!gameProps.modalShow) {
    backdrop.classList.remove("hidden");
    backdrop.classList.add("backdrop__animation--in");
    modal.classList.add("modal__animation--in");
  }
  const modalHandler = (event) => {
    if (
      [
        backdrop,
        modalCloseBtn,
        modalCloseIcon,
        modalCloseIcon.children[0],
      ].includes(event.target) &&
      !gameProps.modalShow
    ) {
      modal.classList.remove("modal__animation--in");
      backdrop.classList.remove("backdrop__animation--in");
      modal.classList.add("modal__animation--out");
      backdrop.classList.add("backdrop__animation--out");
      gameProps.modalShow = true;
      setTimeout(() => {
        backdrop.classList.add("hidden");
        // disp current game round
        displayMsg.textContent = `Round ${gameProps.round}`;
        // play the sound
        document.querySelector(".ready-to-fight").play();
        // clear message
        setTimeout(() => {
          displayMsg.textContent = "";
        }, 1000);
      }, 1000);
    }
  };

  gameSec.addEventListener("click", modalHandler);

  const disp = new Coordinates(display);
  const lhBar = new Bar(leftBar, disp, ["w", "s"]);
  const rhBar = new Bar(rightBar, disp, ["p", "l"]);

  let vw = document.documentElement.clientWidth;

  btnGame.children[0].textContent = "Press Esc to Exit";

  const hitBall = new Ball(
    ball,
    {
      root: display,
      threshold: 1,
      rootMargin: `0px -${(2 * vw) / 100}px 0px -${(2 * vw) / 100}px`,
    },
    disp
  );

  const onRelease = function (e) {
    lhBar.pressKey = "";
    rhBar.pressKey = "";
  };

  const onStrocke = function (e) {
    console.log(e.key);
    lhBar.pressKey = e.key;
    rhBar.pressKey = e.key;

    gameProps.disebleKeys.includes(e.key) ? e.preventDefault() : "";

    if (!gameProps.modalShow) return;

    if (e.key === "Escape") {
      // stop game
      btnGame.style.pointerEvents = "auto";
      hitBall.caseState = "init";
      document.body.style = "";
      lhBar.init();
      rhBar.init();
      gameProps.reInitGame();
      [scoreLH, scoreRH].forEach((score) => {
        score.textContent = "Score 0";
      });
      [scoreRoundLH, scoreRoundRH].forEach((score) => {
        score.textContent = "Round 0";
      });
      window.requestAnimationFrame(
        game.bind(null, disp, lhBar, rhBar, hitBall)
      );
      btnGame.children[0].textContent = "Play";
      // setTimeout after endGame
      intervalMsg = insertCoinMsg("Insert Coin");
      document.removeEventListener("keydown", onStrocke);
      document.removeEventListener("keyup", onRelease);
      document.removeEventListener("click", modalHandler);
    }
  };

  document.addEventListener("keydown", onStrocke);
  document.addEventListener("keyup", onRelease);

  window.requestAnimationFrame(game.bind(null, disp, lhBar, rhBar, hitBall));
});

// displayMsg.textContent = "Insert Coin";

// nav
navList.addEventListener("click", function (e) {
  if (e.target.textContent.toLowerCase() === "lonely pong 19") {
    gameSec.scrollIntoView({ behavior: "smooth" });
  }
});

// cards
cardGame.addEventListener("click", function (e) {
  gameSec.scrollIntoView({ behavior: "smooth" });
});
