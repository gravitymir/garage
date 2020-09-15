const express = require('express');
const router = express.Router();
const moment = require('moment');
moment.locale("ru");

const obj = {
  0: { 0: 1, 1: 2 },
  1: { 0: 3, 1: 1 },
  2: { 0: 4, 1: 3 },
  3: { 0: 2, 1: 4 }
};

const start = 1571115600;
const _96 = 345600;
const _24 = 86400;

function tick_gtk_tt(m){
    m = Number(m) || 0;

    //let now = moment({'year': 2020, 'month': 0, 'hours': 18, 'minutes': 0});
    let now = moment().add(m, 'month');
    let month = moment(now).month();

    let start_month = moment(now).startOf('month');
    let end_month = moment(now).endOf('month');

    let t_start = moment(start_month).startOf('week');
    let t_end = moment(end_month).endOf('week');

    let t_lenght = Math.round((moment(t_end).unix() - moment(t_start).unix()) / _24);
    
    let smena = parseInt((moment(t_start).unix() - start) % _96 / _24);

    let arr = [];
    for(let i = 1; i <= t_lenght; i++){
      //let str = `${i} ${t_start.month()} ${t_start.date()} ${t_start.day()} ${obj[(smena + i) % 4][0]} ${month == t_start.month() ? 'color': 'black'}`
      
      arr.push({
        smena: `smena_${obj[(smena + i) % 4][0]}${month == t_start.month() ? '': '_black'}`,
        date: t_start.date()
      });

      
      
      t_start.add(1, 'day');
    }
    
    return {
        arr: arr, 
        date: moment(now).format('MMMM YYYY'),
        data_block: t_lenght > 35 ? 755: t_lenght > 28 ? 645: 535,
        next: {
          m_name: moment(now).add(1, 'month').format('MMMM'),
          m: m + 1
        },

        prev: {
          m_name: moment(now).subtract(1, 'month').format('MMMM'),
          m: m - 1
        }
    };
}





router.get('/', function(req, res) {
    res.render('gtk_tt/gtk_tt', 
    {
        title: 'Таблица',
        data: tick_gtk_tt(req.query.m)
    });
});

module.exports = router;
