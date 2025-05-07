import React, { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';
import './MLAnalytics.css';

const MLAnalytics = ({ data }) => {
  const modelRef = useRef(null);

  const prepareData = (rawData) => {
    const values = rawData.map(d => d.value);
    const dates = rawData.map(d => new Date(d.date).getTime());
    
    // Normalize the data
    const tensorData = tf.tensor2d(values, [values.length, 1]);
    const normalizedData = tensorData.sub(tensorData.min())
                                   .div(tensorData.max().sub(tensorData.min()));
    
    return {
      dates,
      values: normalizedData,
      originalValues: values,
      min: tensorData.min().dataSync()[0],
      max: tensorData.max().dataSync()[0]
    };
  };

  const trainModel = async (normalizedData) => {
    const model = tf.sequential();
    
    model.add(tf.layers.dense({
      inputShape: [1],
      units: 50,
      activation: 'relu'
    }));
    
    model.add(tf.layers.dense({
      units: 1
    }));

    model.compile({
      optimizer: tf.train.adam(0.01),
      loss: 'meanSquaredError'
    });

    const xs = tf.linspace(0, 1, normalizedData.values.shape[0]);
    
    await model.fit(xs, normalizedData.values, {
      epochs: 100,
      callbacks: tfvis.show.fitCallbacks(
        { name: 'Training Performance' },
        ['loss'],
        { height: 200, callbacks: ['onEpochEnd'] }
      )
    });

    return model;
  };

  const visualizeResults = async (model, preparedData) => {
    const { dates, originalValues, min, max } = preparedData;
    
    // Generate predictions
    const xs = tf.linspace(0, 1, dates.length);
    const preds = model.predict(xs);
    
    // Denormalize predictions
    const denormalizedPreds = preds.mul(max - min).add(min);
    
    const series = ['Original', 'Predicted'];
    const data = {
      values: [
        originalValues,
        denormalizedPreds.dataSync()
      ],
      series
    };

    const surface = { name: 'Time Series Predictions', tab: 'Predictions' };
    
    tfvis.render.linechart(surface, data, {
      xAxisDomain: dates,
      xAxisFormat: d => new Date(d).toLocaleDateString(),
      yAxisLabel: 'Value',
      width: 800,
      height: 400
    });
  };

  const runAnalysis = async () => {
    if (!data || data.length === 0) return;

    const preparedData = prepareData(data);
    const model = await trainModel(preparedData);
    modelRef.current = model;
    await visualizeResults(model, preparedData);
  };

  useEffect(() => {
    runAnalysis();
  }, [data]);

  return (
    <div className="ml-analytics">
      <h2>ML Analytics Dashboard</h2>
      <div className="visualization-container">
        <div id="training-performance"></div>
        <div id="predictions"></div>
      </div>
    </div>
  );
};

export default MLAnalytics; 