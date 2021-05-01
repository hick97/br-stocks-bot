const stockAttributes = {
  SYMBOL: '1. symbol',
  NAME: '2. name',
  TYPE: '3. type',
  REGION: '4. region',
  MARKET_OPEN: '5. marketOpen',
  MARKET_CLOSE: '6. marketClose',
  TIMEZONE: '7. timezone',
  CURRENCY: '8. currency',
  MATCH_SCORE: '9. matchScore'
}

const defaultAttributes = {
  NAME: 'Not found',
  TYPE: 'Equity',
  REGION: 'Brazil/Sao Paolo',
  MARKET_OPEN: '10:00',
  MARKET_CLOSE: '17:30',
  TIMEZONE: 'UTC-03',
  CURRENCY: 'BRL'
}

module.exports = { stockAttributes, defaultAttributes }
