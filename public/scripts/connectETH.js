const connectETH = new WebSocket('wss://api-pub.bitfinex.com/ws/2');

        let cIdETH;
        let datajETH;
        let posETH = 0;
        let negETH = 0;
        const posTradesETH = document.querySelector('#posTradesETH');
        const negTradesETH = document.querySelector('#negTradesETH');

        connectETH.onmessage = msg => {
            if (msg.data) {
                datajETH = JSON.parse(msg.data);
                // console.log(dataj)
                if (datajETH.event === 'subscribed') cIdETH = datajETH.chanId;
                if (Array.isArray(datajETH[1])) {
                    for (trade of datajETH[1]) {
                        if (trade[2] > 0) {
                            posETH = +(posETH + trade[2]).toFixed(4);
                            posTradesETH.innerHTML = posETH;
                        }
                        else {
                            negETH = +(negETH + trade[2]).toFixed(4);
                            negTradesETH.innerHTML = negETH;
                        }
                    }
                }
                if (datajETH[1] === "te") {
                    if (datajETH[2][2] > 0) {
                        posETH = +(posETH + datajETH[2][2]).toFixed(4);
                        posTradesETH.innerHTML = posETH;
                    }
                    else {
                        negETH = +(negETH + datajETH[2][2]).toFixed(4)
                        negTradesETH.innerHTML = negETH;
                    }
                }
            }
        };

        let msgETH = JSON.stringify({
            event: 'subscribe',
            channel: 'trades',
            symbol: 'ETHUSD'
        })

        connectETH.onopen = () => {
            console.log('conection ETH is open!')
            connectETH.send(msgETH)
        }
        connectETH.onclose = () => {
            console.log('conection ETH is close(')
        }

        let secETH = 0;
        let minETH = 0;
        let hourETH = 0;

        var intETH = setInterval(() => {
            secETH += 1;
            if (secETH === 60) {
                secETH = 0;
                minETH += 1;
            }
            if (minETH === 60) {
                minETH = 0;
                hourETH += 1;
            }
            timerETH.innerHTML = `${hourETH < 10 ? '0' + hourETH : hourETH}:${minETH < 10 ? '0' + minETH : minETH}:${secETH < 10 ? '0' + secETH : secETH}`;
        }, 1000);

        const relETH = document.querySelector('#butETH')
        relETH.addEventListener('click', () => {

            let closeChannelETH = JSON.stringify({
                event: 'unsubscribe',
                chanId: cIdETH
            });

            let msgETH = JSON.stringify({
                event: 'subscribe',
                channel: 'trades',
                symbol: 'ETHUSD'
            })

            //   console.log(cId);
            timerETH.innerHTML = '00:00:00';
            posTradesETH.innerHTML = '00';
            negTradesETH.innerHTML = '00';
            posETH = 0;
            negETH = 0;
            secETH = 0;
            minETH = 0;
            hourETH = 0;

            connectETH.send(closeChannelETH);

            connectETH.send(msgETH);
        })