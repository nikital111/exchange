// берём Express
var express = require('express');
const fetch = require('node-fetch');
var bodyParser = require('body-parser');


// создаём Express-приложение
var app = express();

// parse application/x-www-form-urlencoded 
app.use(bodyParser.text());
app.use(express.static(__dirname + "/public"));

app.get('/', function (req, res) {
  res.sendfile('index.html');
});

app.post('/', function (req, res) {

  const url = 'https://api-pub.bitfinex.com/v2/';
  let arrTrades = [];

  async function request(arg) {
    let endTiming = arg[1];
    for(i=0;i<30;i++){
    try {
      const req = await fetch(`${url}/trades/t${arg[0]}/hist?limit=10000&end=${endTiming}&sort=-1`);
      const response = await req.json();
      arrTrades.push(response);
      console.log(arrTrades[i][arrTrades[i].length-1][1])
      endTiming = arrTrades[i][arrTrades[i].length-1][1];
      
    }
    catch (err) {
      console.log(err)
    }
  }
    return arrTrades;
  };

  let arg = req.body.split(',');
  console.log(arg)
  request(arg).then(()=>{
    res.send(arrTrades)
  })
});

// запускаем сервер на порту 3000
app.listen(3000);
// отправляем сообщение
console.log('Сервер стартовал!');



