'use strict';

const express = require('express');
const line = require('@line/bot-sdk');
const axios = require('axios');
const PORT = process.env.PORT || 3000;

const config = {
  channelSecret: '',
  channelAccessToken: ''
};

const app = express();

app.post('/webhook', line.middleware(config), (req, res) => {
    console.log(req.body.events);
    Promise
      .all(req.body.events.map(handleEvent))
      .then((result) => res.json(result));
});

const client = new line.Client(config);

function handleEvent(event) {
  if (event.type !== 'message' || event.message.type !== 'text') {
    return Promise.resolve(null);
  }

  let mes = ''
  if(event.message.text === '今日の天気'){
    mes = '待っててね';
    getTodayForecast(event.source.roomId);
  }else if(event.message.text === '明日の天気'){
    mes = '待っててね';
    getTommorowForecast(event.source.roomId);
  }else if(event.message.text === '明後日の天気'){
    mes = '待っててね';
    getDayAfterTommorowForecast(event.source.roomId);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: mes
  });
}

const getTodayForecast = async (roomId) => {
    const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
    const item = res.data;

    await 
    client.pushMessage(roomId, {
      type: 'text',
      text: item.title,
    });
    client.pushMessage(roomId, {
      type: 'text',
      text: item.forecasts[0].telop,
    });
}

const getTommorowForecast = async (roomId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
  const item = res.data;

  await 
  client.pushMessage(roomId, {
    type: 'text',
    text: item.title,
  });
  client.pushMessage(roomId, {
    type: 'text',
    text: item.forecasts[1].telop,
  });
}

const getDayAfterTommorowForecast = async (roomId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
  const item = res.data;

  await 
  client.pushMessage(roomId, {
    type: 'text',
    text: item.title,
  });
  client.pushMessage(roomId, {
    type: 'text',
    text: item.forecasts[1].telop,
  });
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);