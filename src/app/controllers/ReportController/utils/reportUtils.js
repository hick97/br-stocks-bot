const { getCurrentDate } = require('../../../helpers/ReportHelper')

const logMessages = {
  start: `Starting daily quotes on ${getCurrentDate(false)}...`,
  finish: `All reports were sent on ${getCurrentDate(false)}...`
}

const alertMessages = {
  support: '<code>Atenção: Até o momento, o @brstocksbot suporta apenas as seguintes classes de ativos: AÇÕES ou Fundo de Investimento Imobiliário. Em breve daremos suporte a ETFs também &#x1F916</code>'
}

module.exports = { alertMessages, logMessages }
