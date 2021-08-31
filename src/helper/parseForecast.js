import { getLocalDayAndTime } from './localTimeConversion';

const parseForecast = function (data, obj) {
  const transform = data.list.map(item => {
    return {
      time: getLocalDayAndTime(item.dt, data.city.timezone),
      temp: item.main.temp,
    };
  });

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
      return { time: element.time.localTime, temp: element.temp };
    });
  });
};

export default parseForecast;
