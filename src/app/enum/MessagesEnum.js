const { emojis } = require('./EmojiEnum')

const ErrorMessages = {
  INVALID_COMMAND: emojis.warning + ' Comando inválido!\n' +
    'Para mais informações use /help.',
  GENERAL_ERROR: emojis.warning + ' Ocorreu um erro!\n' +
    'Tente novamente em alguns instantes!',
  NOT_FOUND: emojis.warning + ' Ativo não encontrado ou sentença mal formatada, verifique o menu /help.',
  WALLET_IS_REQUIRED: emojis.warning + ' Você precisa cadastrar ao menos um ativo na sua carteira pra completar essa ação.'
}

const ActionMessages = {
  WALLET_UPDATED: 'Carteira atualizada com sucesso!\n' +
    ' Veja seus ativos com o comando:\n' +
    '/wallet',
  STOCK_CREATED: 'Ativo inserido com sucesso!\n' +
    ' Veja seus ativos com o comando:\n' +
    '/wallet',
  STOCK_UPDATED: 'Ativo atualizado com sucesso!\n' +
    ' Veja seus ativos com o comando:\n' +
    '/wallet',
  REMOVE_STOCK: 'Ativo removido com sucesso!'
}

const GeneralMessages = {
  START_MESSAGE: '<b>' + emojis.chartUpwards + ' Bot do investidor (@brstocksbot)</b>\n\n' +
    'Versão Beta 1.0.0\n\n' +
    'Seja bem-vindo(a) investidor(a)!\n\n' +
    'Monte sua carteira para monitorar seus ativos favoritos. É simples de usar:\n\n' +
    '<b>' + emojis.rightPointing + ' <b>CADASTRE UM ATIVO:</b> </b>\n' +
    '/stock\t\t <code>ATIVO</code>\t\t<code>QTDADE.</code>\t\t<code>PM</code>\n' +
    '/stock  <code>ITSA4</code>\t\t<code>100</code>\t\t<code>9.80</code> <code>(EXEMPLO)</code>\n\n' +
    '<code>PM = PREÇO MÉDIO DO ATIVO</code>\n\n' +
    'Pronto! Agora é só aguardar a análise da sua carteira. Todos os dias no período noturno enviaremos um relatório com a perfomance diária dos seus ativos.\n\n' +
    '<b>DÚVIDAS?</b>\n' +
    'Mais informações em: <i>/help</i>.\n\n' +
    '<b>CONFIRA TAMBÉM:</b>\n' +
    '<code>' + emojis.mobilePhone + ' INSTAGRAM:</code> <a href="https://www.instagram.com/botdoinvestidor/">@botdoinvestidor</a>\n' +
    '<code>' + emojis.openBook + ' LEITURAS:</code> <a href="https://amzn.to/30mMyvh">Dicas de leitura</a>\n' +
    '<code>' + emojis.bankNote + ' COLABORE:</code> <a href="picpay.me/hick97">PicPay</a>\n\n',

  HELP_MESSAGE: '<b>' + emojis.chartUpwards + ' Bot do investidor (@brstocksbot)</b>\n\n' +
    '<b>INTRUÇÕES</b>\n\n' +
    '<b>' + emojis.rightPointing + ' <b>CADASTRE UM ATIVO:</b> </b>\n' +
    '/stock  <code>ATIVO</code>\t\t<code>QTDADE.</code>\t\t<code>PM</code>\n' +
    '/stock  <code>ITSA4</code>\t\t<code>100</code>\t\t<code>9.80</code> <code>(EXEMPLO)</code>\n\n' +
    '<code>PM = PREÇO MÉDIO DO ATIVO</code>\n\n' +
    '<b>' + emojis.rightPointing + ' <b>DELETE UM ATIVO:</b></b>\n' +
    '/del  <code>ATIVO</code>\n' +
    '/del  <code>ITSA4</code> <code>(EXEMPLO)</code>\n\n' +
    '<b>' + emojis.rightPointing + ' <b>VISUALIZAR SUA CARTEIRA:</b></b>\n' +
    '/wallet\n\n' +
    '<b>' + emojis.rightPointing + ' <b>FUNDAMENTOS DE UM ATIVO:</b></b>\n' +
    '/fundamentals  <code>AÇÃO</code>\n' +
    '/fundamentals  <code>ITSA4</code> <code>(EXEMPLO)</code>\n\n' +
    '<b>CONFIRA TAMBÉM:</b>\n\n' +
    '<code>' + emojis.mobilePhone + ' INSTAGRAM:</code> <a href="https://www.instagram.com/botdoinvestidor/">@botdoinvestidor</a>\n' +
    '<code>' + emojis.openBook + ' LEITURAS:</code> <a href="https://amzn.to/30mMyvh">Dicas de leitura</a>\n' +
    '<code>' + emojis.bankNote + ' COLABORE:</code> <a href="picpay.me/hick97">PicPay</a>\n\n' +
    'by: @hick97'

}

module.exports = { GeneralMessages, ErrorMessages, ActionMessages }
