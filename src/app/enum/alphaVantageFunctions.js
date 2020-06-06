const alphaFunctions = {
  /**
   * Look a specific symbol or company
   */
  symbolSearch: 'SYMBOL_SEARCH',
  /**
   * Returns the latest price and volume of a specific symbol
   */
  globalQuote: 'GLOBAL_QUOTE',
  /**
   * Returns monthly time series of the global equity specified
   */
  timeSeriesMonthly: 'TIME_SERIES_MONTHLY',
  /**
   * Returns monthly adjusted time serie
   */
  timeSeriesMonthlyAdjusted: 'TIME_SERIES_MONTHLY_ADJUSTED'
}

module.exports = alphaFunctions
