import imgPath from '../../images/*.png';

interface DataObj {
  name: string;
  descriptionEn: string;
  descriptionDe: string;
  id: number;
  img: string;
}

class ViewAboutMe {
  private _languageTogglerItems: HTMLElement[];
  private _languageToggler: HTMLElement;
  private _cards: HTMLElement = document.querySelector(
    // cards container
    '.section-about__cards'
  )!;
  private _buttons: HTMLDivElement = document.querySelector(
    // buttons container
    '.section-about__pointers'
  )!;
  // arrows
  private _arrows: HTMLDivElement[] = Array.from(
    document.querySelectorAll('.section-about__box')
  )!;

  private _arrowBox = document.getElementById('box-right')! as HTMLDivElement;

  private _selectedBtn: number = 0; // active btn
  private _data: Array<DataObj> = []; // data from the state
  private _stopBtn = false; // avoid clicking spree
  private _clearIntervalID: number = setInterval(
    this._intervalHandler.bind(this),
    10000
  ); // inteval id

  constructor() {
    this._languageTogglerItems = Array.from(
      document.querySelectorAll('.section-about__language--item')
    );
    this._languageToggler = document.querySelector('.section-about__language')!;
    // add event listener to buttons
    this._addHandlerButtons();
    // add event listener to arrows
    this._addHandlerArrows();
  }

  render(data: Array<DataObj>) {
    // saving data
    this._data = data;
    // render initial cards and buttons based on number of profiles
    data.forEach(element => {
      const htmlCard: string = this._generateCardMarkup(element.id, element);
      const htmlBtn: string = this._generateButtonMarkup(element.id);
      this._cards.insertAdjacentHTML('beforeend', htmlCard); // generate cards
      this._arrowBox.insertAdjacentHTML('beforebegin', htmlBtn); // generate btn's
    });
    // add animation start and stop listener to avoid clicking spree
    const cards: Array<HTMLElement> = Array.from(
      this._cards.children
    ) as HTMLElement[];
    cards.forEach(card => {
      card.addEventListener(
        'animationstart',
        this._animStartHandler.bind(this)
      );
      card.addEventListener('animationend', this._animStopHandler.bind(this));
    });
  }

  update(
    clicked: number,
    useCase: string = 'update-screen',
    language: string = 'en'
  ) {
    // update screen on clicked btn
    switch (useCase) {
      case 'update-screen':
        // update the btn
        const elementBtn: HTMLDivElement = this._buttons.querySelector(
          '.section-about__pointer--selected'
        )!; // select current active btn - and toggle it
        elementBtn.classList.toggle('section-about__pointer--selected');
        const elementToSelectBtn: HTMLDivElement = this._buttons.querySelector(
          `[data-selected="${clicked}"]`
        )!;
        elementToSelectBtn.classList.toggle('section-about__pointer--selected');

        // update the card and content opacity
        const elementCard: HTMLDivElement = this._cards.querySelector(
          // select current active card - and close it
          '.section-about__card--animation-in'
        )!;
        const elementCardContent: HTMLDivElement = elementCard.querySelector(
          '.section-about__content--animation-in'
        )!;
        elementCard.classList.replace(
          'section-about__card--animation-in',
          'section-about__card--animation-out'
        );
        elementCardContent.classList.replace(
          'section-about__content--animation-in',
          'section-about__content--animation-out'
        );

        // slide to selected card
        const elementToSelectCard: HTMLDivElement = this._cards.querySelector(
          `[data-slide="${clicked}"]`
        )!;
        const elementToSelectCardContent: HTMLDivElement =
          elementToSelectCard.querySelector('.section-about__content')!;

        if (
          elementToSelectCard.classList.contains(
            'section-about__card--animation-out'
          )
        ) {
          elementToSelectCard.classList.replace(
            'section-about__card--animation-out',
            'section-about__card--animation-in'
          );
          elementToSelectCardContent.classList.replace(
            'section-about__content--animation-out',
            'section-about__content--animation-in'
          );
        } else {
          elementToSelectCard.classList.add(
            'section-about__card--animation-in'
          );
          elementToSelectCardContent.classList.add(
            'section-about__content--animation-in'
          );
        }
        break;
      case 'update-language':
        const content: Array<HTMLQuoteElement> = Array.from(
          this._cards.querySelectorAll('blockquote')
        );
        content.forEach(htmlElement => {
          const parent: HTMLDivElement = htmlElement.closest(
            '.section-about__card'
          )!;
          const id: number = +parent.dataset.slide!;
          // display content based on language
          htmlElement.textContent =
            language === 'en'
              ? this._data[id].descriptionEn
              : this._data[id].descriptionDe;
        });

        break;
    }
  }

