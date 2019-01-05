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

  let tempId = ''
  if (event.source.type === 'user') {
    tempId = event.source.userId;
  } else if(event.source.type === 'room') {
    tempId = event.source.roomId;
  } else if(event.source.type === 'group'){
    tempId = event.source.groupId;
  }

  if(event.message.text.match("フリーザ")){
    return client.replyMessage(event.replyToken, {
      type: 'text',
      text: "フリーザではない。私の名はロビンマスク！"
    });
  }

  if(event.message.text.match("退出！")){
    if(event.source.type === 'user'){
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: "1:1のチャットだから、出ていけないよ～"
      });
    }
    if(event.source.type === 'group'){
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: "了解！"
      })
        .then(() => client.leaveGroup(event.source.groupId));
    }
    if(event.source.type === 'room'){
      return client.replyMessage(event.replyToken, {
        type: 'text',
        text: "了解！"
      })
        .then(() => client.leaveRoom(event.source.roomId));
    }

  }
  

  let mes = ''
  if(event.message.text === '今日の天気'){
    mes = '待っててね';
    getTodayForecast(tempId);
  }else if(event.message.text === '明日の天気'){
    mes = '待っててね';
    getTommorowForecast(tempId);
  }else if(event.message.text === '明後日の天気'){
    mes = '待っててね';
    getDayAfterTommorowForecast(tempId);
  }else if(event.message.text === '今日の気温'){
    mes = '待っててね';
    getTodayTemperature(tempId);
  }
  else if(event.message.text === '明日の気温'){
    mes = '待っててね';
    getTommorowTemperature(tempId);
  }else if(event.message.text === '明後日の気温'){
    mes = '待っててね';
    getDayAfterTommorowTemperature(tempId);
  }

  return client.replyMessage(event.replyToken, {
    type: 'text',
    text: mes
  });
}

const getTodayForecast = async (tempId) => {
    const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
    const item = res.data;
    await 
    client.pushMessage(tempId, {
      type: 'text',
      text: item.title,
    });
    client.pushMessage(tempId, {
      type: 'text',
      text: item.forecasts[0].telop,
    });
}

const getTommorowForecast = async (tempId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
  const item = res.data;
  await 
  client.pushMessage(tempId, {
    type: 'text',
    text: item.title,
  });
  client.pushMessage(tempId, {
    type: 'text',
    text: item.forecasts[1].telop,
  });
}

const getDayAfterTommorowForecast = async (tempId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
  const item = res.data;
  await 
  client.pushMessage(tempId, {
    type: 'text',
    text: item.title,
  });
  client.pushMessage(tempId, {
    type: 'text',
    text: item.forecasts[2].telop,
  });
}

const getTodayTemperature = async (tempId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
  const item = res.data;

  if(item.forecasts[0].temperature.max == null){
    client.pushMessage(tempId, {
      type: 'text',
      text: "最高気温のデータが無いみたいです",
    });
  } else {
    client.pushMessage(tempId, {
      type: 'text',
      text: "最高" + item.forecasts[0].temperature.max.celsius + "度",
    });
  }

  if(item.forecasts[0].temperature.min == null){
    client.pushMessage(tempId, {
      type: 'text',
      text: "最低気温のデータが無いみたいです",
    });
  } else {
    client.pushMessage(tempId, {
      type: 'text',
      text: "最低" + item.forecasts[0].temperature.min.celsius + "度",
    });
  }
}

const getTommorowTemperature = async (tempId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
  const item = res.data;

  if(item.forecasts[1].temperature.max == null){
    client.pushMessage(tempId, {
      type: 'text',
      text: "最高気温のデータが無いみたいです",
    });
  } else {
    client.pushMessage(tempId, {
      type: 'text',
      text: "最高" + item.forecasts[1].temperature.max.celsius + "度",
    });
  }

  if(item.forecasts[1].temperature.min == null){
    client.pushMessage(tempId, {
      type: 'text',
      text: "最低気温のデータが無いみたいです",
    });
  } else {
    client.pushMessage(tempId, {
      type: 'text',
      text: "最低" + item.forecasts[1].temperature.min.celsius + "度",
    });
  }
}

const getDayAfterTommorowTemperature = async (tempId) => {
  const res = await axios.get('http://weather.livedoor.com/forecast/webservice/json/v1?city=130010');
  const item = res.data;

  if(item.forecasts[2].temperature.max == null){
    client.pushMessage(tempId, {
      type: 'text',
      text: "最高気温のデータが無いみたいです",
    });
  } else {
    client.pushMessage(tempId, {
      type: 'text',
      text: "最高" + item.forecasts[2].temperature.max.celsius + "度",
    });
  }

  if(item.forecasts[2].temperature.min == null){
    client.pushMessage(tempId, {
      type: 'text',
      text: "最低気温のデータが無いみたいです",
    });
  } else {
    client.pushMessage(tempId, {
      type: 'text',
      text: "最低" + item.forecasts[2].temperature.min.celsius + "度",
    });
  }
}

app.listen(PORT);
console.log(`Server running at ${PORT}`);