const server = require('./server')

const port = process.env.PORT || 3001

server.listen(port, (err) => {
  if (err) {
    console.log('Error')
  } else {
    console.log('BR Stocks bot is running...')
  }
})
