class ViewNavigation {
  constructor() {
    this._navList = document.querySelector('.nav__list');
    this._cookies = document.getElementById('modal-cookies');
    this._toToggle = document.querySelector('.icon-1');
    this._gameSection = document.getElementById('#game');
    this._weatherSection = document.getElementById('root');
    this._grid = document.querySelector('.grid');
    this._aboutSection = document.querySelector('.section-about');
    this._cards = this._grid.querySelectorAll('.grid__card--color');
    // remove loading spiner on img's load
    this._dispImg(this._cards);
    // init handlers - for navigation / modal purposes
    this._addHandlerOnPageLoad();
    this._addHandlerCloseModal();
    this._addHandlerNavBar();
    this._addHandlerGrid();
    this._addHandlerMobileNav();
  }

  // navigation bar event delegation
  _addHandlerNavBar() {
    const handler = function (e) {
      if (e.target.textContent.toLowerCase() === 'lonely pong 19') {
        this._gameSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (e.target.textContent.toLowerCase() === 'weatherapp') {
        this._weatherSection.scrollIntoView({ behavior: 'smooth' });
      }
      if (e.target.textContent.toLowerCase() === 'about') {
        this._aboutSection.scrollIntoView({ behavior: 'smooth' });
      }

      // colaspse back in mobile on click
      if (this._navList.classList.contains('collapsible__extanded')) {
        this._navList.classList.replace(
          'collapsible__extanded',
          'collapsible__content'
        );
      }
    };

    this._navList.addEventListener('click', handler.bind(this));
  }

  // trigger Modal on page load
  _addHandlerOnPageLoad() {
    document.addEventListener('DOMContentLoaded', () => {
      this._cookies.classList.replace('hidden', 'backdrop__animation--in');
      this._cookies.children[0].classList.add('cookies--animation--in');
    });
  }

  // close Cokies modal
  _addHandlerCloseModal() {
    const button = this._cookies.querySelector('button');
    const handler = function (e) {
      e.preventDefault();
      this._cookies.classList.replace(
        'backdrop__animation--in',
        'backdrop__animation--out'
      );
      this._cookies.children[0].classList.replace(
        'cookies--animation--in',
        'cookies--animation--out'
      );

      // hide a backdrop after animation
      const cookies = this._cookies;
      setTimeout(() => {
        cookies.classList.add('hidden');
      }, 1000);
    };

    button.addEventListener('click', handler.bind(this), { once: true });
  }

  // Mobile: toggle dropdown menu
  _addHandlerMobileNav() {
    const handler = function () {
      if (this._navList.classList.contains('collapsible__extanded')) {
        this._navList.classList.replace(
          'collapsible__extanded',
          'collapsible__content'
        );

        return;
      }
      if (this._navList.classList.contains('collapsible__content')) {
        this._navList.classList.replace(
          'collapsible__content',
          'collapsible__extanded'
        );

        return;
      }
    };

    this._toToggle.addEventListener('click', handler.bind(this));
  }

  // Grid click events scroll to
  _addHandlerGrid() {
    const handler = function (e) {
      const clickGame = e.target.closest('.grid__game-card');
      const gridHeader = e.target.closest('.grid__subject-card');

      if (clickGame) {
        this._gameSection.scrollIntoView({ behavior: 'smooth' });
      }

      if (!clickGame && !gridHeader) {
        this._weatherSection.scrollIntoView({ behavior: 'smooth' });
      }
    };

    this._grid.addEventListener('click', handler.bind(this));
  }
  // on img load promise
  _onImgLoad(element) {
    return new Promise((resolve, _) => {
      if (element.complete) {
        // already loaded before script
        resolve();
      } else {
        // still loading - wait on it
        element.onload = () => {
          resolve();
        };
      }
    });
  }
  // remove spinner
  async _dispImg(elements) {
    const elementsArr = Array.from(elements);
    const promises = elementsArr.map(element => {
      const img = element.querySelector('img');
      return this._onImgLoad(img);
    });
    await Promise.all(promises);
    // after resolvig
    elementsArr.forEach(element => {
      element
        .querySelector('.grid__load')
        .classList.remove('loading-animation');
      element.classList.remove('grid__card--flex');
      element.style = 'pointer-events: auto;';
      element.querySelector('.grid__content').style = 'opacity:1;';
      element.querySelector('img').style = 'opacity:1';
    });
  }
}

export default new ViewNavigation();
