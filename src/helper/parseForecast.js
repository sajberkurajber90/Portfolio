import { getLocalDayAndTime } from './localTimeConversion';

const parseForecast = function (data, obj) {
  // 40 hours forecast - extracting data and transforming date format
  const transform = data.list.map(item => {
    return {
      time: getLocalDayAndTime(item.dt, data.city.timezone), // formated date
      temp: item.main.temp, // temperature
      description: item.weather[0].description, // weather descriptio
    };
  });
  // extract days
  obj.days = [
    ...new Set(
      transform.map(item => {
        return item.time.day;
      })
    ),
  ];

  obj.days.forEach(item => {
    const filterArr = transform.filter(element => {
      return element.time.day === item;
    });
    obj[item] = filterArr.map(element => {
      return {
        time: element.time.localTime,
        temp: element.temp,
        description: element.description,
      };
    });
  });
};

export default parseForecast;
