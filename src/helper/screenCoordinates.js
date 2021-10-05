class ScreenCoordinates {
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

export default ScreenCoordinates;
