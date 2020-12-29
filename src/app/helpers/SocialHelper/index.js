const shareByWhatsapp = (text) => ({
  inline_keyboard: [
    [{
      text: 'Compartilhar - Whatsapp',
      url: `https://api.whatsapp.com/send?text=${text}`
    }]
  ]
})

module.exports = { shareByWhatsapp }
