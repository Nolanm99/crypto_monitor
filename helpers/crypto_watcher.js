const axios   = require('axios');
const SECRET  = require('../config/coinmarketcap')
const CONFIG  = require('../config/server_controls')

async function retrieveCryptoData(symbols) {

    // Log input
    if(CONFIG.DEBUG_MODE) {console.log(`\nDEBUG: retrieveCryptoData:: input:`, symbols)};
    
    // Retrieve top crypto currency prices from CoinMarketCap.com
    response = await axios.get(
        (CONFIG.SANDBOX_API ? SECRET.TEST_ENDPOINT : SECRET.ENDPOINT) + 
        '/v1/cryptocurrency/quotes/latest' + 
        '?symbol=' + 
        symbols, {
        headers: {
            'X-CMC_PRO_API_KEY': (CONFIG.SANDBOX_API ? SECRET.TEST_API_KEY : SECRET.API_KEY),
        },
    })
    .then(function (response) {
        // handle success
        const json = response.data;
        return json
    })
    .catch(function (error) {
        // handle error
        //console.log(error);
        return null;
    });
    return response;
}

module.exports = {
    retrieveCryptoData,
};