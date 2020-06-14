const messages = {
  START_MESSAGE: '<b>&#x1F4C8 @BRStocksBot</b>\n\n' +
    'Bem-vindo(a) ao <b>BR Stocks Bot</b>!\n\n' +
    'Monte sua carteira para monitorar seus ativos favoritos.\n\n' +
    'É simples de usar:\n\n' +
    '<b>&#x1F449 <b>CADASTRE UM ATIVO:</b> </b>\n' +
    '/stock\t\t <code>ATIVO</code>\t\t<code>QTDADE.</code>\t\t<code>PM</code>\n\n' +
    'Pronto! Agora é só aguardar a análise diária da sua carteira.\n\n' +
    '<b>Dúvidas?</b>\n' +
    'Mais informações em <i>/help</i>.\n\n',

  HELP_MESSAGE: '<b>&#x1F4C8 @BRStocksBot</b>\n\n' +
    '<b>INTRUÇÕES</b>\n\n' +
    '<b>&#x1F449 <b>CADASTRE UM ATIVO:</b> </b>\n' +
    '/stock  <code>ATIVO</code>\t\t<code>QTDADE.</code>\t\t<code>PM</code>\n\n' +
    '<b>&#x1F449 <b>DELETE UM ATIVO:</b></b>\n' +
    '/del  <code>ATIVO</code>\n\n' +
    '<b>&#x1F449 <b>VISUALIZAR SUA CARTEIRA:</b></b>\n' +
    '/wallet\n\n' +
    '<code>BY:</code> @hick97',
  STOCK_CREATED: 'Ativo inserido com sucesso!\n' +
    ' Veja seus ativos com o comando /wallet.',
  STOCK_UPDATED: 'Ativo atualizado com sucesso\n' +
    ' Veja seus ativos com o comando /wallet.',
  REMOVE_STOCK: 'Ativo removido com sucesso!',
  INVALID_COMMAND: '&#x26A0 Comando inválido!\n' +
    'Para mais informações use /help.',
  ERROR_MESSAGE: '&#x26A0 Ocorreu um erro!\n' +
    'Tente novamente em alguns instantes!',
  NOT_FOUND: '&#x26A0 Ativo não encontrado ou sentença mal formatada, verifique o menu /help.'
}

module.exports = messages
