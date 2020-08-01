const timerBTC = document.querySelector('#timerBTC');
        const connectBTC = new WebSocket('wss://api-pub.bitfinex.com/ws/2');
        let cIdBTC;
        let datajBTC;
        let posBTC = 0;
        let negBTC = 0;
        const posTradesBTC = document.querySelector('#posTradesBTC');
        const negTradesBTC = document.querySelector('#negTradesBTC');

        connectBTC.onmessage = msg => {
            if (msg.data) {
                datajBTC = JSON.parse(msg.data);
                // console.log(dataj)
                if (datajBTC.event === 'subscribed') cIdBTC = datajBTC.chanId;
                if (Array.isArray(datajBTC[1])) {
                    for (trade of datajBTC[1]) {
                        if (trade[2] > 0) {
                            posBTC = +(posBTC + trade[2]).toFixed(4);
                            posTradesBTC.innerHTML = posBTC;
                        }
                        else {
                            negBTC = +(negBTC + trade[2]).toFixed(4);
                            negTradesBTC.innerHTML = negBTC;
                        }
                    }
                }
                if (datajBTC[1] === "te") {
                    if (datajBTC[2][2] > 0) {
                        posBTC = +(posBTC + datajBTC[2][2]).toFixed(4);
                        posTradesBTC.innerHTML = posBTC;
                    }
                    else {
                        negBTC = +(negBTC + datajBTC[2][2]).toFixed(4)
                        negTradesBTC.innerHTML = negBTC;
                    }
                }
            }
        };

        let msgBTC = JSON.stringify({
            event: 'subscribe',
            channel: 'trades',
            symbol: 'BTCUSD'
        })

        connectBTC.onopen = () => {
            console.log('conection BTC is open!')
            connectBTC.send(msgBTC)
        }
        connectBTC.onclose = () => {
            console.log('conection BTC is close(')
        }

        let secBTC = 0;
        let minBTC = 0;
        let hourBTC = 0;

        const intBTC = setInterval(() => {
            secBTC += 1;
            if (secBTC === 60) {
                secBTC = 0;
                minBTC += 1;
            }
            if (minBTC === 60) {
                minBTC = 0;
                hourBTC += 1;
            }
            timerBTC.innerHTML = `${hourBTC < 10 ? '0' + hourBTC : hourBTC}:${minBTC < 10 ? '0' + minBTC : minBTC}:${secBTC < 10 ? '0' + secBTC : secBTC}`;
        }, 1000);

        const relBTC = document.querySelector('#butBTC')
        relBTC.addEventListener('click', () => {

            let closeChannelBTC = JSON.stringify({
                event: 'unsubscribe',
                chanId: cIdBTC
            });

            let msgBTC = JSON.stringify({
                event: 'subscribe',
                channel: 'trades',
                symbol: 'BTCUSD'
            })

            //   console.log(cId);
            timerBTC.innerHTML = '00:00:00';
            posTradesBTC.innerHTML = '00';
            negTradesBTC.innerHTML = '00';
            posBTC = 0;
            negBTC = 0;
            secBTC = 0;
            minBTC = 0;
            hourBTC = 0;

            connectBTC.send(closeChannelBTC);

            connectBTC.send(msgBTC);
        })