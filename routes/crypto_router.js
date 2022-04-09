var express         = require('express');
var router          = express.Router();
var bodyParser      = require('body-parser');
var crypto_watcher  = require('../helpers/crypto_watcher');
var jsonParser = bodyParser.json();

const CONFIG  = require('../config/server_controls')

// Default Station 1
router.get('/prices', function(req, res, next) {
    // Default currency lookup
    default_symbols = ['BTC','ETH','BNB','ADA','SOL'];
    if(CONFIG.DEBUG_MODE) {console.log(`\nDEBUG: router: symbols entered:`, default_symbols)};

    // Retrieve currency data using symbol
    quote = crypto_watcher.retrieveCryptoData(default_symbols).then(function(quote) {

        if(quote) {
            // Format JSON response
            prices = []; day_changes = []; week_changes = []; market_caps = [];
            for (let i=0; i<default_symbols.length; i++) {
                prices.         push(quote.data[default_symbols[i]].quote.USD.price.toFixed(5));
                day_changes.    push(quote.data[default_symbols[i]].quote.USD.percent_change_24h.toFixed(3));
                week_changes.   push(quote.data[default_symbols[i]].quote.USD.percent_change_7d.toFixed(3));
                market_caps.    push(Number(quote.data[default_symbols[i]].quote.USD.market_cap.toFixed(2)).toLocaleString());
            }

            // Render post1 page
            res.render('prices', {
                station_title:      'One',
                symbols:            default_symbols,
                quotes:             prices,
                day_changes:        day_changes,
                week_changes:       week_changes,
                market_caps:        market_caps,
            });
        } else {
            // Render post1 page with empty quote
            empty_quote = Array(symbols.length).fill('ERROR RETRIEVING DATA');
            
            // Render post1 page with empty quote
            res.render('prices', {
                station_title:      'One',
                symbols:            default_symbols,
                quotes:             empty_quote,
                day_changes:        empty_quote,
                week_changes:       empty_quote,
                market_caps:        empty_quote,
            });
        }

    });
});

// Custom Station 1
router.post('/prices', jsonParser, function(req, res, next) {

    // Retrieve symbol lookup from request
    symbols = req.body.symbolInput.toUpperCase().split(',');
    if(CONFIG.DEBUG_MODE) {console.log(`\nDEBUG: router: symbols entered:`, symbols)};

    // Retrieve currency data using symbol
    quote = crypto_watcher.retrieveCryptoData(symbols).then(function(quote) {

        // If data is received
        if(quote) {

            // Format JSON response
            prices = []; day_changes = []; week_changes = []; market_caps = [];
            for (let i=0; i<symbols.length; i++) {
                // Fill data arrays
                prices.         push(quote.data[symbols[i]].quote.USD.price.toFixed(5));
                day_changes.    push(quote.data[symbols[i]].quote.USD.percent_change_24h.toFixed(3));
                week_changes.   push(quote.data[symbols[i]].quote.USD.percent_change_7d.toFixed(3));
                market_caps.    push(Number(quote.data[symbols[i]].quote.USD.market_cap.toFixed(2)).toLocaleString());
            }

            // Render post1 page
            res.render('prices', {
                station_title:      'One',
                symbols:            symbols,
                quotes:             prices,
                day_changes:        day_changes,
                week_changes:       week_changes,
                market_caps:        market_caps,
            });
        } else {
            // Render post1 page with empty quote
            empty_quote = Array(symbols.length).fill('ERROR RETRIEVING DATA');

            res.render('prices', {
                station_title:      'One',
                symbols:            symbols,
                quotes:             empty_quote,
                day_changes:        empty_quote,
                week_changes:       empty_quote,
                market_caps:        empty_quote,
            });
        }

    });
});



router.get('/2', jsonParser, function(req, res, next) {
    res.render('2', { station_title: 'Two' });
});

module.exports = router;
