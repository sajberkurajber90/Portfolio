export const desktopDataPrep = function (plotData, clickedDay) {
  const timeStamp = [];
  const temperatureStamp = [];
  if (plotData && clickedDay) {
    let tempArr = [];
    const length = plotData.days.length;
    const startIndex = plotData.days.indexOf(clickedDay);
    // forward traverse - concatenate adjacent arrays
    if (startIndex < length - 1) {
      let iter = 0;
      while (tempArr.length < 8) {
        const day = plotData.days[startIndex + iter];
        tempArr = tempArr.concat(plotData[day]);
        console.log(iter, ' day: ', day);
        iter++;
      }
      for (let i = 0; i < 8; i++) {
        timeStamp.push(tempArr[i].time);
        temperatureStamp.push(tempArr[i].temp);
      }
    }
    // backward traverse - concatenate previous with current arry
    if (startIndex === length - 1) {
      let iter = 0;
      while (tempArr.length < 8) {
        const day = plotData.days[startIndex - iter];
        tempArr = plotData[day].concat(tempArr);
        console.log(iter, 'day: ', day);
        iter++;
      }
      for (let i = tempArr.length - 8; i < tempArr.length; i++) {
        timeStamp.push(tempArr[i].time);
        temperatureStamp.push(tempArr[i].temp);
      }
    }
  }

  return [timeStamp, temperatureStamp];
};

export const mobileDataPrep = function (plotData, clickedDay) {};
