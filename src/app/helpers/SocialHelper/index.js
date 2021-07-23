const shareByWhatsapp = (text) =>
  [{
    text: '📲 Compartilhar - Whatsapp',
    url: `https://api.whatsapp.com/send?text=${text}`
  }]

module.exports = { shareByWhatsapp }
