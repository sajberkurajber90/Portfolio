// updating pong position on the screen

import ScreenCoordinates from '../../helper/screenCoordinates';
const RADTODEG = Math.PI / 180;
const randomIntfromInterval = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

class ViewPong extends ScreenCoordinates {
  observer; // observer obj
  constructor(element, prop, disp) {
    super(element);
    this._prop = prop; // property object for intersection
    this.state = '';
    this._addObserver(this.element);
    this.caseState = 'init';
    this._positionX = [];
    this._positionY = [];
    this.disp = new ScreenCoordinates(disp);
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

export default ViewPong;
