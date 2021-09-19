// style generator
const cardWidthAdjustment = function () {
  const thrasHold = 130;
  let keepPosition = 0; // block translation when enough ofset
  // xOffset is negative value
  return {
    styleMobile(xOffset, initWidth, isCardInPos) {
      if (initWidth + xOffset > thrasHold && initWidth > thrasHold) {
        keepPosition = xOffset; // store the current latest
        return {
          transform: `translateX(${xOffset}px)`,
          width: `${350 - xOffset}px`,
          transition: isCardInPos ? 'none' : 'all 0.2s',
        };
      } else {
        if (initWidth > thrasHold) {
          return {
            transform: `translateX(${keepPosition}px)`,
            width: `${350 - keepPosition}px`,
            transition: isCardInPos ? 'none' : 'all 0.2s',
          };
        }
        return {};
      }
    },
  };
};

export default cardWidthAdjustment();
