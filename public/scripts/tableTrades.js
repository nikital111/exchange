const iframe = document.querySelector('#iframeTrades').contentWindow.document;
iframe.body.innerHTML = (`
        <div class='preloaderDiv'>
            <div class="preloaderImg"></div>
            </div>
        <table id="tableTrades"></table> 
        <style>
            .preloaderDiv{
                position: fixed;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                overflow: hidden;
                background: #fff;
                z-index: 1001;
                visibility: hidden;
            }
            .preloaderImg{
                position: relative;
                top: 50%;
                left: 50%;
                width: 120;
                height: 64px;
                margin-top: -32px;
                margin-left: -60px;
                background: url('/img/preloader.gif') no-repeat 50% 50%;
            }
            table {
           font-size: 30px; 
           font-weight: bold;
           width: 80%;
        } 
        td {
            padding: 5px 5px 5px 12px;
            border: 1px solid;
        }
        </style>
        `);



const getBut = document.querySelector('#getBut');

getBut.addEventListener('click', () => {
    getTrades(selectTimeVal, selectCurrencyVal, endTimeVal)
})

const table = iframe.querySelector('#tableTrades');

let selectTime = document.querySelector('#selectorTime');
let selectTimeVal = selectTime.value;

selectTime.addEventListener('change', () => {
    selectTimeVal = selectTime.value;
})

let selectCurrency = document.querySelector('#selectorCurrency');
let selectCurrencyVal = selectCurrency.value;

selectCurrency.addEventListener('change', () => {
    selectCurrencyVal = selectCurrency.value;
})

const endTime = document.querySelector('#endTime');
let endTimeVal = endTime.value;
endTime.addEventListener('input', () => {
    endTimeVal = endTime.value;
    // console.log(endTimeVal,Date.parse(endTimeVal))
})

const resetDate = document.querySelector('#butResetDate')

resetDate.addEventListener('click',()=>{
    endTime.value = '';
    endTimeVal = '';
})

function getTrades(selectTime, currency, specifiedTime) {
    if (!specifiedTime) specifiedTime = new Date();
    specifiedTime = Date.parse(specifiedTime)
    console.log(selectTime, currency, new Date(specifiedTime))
    iframe.querySelector('.preloaderDiv').style.visibility = 'visible';

    async function fet(currency, specifiedTime) {
        try {
            const req = await fetch(`/`, {
                method: 'POST', headers: {
                    "Content-type": "text/plain"
                }, body: `${currency},${specifiedTime}`
            });
            const response = await req.json();
            return [response, selectTime, specifiedTime];
        }
        catch (err) {
            console.log(err)
        }
    };

    fet(currency, specifiedTime)
        .then(data => {
            //  console.log(data);
            let html = `<tr>
                                <td>Дата:</td>
                                <td>Куплено:</td>
                                <td>Продано:</td>
                                <td>Разница:</td>
                                <td>Цена:</td>
                                </tr>`;
            let allowTime = 0;
            let posSum = 0;
            let negSum = 0;
            let curPrice = data[0][0][0][3].toFixed(1);

            const nearNum = (num) => {
                const arr = [3, 7, 11, 15, 19, 23]
                const curArr = arr.filter((hour) => {
                    return num - hour > 0
                }).map(hour => { return num - hour })
                let curNum = num - Math.min.apply(null, curArr)
                return curNum;
            }
            let date = new Date(data[2])
            if (data[1] === '1') {

                date.setSeconds(00)
                allowTime = date;
                console.log(allowTime)
            }

            else if (data[1] === '5') {

                let min = String(date.getMinutes());
                if (+min < 10) {
                    if(+min < 5) date.setMinutes(0)
                    else date.setMinutes(5)
                }
                else{
                    if(min[1] < 5) date.setMinutes(min[0] + '0')
                    else date.setMinutes(min[0] + '5')
                }
                date.setSeconds(00)
                allowTime = date;
                console.log(allowTime)
            }

            else if (data[1] === '30') {

                let min = date.getMinutes();
                if (min < 30) date.setMinutes(0)
                else date.setMinutes(30)
                date.setSeconds(00)
                allowTime = date;
                console.log(allowTime)
            }

            else if (data[1] === '60') {

                date.setMinutes(00)
                date.setSeconds(00)
                allowTime = date;
                //  console.log(allowTime)
            }

            else if (data[1] === '240') {

                date.setHours(nearNum(date.getHours()))
                date.setMinutes(00)
                date.setSeconds(00)
                allowTime = date;
                console.log(allowTime)
            }

            else if (data[1] === '1440') {

                date.setHours(00)
                date.setMinutes(00)
                date.setSeconds(00)
                allowTime = date;
                console.log(allowTime)
            }

            for (arrTrades of data[0]) {
                for (trade of arrTrades) {
                    if (trade[1] < allowTime) {

                        let alDate = new Date(allowTime);
                        let correctTime = `${alDate.getDate()}.${alDate.getMonth() < 9 ? '0' + (alDate.getMonth() + 1) : alDate.getMonth() + 1}.${alDate.getFullYear()} - ${alDate.getHours() < 10 ? '0' + alDate.getHours() : alDate.getHours()}:${alDate.getMinutes() < 10 ? '0' + alDate.getMinutes() : alDate.getMinutes()}`
                        html += `<tr>
                                <td>${correctTime}</td>
                                <td>${posSum.toFixed(4)}</td>
                                <td>${negSum.toFixed(4)}</td>
                                <td>${(posSum + negSum).toFixed(4)}</td>
                                <td>${curPrice}</td>
                                </tr>`
                        allowTime = (allowTime - (selectTime * 60000));
                        posSum = 0;
                        negSum = 0;
                        curPrice = trade[3].toFixed(1);
                    }
                    else {
                        if (trade[2] > 0) { posSum += trade[2] }
                        else { negSum += trade[2] }
                    }
                }
            }
            table.innerHTML = html;
        })
        .then(() => {
            iframe.querySelector('.preloaderDiv').style.visibility = 'hidden';
        })
}