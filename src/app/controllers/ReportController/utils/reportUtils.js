const { getCurrentDate } = require('../../../helpers/DateHelper')
const { emojis } = require('../../../enum/EmojiEnum')

const logMessages = {
  start: `Starting daily quotes on ${getCurrentDate(false)}...`,
  finish: `All reports were sent on ${getCurrentDate(false)}...`
}

const alertMessages = {
  support: `<code>Atenção: Até o momento, o @brstocksbot suporta apenas as seguintes classes de ativos: AÇÕES, Fundo de Investimento Imobiliário, ETFs e BDRs. Em breve daremos suporte a outras classes de ativos também ${emojis.robot}</code>`
}

module.exports = { alertMessages, logMessages }
