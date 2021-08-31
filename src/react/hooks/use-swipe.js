import { useState, useRef, useReducer } from 'react';
import { useDispatch } from 'react-redux';

// left border
const diffXMax = -80;

// init value
const initValue = { cardRelativeXPos: 0, isCardInPos: true, isTapped: false };

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
      };
    case 'GO_RIGHT':
      return {
        cardRelativeXPos:
          state.cardRelativeXPos < 0
            ? state.cardRelativeXPos + 5
            : state.cardRelativeXPos,
        isCardInPos: true,
        isTapped: false,
      };
    case 'NOT_IN_POS_ON_RELEAS':
      return { cardRelativeXPos: 0, isCardInPos: false, isTapped: false };

    case 'TAPPED':
      return {
        cardRelativeXPos:
          action.position === 0 ? action.position : state.cardRelativeXPos,
        isCardInPos: action.isCardInPos ? true : action.isCardInPos,
        isTapped: action.tapped,
      };

    case 'STOP_ANIMATION':
      return {
        cardRelativeXPos: state.cardRelativeXPos,
        isCardInPos: true,
        isTapped: false,
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
  const { cardRelativeXPos } = swipeState;

  // set Card pos to 0 if it didn't reach border
  const setIsCardInPos = function () {
    localDispatch({ type: 'STOP_ANIMATION' });
  };

  // to set is Tapped
  const onTapHandler = function (event) {
    // add condition if remove is clicked and
    const isToBeRemoved = [
      'RemoveCardMobile',
      'RemoveCardMobile__Icon',
    ].includes(event.target.classList[0]);

    // check to se if it's swiped to the left
    if (cardRelativeXPos === diffXMax && !isToBeRemoved) {
      console.log('LOCAL DISPATCH');
      localDispatch({
        type: 'TAPPED',
        tapped: !swipeState.isTapped,
        position: 0,
        isCardInPos: false,
      });
      console.log(cardRelativeXPos);
      // card is in normal position
    }
    if (cardRelativeXPos !== diffXMax && !isToBeRemoved) {
      console.log('POS 0');
      localDispatch({
        type: 'TAPPED',
        tapped: !swipeState.isTapped,
      });
    }
  };

  // ref's
  const xRef = useRef(0);
  //
  const onTouchStart = function (event) {
    // init xRef

    xRef.current = event.touches[0].clientX;
  };
  //
  const onTouchMove = function (event) {
    const currentXPos = event.touches[0].clientX;
    // move left - update state
    if (xRef.current - 5 > currentXPos && cardRelativeXPos > diffXMax) {
      xRef.current = currentXPos;

      localDispatch({ type: 'GO_LEFT' });
    }
    // move right - update state
    if (xRef.current + 5 < currentXPos && cardRelativeXPos < 0) {
      xRef.current = currentXPos;
      localDispatch({ type: 'GO_RIGHT' });
    }
  };
  //
  const onTouchEnd = function (event) {
    // activate animation in case of not reaching the borders
    // and return to 0
    if (cardRelativeXPos < 0 && cardRelativeXPos > diffXMax) {
      localDispatch({ type: 'NOT_IN_POS_ON_RELEAS' });
    }

    xRef.current = 0;
  };

  return {
    cardRelativeXPos,
    isCardInPos: swipeState.isCardInPos,
    isTapped: swipeState.isTapped,
    onTouchStart,
    onTouchEnd,
    onTouchMove,
    setIsCardInPos,
    onTapHandler,
  };
};

export default useSwipe;
