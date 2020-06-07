const messages = {
  START_MESSAGE: '<b>&#x1F4C8 @BRStocksBot</b>\n\n' + 'Bem-vindo ao <b>BR Stocks Bot</b>!\n\n' + 'Monte sua carteira para monitorar seus ativos favoritos.\n\n' + 'É simples de usar:\n\n' + '&#x1F449 Adicione um novo ativo:\n' + '<i>/stock Ativo Quantidade PM</i>\n\n' + '&#x1F449 Obtenha detalhes da carteira:\n' + '<i>/details</i>\n\n' + 'Dúvidas? Mais informações em <i>/help</i>.\n\n',
  HELP_MESSAGE: '<b>&#x1F4C8 @BRStocksBot</b>\n\n' + '<b>&#x2753 Instruções</b>\n\n' + '<b>&#x1F449 Cadastrar ativo ou editar ativo: </b>\n' + '/stock <i>Ativo Quantidade PM</i>\n\n' + '<b>&#x1F449 Deletar ativo:</b>\n' + '/del <i>Ativo</i>\n\n' + '<b>&#x1F449 Visualizar ativos da carteira:</b>\n' + '/wallet\n\n' + '<b>&#x1F449 Detalhes da carteira:</b>\n' + '/details\n\n' + 'By: <a href="https://t.me/hick97">@hick97</a>',
  STOCK_CREATED: 'Ativo inserido com sucesso, veja seus ativos com o comando /wallet',
  STOCK_UPDATED: 'Ativo atualizado com sucesso, veja seus ativos com o comando /wallet',
  REMOVE_STOCK: 'Ativo removido com sucesso!',
  INVALID_COMMAND: '&#x26A0 Comando inválido! Para mais informações use /help.',
  ERROR_MESSAGE: '&#x26A0 Ocorreu um erro, tente novamente em alguns instantes!',
  NOT_FOUND: '&#x26A0 Ativo não encontrado ou sentença mal formatada, verifique o menu /help.'
}

module.exports = messages
