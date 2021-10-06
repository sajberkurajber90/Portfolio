import { useRef, useEffect, useState } from 'react';
import LoadingSpinner from './LoadingSpinner';
import { Line, defaults } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Fragment } from 'react';
import { desktopDataPrep } from '../../helper/chartDataPrep';
import { celsiusToFahrenheit } from '../../helper/tempConverter';
// setup obj for y - ticks min and max
const yTicks = {
  minC: 0,
  maxC: 0,
  minF: 0,
  maxF: 0,
  init() {
    this.minC = 100;
    this.maxC = -100;
    this.minF = 1000;
    this.maxF = -1000;
  },
  findMin(plotData) {
    for (const day of plotData.days) {
      plotData[day].forEach(item => {
        this.minC = Math.min(this.minC, item.temp);
      });
    }
    this.minF = celsiusToFahrenheit(this.minC);
  },
  findMax(plotData) {
    for (const day of plotData.days) {
      plotData[day].forEach(item => {
        this.maxC = Math.max(this.maxC, item.temp);
      });
    }
    this.maxF = celsiusToFahrenheit(this.maxC);
  },
};

const animationDuration = 500;

// obj for tracking if unit is changed to prevent stale closer in clean up fun
const unitTrack = { isUnitChange: false };

const LineChart = function (props) {
  //animation guard on changing devices - make animation active
  defaults.animation.duration === false
    ? (defaults.animation.duration = 0)
    : null;

  // props
  const isLoading = props.isLoading;
  const forecast = props.forecast;
  const onClickLocation = props.onClickLocation;
  const convertTempUnit = props.convertTempUnit;
  const clickedDay = props.clickedDay;
  const isCardChanged = props.isCardChanged;
  const disableClickHandler = props.disableClickHandler;
  // state
  const [indexColor, setIndexColor] = useState(-1);

  // ref - access chart's methods
  const lineChartRef = useRef(null);
  // ref - previous day - for animation purposes
  const prevDay = useRef(clickedDay);
  // ref - y coord min and max for whole forecast
  const yMinMax = useRef(null);
  // ref - clickCount
  const renderCount = useRef(0);
  // ref - unitChange
  const unitChangePrev = useRef(convertTempUnit);

  const [plotData] = forecast.length
    ? forecast.filter(item => {
        return item.name === onClickLocation;
      })
    : [false];

  // y coordinates min and max on init and card chage
  if (plotData && (!yMinMax.current || isCardChanged)) {
    yTicks.init(); // overwrite the values from previosly clicked card
    yTicks.findMin(plotData);
    yTicks.findMax(plotData);
    yMinMax.current = {
      minC: yTicks.minC,
      maxC: yTicks.maxC,
      minF: yTicks.minF,
      maxF: yTicks.maxF,
    };
  }

  // LOGIC FOR USEEFFECT and TRANSITION MANIPULATION
  // in case of card change - manually reset render counter and prevDay
  isCardChanged && clickedDay ? (prevDay.current = clickedDay) : null;
  isCardChanged && clickedDay ? (renderCount.current = 0) : null;
  // init animation - on init,card change and unit change
  unitTrack.isUnitChange = unitChangePrev.current !== convertTempUnit;
  // update unitChange on change
  unitTrack.isUnitChange ? (unitChangePrev.current = convertTempUnit) : null;
  if (renderCount.current === 0 || unitTrack.isUnitChange) {
    const { duration } = defaults.animation;
    duration === animationDuration
      ? null
      : (defaults.animation.duration = animationDuration);
  }
  // prepare data for ploting - always previous day for animation purposes
  // only on init the init clicked day
  const prepData = plotData
    ? desktopDataPrep(
        plotData,
        prevDay.current !== clickedDay ? prevDay.current : clickedDay
      )
    : false;

  const [timeStamp, temperatureStamp, descriptionStamp] = prepData
    ? prepData
    : [false, false, false];

  const chartData = prepData
    ? {
        labels: [...timeStamp],
        datasets: [
          {
            label: 'Line',
            data: convertTempUnit
              ? temperatureStamp.map(item => {
                  return celsiusToFahrenheit(item);
                })
              : [...temperatureStamp],
            borderColor: '#f4afc2',
            fill: 'start',
            backgroundColor: '#5d536c',
            pointRadius: 5,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#f6bfce',
            pointBackgroundColor: '#f4afc2',
            pointBorderColor: '#f4afc2',
            pointHoverBorderColor: '#f6bfce',
            datalabels: {
              align: 'end',
              anchor: 'end',
              offset: 10,
            },
          },
        ],
      }
    : false;

  // temperature scaler
  const minScaler = convertTempUnit ? celsiusToFahrenheit(5) : 5;
  const maxScaler = convertTempUnit ? celsiusToFahrenheit(10) : 10;
  // chart options
  const chartOptions = {
    responsive: true,
    events: ['mousemove', 'mouseout'],
    onHover: (_, pointIndex) => {
      if (pointIndex.length) {
        pointIndex[0].index === indexColor
          ? null
          : setIndexColor(pointIndex[0].index);
      } else {
        indexColor === -1 ? null : setIndexColor(-1);
      }
    },
    plugins: {
      tooltip: {
        backgroundColor: '#5d536c',
        titleColor: '#f4afc2',
        titleMarginBottom: 0,
        yAlign: 'bottom',
        caretPadding: 35,
        callbacks: {
          label: () => {
            return '';
          },
          title: () => {
            return indexColor === -1 ? '' : descriptionStamp[indexColor];
          },
        },
      },
      legend: { display: false },
      datalabels: {
        color: '#f4afc2',
        formatter: Math.round,
      },
    },
    scales: {
      x: {
        beginAtZero: false,
        grid: { display: false },
        ticks: {
          color: '#f4afc2',
        },
      },
      y: {
        min: temperatureStamp
          ? (convertTempUnit ? yMinMax.current.minF : yMinMax.current.minC) -
            minScaler
          : 0,
        max: temperatureStamp
          ? (convertTempUnit ? yMinMax.current.maxF : yMinMax.current.maxC) +
            maxScaler
          : 0,
        grid: { display: false },
        display: false,
      },
    },
  };

  const cleanUp = {};
  // transition effect
  useEffect(() => {
    // mark previous day
    if (clickedDay !== null) {
      prevDay.current =
        prevDay.current !== clickedDay ? clickedDay : prevDay.current;
      // stop animation after first render
      if (
        !lineChartRef.current ||
        !renderCount.current ||
        unitTrack.isUnitChange
      ) {
        cleanUp['init-animation'] = setTimeout(() => {
          defaults.animation.duration = 0;
          renderCount.current++;
          unitTrack.isUnitChange = false;
        }, animationDuration);
      }
      // transition by changing days
      if (
        lineChartRef.current &&
        !unitTrack.isUnitChange &&
        renderCount.current
      ) {
        defaults.animation.duration = 200;

        const [timeStamp, temperatureStamp] = desktopDataPrep(
          plotData,
          clickedDay
        );
        cleanUp['transition'] = setTimeout(() => {
          // update line chart
          lineChartRef.current.data.datasets[0].data = convertTempUnit
            ? temperatureStamp.map(item => {
                return celsiusToFahrenheit(item);
              })
            : [...temperatureStamp];
          lineChartRef.current.data.labels = [...timeStamp];
          lineChartRef.current.update();
          cleanUp['stop-animation'] = setTimeout(() => {
            defaults.animation.duration = 0;
            renderCount.current++;
          }, 5);
        }, 200);
        renderCount.current++;
      }
    }
  }, [clickedDay, convertTempUnit, isCardChanged, onClickLocation, isLoading]);

  useEffect(() => {
    return () => {
      if (Object.keys(cleanUp).length) {
        for (const key in cleanUp) {
          clearTimeout(cleanUp[key]);
        }
      }
    };
  }, []);

  // Chart layout
  let layout =
    isLoading && !plotData ? (
      <LoadingSpinner marginTop={0} className="LoadingSpinner-desktop" />
    ) : (
      <Fragment>
        <Line
          ref={lineChartRef}
          data={chartData}
          plugins={[ChartDataLabels]}
          options={chartOptions}
        />
      </Fragment>
    );

  return layout;
};

export default LineChart;
