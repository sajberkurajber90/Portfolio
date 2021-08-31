// timezone - seconds
const localTimeConversion = function (timezone) {
  const systemTime = new Date();
  // get utc and add time zone
  const localTime = new Date(
    systemTime.getTime() +
      timezone * 1000 +
      systemTime.getTimezoneOffset() * 60000
  );

  const hours =
    localTime.getHours() < 10
      ? '0' + localTime.getHours()
      : String(localTime.getHours());
  const minutes =
    localTime.getMinutes() < 10
      ? '0' + localTime.getMinutes()
      : String(localTime.getMinutes());

  return hours + ':' + minutes;
};

export const getLocalDayAndTime = function (forecastTime, timezone) {
  // system time for forecast time
  const dayArr = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const time = new Date(forecastTime * 1000);
  const localTime = new Date(
    time.getTime() + timezone * 1000 + time.getTimezoneOffset() * 60000
  );

  const hours =
    localTime.getHours() < 10
      ? '0' + localTime.getHours()
      : String(localTime.getHours());
  const minutes =
    localTime.getMinutes() < 10
      ? '0' + localTime.getMinutes()
      : String(localTime.getMinutes());

  return {
    day: dayArr[localTime.getDay()],
    localTime: hours + ':' + minutes,
  };
};
export default localTimeConversion;
