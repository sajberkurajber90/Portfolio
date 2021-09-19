import { useRef, useReducer, useState, useEffect } from 'react';

// left border
const diffXMax = -80;

// init value
const initValue = {
  cardRelativeXPos: 0,
  isCardInPos: true,
  isTapped: false,
  tappedCity: null,
};

// clear tmeout obj on unmount
const clearTimeOut = {};

// reducer fun
const swipeReducer = function (state, action) {
  switch (action.type) {
    case 'GO_LEFT':
      return {
        cardRelativeXPos:
          state.cardRelativeXPos > diffXMax
            ? state.cardRelativeXPos - 5
            : state.cardRelativeXPos,
        isCardInPos: true,
        isTapped: false,
        tappedCity: state.tappedCity,
      };
    case 'GO_RIGHT':
      return {
        cardRelativeXPos:
          state.cardRelativeXPos < 0
            ? state.cardRelativeXPos + 5
            : state.cardRelativeXPos,
        isCardInPos: true,
        isTapped: false,
        tappedCity: state.tappedCity,
      };
    case 'NOT_IN_POS_ON_RELEAS':
      return {
        cardRelativeXPos: 0,
        isCardInPos: false,
        isTapped: state.isTapped,
        tappedCity: state.tappedCity,
      };

    case 'TAPPED':
      return {
        cardRelativeXPos:
          action.position === 0 ? action.position : state.cardRelativeXPos,
        isCardInPos: action.isCardInPos ? true : action.isCardInPos,
        isTapped: action.tapped,
        tappedCity: action.city,
      };

    case 'STOP_ANIMATION':
      return {
        cardRelativeXPos: state.cardRelativeXPos,
        isCardInPos: true,
        isTapped: state.isTapped,
        tappedCity: state.tappedCity,
      };

    case 'ON_ERROR_UNTAP':
      return {
        cardRelativeXPos: state.cardRelativeXPos,
        isCardInPos: true,
        isTapped: false,
        tappedCity: null,
      };
    default:
      return state;
  }
};

// swipe handler custom hook
// swipe only left and right

const useSwipe = function () {
  // reducer
  const [swipeState, localDispatch] = useReducer(swipeReducer, initValue);
  // state
  const [runAnimCloseChart, setRunAnimCloseChart] = useState(false);
  const { cardRelativeXPos } = swipeState;
  const { isTapped } = swipeState;
  // on unmount guard
  const isMountedRef = useRef(true);

  // set Card pos to 0 if it didn't reach border
  const setIsCardInPos = function () {
    localDispatch({ type: 'STOP_ANIMATION' });
  };

  // untap on Error
  const onErrorUntapHandler = function () {
    if (!runAnimCloseChart) {
      isMountedRef.current ? setRunAnimCloseChart(true) : '';
    }
    clearTimeOut['chart-untap'] = setTimeout(() => {
      localDispatch({ type: 'ON_ERROR_UNTAP' });
    }, 500);
    // localDispatch({ type: 'ON_ERROR_UNTAP' });
  };

  // to set is Tapped
  const onTapHandler = function (event) {
    // add condition if remove is clicked and
    const isToBeRemoved = [
      'RemoveCardMobile',
      'RemoveCardMobile__Icon',
      'path',
    ].includes(event.target.classList[0]);
    // check to se if it's swiped to the left
    if (cardRelativeXPos === diffXMax && !isToBeRemoved) {
      // display chart with delay - when swiped to left
      // return swipe
      localDispatch({ type: 'NOT_IN_POS_ON_RELEAS' });

      const dispatchDelay = function (cityId) {
        localDispatch({
          type: 'TAPPED',
          tapped: !swipeState.isTapped,
          position: 0,
          isCardInPos: false,
          city: !swipeState.isTapped ? cityId : null,
        });
      };
      // set it tapped after some delay
      clearTimeOut['chart-open'] = setTimeout(
        dispatchDelay.bind(null, event.currentTarget.id),
        300
      );

      // card is in normal position
    }
    if (cardRelativeXPos !== diffXMax && !isToBeRemoved) {
      // if chart displayed - defer untap for animation
      if (isTapped) {
        isMountedRef.current ? setRunAnimCloseChart(true) : '';
        const dispatchDelay = function (cityId) {
          localDispatch({
            type: 'TAPPED',
            tapped: !swipeState.isTapped,
            isCardInPos: true,
            city: !swipeState.isTapped ? cityId : null,
          });
        };
        clearTimeOut['chart-close'] = setTimeout(
          dispatchDelay.bind(null, event.currentTarget.id),
          600
        );
      } else {
        localDispatch({
          type: 'TAPPED',
          tapped: !swipeState.isTapped,
          isCardInPos: true,
          city: !swipeState.isTapped ? event.currentTarget.id : null,
        });
      }
    }
  };

  // ref's
  const xRef = useRef(0);
  // swipe start
  const onTouchStart = function (event) {
    // init xRef

    xRef.current = event.touches[0].clientX;
  };
  // swipe movement - disable if isTapped
  const onTouchMove = function (event) {
    const currentXPos = event.touches[0].clientX;
    // move left - update state
    if (
      xRef.current - 5 > currentXPos &&
      cardRelativeXPos > diffXMax &&
      !isTapped
    ) {
      xRef.current = currentXPos;

      localDispatch({ type: 'GO_LEFT' });
    }
    // move right - update state
    if (xRef.current + 5 < currentXPos && cardRelativeXPos < 0 && !isTapped) {
      xRef.current = currentXPos;
      localDispatch({ type: 'GO_RIGHT' });
    }
  };
  // swipe end - disable if tapped
  const onTouchEnd = function () {
    // activate animation in case of not reaching the borders
    // and return to 0
    if (cardRelativeXPos < 0 && cardRelativeXPos > diffXMax && !isTapped) {
      localDispatch({ type: 'NOT_IN_POS_ON_RELEAS' });
    }

    xRef.current = 0;
  };

  // reset animation flag
  useEffect(() => {
    if (!isTapped && runAnimCloseChart) {
      isMountedRef.current ? setRunAnimCloseChart(false) : '';
    }
  }, [isTapped, runAnimCloseChart]);

  // on unmount clear timouts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      for (const timeout in clearTimeOut) {
        clearTimeout(timeout);
      }
    };
  }, []);

  return {
    cardRelativeXPos,
    isCardInPos: swipeState.isCardInPos,
    isTapped,
    tappedCity: swipeState.tappedCity,
    runAnimCloseChart,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    setIsCardInPos,
    onTapHandler,
    onErrorUntapHandler,
    setRunAnimCloseChart,
  };
};

export default useSwipe;
