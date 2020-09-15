const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
    res.render('gtk_tt/gtk_tt_masty', { title: 'Таблица' });
});

module.exports = router;
