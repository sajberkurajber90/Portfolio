import LoadingSpinner from './LoadingSpinner';
import { Bar, defaults } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { mobileDataPrep } from '../../helper/chartDataPrep';
import { Fragment, useState, useEffect } from 'react';

const BarChart = function (props) {
  // props
  const isLoading = props.isLoading;
  const forecast = props.forecast;
  const tappedDay = props.tappedDay;
  const tappedCity = props.tappedCity;
  const convertTempUnit = props.convertTempUnit;
  const toolTipHandler = props.toolTipHandler;
  // state for updating barChart color on click
  const [indexColor, setIndexColor] = useState(-1);

  // turn off animation
  defaults.animation.duration = false;
  // prepare data for plotting
  const [plotData] = forecast.length
    ? forecast.filter(item => {
        return item.name === tappedCity;
      })
    : [false];

  const prepData = plotData
    ? mobileDataPrep(plotData, tappedDay, convertTempUnit)
    : false;
  const [timeStamp, temperatureStamp, min, max, descriptionStamp] = prepData
    ? prepData
    : [false, false, false, false, false];

  const chartData = prepData
    ? {
        labels: [...timeStamp],
        datasets: [
          {
            label: 'Bar',
            data: [...temperatureStamp],
            backgroundColor: timeStamp.map((_, index) => {
              if (index === indexColor) {
                return '#f9d7e0';
              }
              return '#f4afc2';
            }),
            fill: 'end',
            datalabels: {
              align: 'end',
              anchor: 'end',
              offset: 5,
            },
          },
        ],
      }
    : false;

  console.log(plotData);
  const chartOtions = {
    responsive: true,
    events: ['click'],
    plugins: {
      legend: { display: false },
      datalabels: {
        color: '#f4afc2',
        formatter: val => {
          return Math.floor(val[0]);
        },
      },
      // weather description in tooltip
      tooltip: {
        enabled: false,
      },
    },
    // click event
    onClick: (_, tappedBar) => {
      if (tappedBar.length) {
        // check if allready the bar is tapepd
        if (tappedBar[0].index === indexColor) {
          toolTipHandler(null);
          setIndexColor(-1);
        } else {
          setIndexColor(tappedBar[0].index);
          const description = descriptionStamp[tappedBar[0].index];
          toolTipHandler(description);
        }
      } else {
        toolTipHandler(null);
        setIndexColor(-1);
      }
    },
    scales: {
      x: {
        grid: { display: false },
        beginAtzero: false,
        ticks: {
          color: '#f4afc2',
        },
      },
      y: {
        min: temperatureStamp ? min : 0,
        max: temperatureStamp ? max : 0,
        beginAtzero: false,
        grid: { display: false },
        display: false,
        ticks: {
          callback: function (val) {
            return val;
          },
        },
      },
    },
  };

  // on day change unclick the bar
  useEffect(() => {
    if (indexColor !== -1) {
      setIndexColor(-1);
      toolTipHandler(null);
    }
  }, [tappedDay]);

  return (
    <Fragment>
      {isLoading && !plotData && (
        <LoadingSpinner className="LoadingSpinner-mobile" marginTop={0} />
      )}
      {!isLoading && plotData && (
        <Bar
          data={chartData}
          plugins={[ChartDataLabels]}
          options={chartOtions}
          width={330}
        />
      )}
    </Fragment>
  );
};

export default BarChart;
