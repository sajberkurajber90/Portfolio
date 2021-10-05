// updating paddle position on the screen

import ScreenCoordinates from '../../helper/screenCoordinates';

class ViewPaddle extends ScreenCoordinates {
  constructor(element, disp, keys, depth) {
    super(element);
    this.disp = new ScreenCoordinates(disp);
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

  init(round, reset = false) {
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
    // on game reset - reset maxY prop
    if (reset) {
      this._maxY =
        this.disp.posBottom() -
        this.disp.posY() -
        (this.posBottom() - this.posY());
    }
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

export default ViewPaddle;
