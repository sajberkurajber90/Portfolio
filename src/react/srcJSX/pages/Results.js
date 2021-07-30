import React from 'react';
import './Results.css';
import Cards from '../reactComponents/Cards';
import Chart5Days from '../reactComponents/Chart5Days';
import Button from '../reactComponents/Button';
import { useParams } from 'react-router';

// TODO: add event handler to btn

const Results = function () {
  const today = new Date().toLocaleDateString('en-us', {
    day: 'numeric',
    month: 'long',
  });

  // if page reloaded on results
  const { citys: urlData } = useParams();
  const urlArr = urlData.split('+');

  return (
    <section className="Results">
      <h1 className="Results__header">Current Weather for {today}</h1>
      <Cards urlData={urlArr} />
      <Chart5Days />
      <Button className={'Results__button'} label={'Add City'}></Button>
    </section>
  );
};

export default Results;
