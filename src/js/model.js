export const state = {
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
  language: 'en',
  profiles: [
    {
      name: 'Erika <br> Mustermann',
      id: 0,
      img: 'Erika-Mustermann',
      descriptionEn:
        'The Chart, both on mobile and desktop gives me a great overview of a daily weather.',
      descriptionDe:
        'Das Diagram verschafft mir sowohl auf dem Handy als auch auf dem Pc einen guten Überblick über den täglichen Wetterablauf.',
    },
    {
      name: 'Max <br> Musterman',
      id: 1,
      img: 'Max-Mustermann',
      descriptionEn:
        'What I find nice about the game is a paddle size and position adjustment with each round.',
      descriptionDe:
        'Was ich gut an Spiel finde, ist Anpassung des Paddels in Hinsicht auf Grosse und Lage mit jeder Runde.',
    },
    {
      name: 'Tibor <br> Bezdan',
      id: 2,
      img: 'Tibor-Bezdan',
      descriptionEn:
        "Hi, I am Engeenier with intention to become a web developer. Portfolio page was writen in vanilla JS, TS and React - more details on Github. For any question don't hesitate to contact me over LinkedIn.",
      descriptionDe:
        'Hallo, ich bin Ineginieur mit der Absicht, der Werbentwickler zu werden. Die Porfolioseite wurde mit Hilfe von Vanilla JS,TS und React entworfen - mehr Details auf Github. Bei Fragen, melden Sie sich über LinkedIn. ',
    },
  ],
};

// init score for each round
export function init() {
  state.rightPoint = 0;
  state.leftPoint = 0;
}
// reinit a state for the game
export function reInitGame() {
  state.rightPoint = 0;
  state.leftPoint = 0;
  state.round = 1;
  state.leftRound = 0;
  state.rightRound = 0;
  state.endGame = true;
}

export function changeLanguage(lang) {
  state.language = lang;
}
