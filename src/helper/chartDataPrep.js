import { celsiusToFahrenheit } from './tempConverter';

export const desktopDataPrep = function (plotData, clickedDay) {
  const timeStamp = [];
  const temperatureStamp = [];
  const descriptionStamp = [];
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
        // console.log(iter, ' day: ', day);
        iter++;
      }
      for (let i = 0; i < 8; i++) {
        timeStamp.push(tempArr[i].time);
        temperatureStamp.push(tempArr[i].temp);
        descriptionStamp.push(tempArr[i].description);
      }
    }
    // backward traverse - concatenate previous with current arry
    if (startIndex === length - 1) {
      let iter = 0;
      while (tempArr.length < 8) {
        const day = plotData.days[startIndex - iter];
        tempArr = plotData[day].concat(tempArr);
        // console.log(iter, 'day: ', day);
        iter++;
      }
      for (let i = tempArr.length - 8; i < tempArr.length; i++) {
        timeStamp.push(tempArr[i].time);
        temperatureStamp.push(tempArr[i].temp);
        descriptionStamp.push(tempArr[i].description);
      }
    }
  }

  return [timeStamp, temperatureStamp, descriptionStamp];
};

// extention for mobile - data prep for floating bar charts - with both
// Celsius and Fahrenheit outputs
export const mobileDataPrep = function (plotData, clickedDay, toFahrenheit) {
  const [timeStamp, temperatureStamp, descriptionStamp] = desktopDataPrep(
    plotData,
    clickedDay
  );

  const min = toFahrenheit
    ? celsiusToFahrenheit(Math.min(...temperatureStamp) - 5)
    : Math.min(...temperatureStamp) - 5;
  const max = toFahrenheit
    ? celsiusToFahrenheit(Math.max(...temperatureStamp) + 15)
    : Math.max(...temperatureStamp) + 15;
  // data formating
  const temperatureStampFloatBar = temperatureStamp.map(item => {
    return toFahrenheit ? [celsiusToFahrenheit(item), min] : [item, min];
  });

  return [timeStamp, temperatureStampFloatBar, min, max, descriptionStamp];
};
