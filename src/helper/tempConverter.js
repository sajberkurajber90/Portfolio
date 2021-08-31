export const celsiusToFahrenheit = function (celsius) {
  return celsius * 1.8 + 32;
};

export const fahrenheitToCelsius = function (fahrenheit) {
  return (fahrenheit - 32) / 1.8;
};