  addHandlerLanguageToggle(handler: (str: string) => void) {
    this._languageToggler.addEventListener('click', event => {
      // check the element for class
      if (
        event.target instanceof HTMLElement &&
        Array.from(event.target.classList).includes(
          'section-about__language--item'
        )
      ) {
        // toggle the language and update the store
        this._languageTogglerItems.forEach(element => {
          !Array.from(element.classList).includes(
            'section-about__language--clicked'
          )
            ? handler(element.dataset.lang?.toLowerCase() as string)
            : null;
          element.classList.toggle('section-about__language--clicked');
        });
      }
    });
  }
  private _generateCardMarkup(index: number, profile: DataObj) {
    return `<div
    class="section-about__card section-about__card--color ${
      index === 0 ? 'section-about__card--animation-in' : ''
    }"
    data-slide="${index}">
    <div class="section-about__content ${
      index === 0 ? 'section-about__content--animation-in' : ''
    }">
        <div class=section-about__heading>
          <p>
            ${profile.name}
          </p>
          <img src="${
            imgPath[profile.img]
          }" class="section-about__content--image">
        </div>
        <div class="section-about__about">
          <div>
          &#8221
          </div>
        <blockquote>
            ${profile.descriptionEn}
        </blockquote>
        </div>
    </div>
    </div>`;
  }
  private _generateButtonMarkup(index: number) {
    return `<div class="section-about__pointer ${
      index === 0 ? ' section-about__pointer--selected' : ''
    }" data-selected=${index} ></div>`;
  }
  // btn handler
  private _addHandlerButtons() {
    const handler: (this: ViewAboutMe, event: Event) => void = function (
      event: Event
    ) {
      if (event.target instanceof HTMLElement) {
        // check target is htmlElement
        const element: HTMLElement = event.target;
        // classList includes the required class name
        const isInBtn = Array.from(element.classList).includes(
          'section-about__pointer'
        );
        if (
          isInBtn &&
          this._selectedBtn !== +element.dataset.selected! &&
          !this._stopBtn
        ) {
          // update layout
          const clicked = +element.dataset.selected!;
          this.update(clicked);
          // update selected pointer/btn
          this._selectedBtn = +element.dataset.selected!;
          // reset interval
          this._resetInterval();
        }
      }
    };
    this._buttons.addEventListener('click', handler.bind(this));
  }
  // arrow handler
  private _addHandlerArrows() {
    // handler
    const handler = function (this: ViewAboutMe, event: Event) {
      if (event.target instanceof HTMLDivElement) {
        // left
        if (
          (event.target.classList.contains('section-about__arrow--left') ||
            event.target.id === 'box-left') &&
          this._selectedBtn > 0 &&
          !this._stopBtn
        ) {
          this._selectedBtn--; // decres btn
          this.update(this._selectedBtn); // update both pointer and card
          // reset interval
          this._resetInterval();
        }
        // right
        if (
          (event.target.classList.contains('section-about__arrow--right') ||
            event.target.id === 'box-right') &&
          this._selectedBtn < this._data.length - 1 &&
          !this._stopBtn
        ) {
          this._selectedBtn++; // inreas btn
          this.update(this._selectedBtn); // update both pointer and card
          // reset interval
          this._resetInterval();
        }
      }
    };

    this._arrows.forEach(element => {
      element.addEventListener('click', handler.bind(this));
    });
  }
  // animation handler
  private _animStopHandler() {
    this._stopBtn = false;
  }

  private _animStartHandler() {
    this._stopBtn = true;
  }

  // add interval card changes
  private _intervalHandler(this: ViewAboutMe) {
    if (this._selectedBtn === this._data.length - 1) {
      this._selectedBtn = 0;
      this.update(this._selectedBtn);
    } else {
      this._selectedBtn++;
      this.update(this._selectedBtn);
    }
  }

  // reset interval handler
  private _resetInterval() {
    clearInterval(this._clearIntervalID);

    this._clearIntervalID = setInterval(
      this._intervalHandler.bind(this),
      10000
    );
  }
}

export default new ViewAboutMe();
