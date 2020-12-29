const randomStocks = [
  {
    stock: 'PETR4',
    quantity: 30,
    price: 22.72
  },
  {
    stock: 'OIBR3',
    quantity: 10,
    price: 1.83
  },
  {
    stock: 'ITUB4',
    quantity: 20,
    price: 31.59
  },
  {
    stock: 'ENBR3',
    quantity: 15,
    price: 17.17
  },
  {
    stock: 'SAPR11',
    quantity: 8,
    price: 23.7
  }
]

const sortedStocks = {
  asc: [
    {
      stock: 'OIBR3',
      quantity: 10,
      price: 1.83
    },
    {
      stock: 'ENBR3',
      quantity: 15,
      price: 17.17
    },
    {
      stock: 'PETR4',
      quantity: 30,
      price: 22.72
    },
    {
      stock: 'SAPR11',
      quantity: 8,
      price: 23.7
    },
    {
      stock: 'ITUB4',
      quantity: 20,
      price: 31.59
    }
  ],
  desc: [
    {
      stock: 'ITUB4',
      quantity: 20,
      price: 31.59
    },
    {
      stock: 'SAPR11',
      quantity: 8,
      price: 23.7
    },
    {
      stock: 'PETR4',
      quantity: 30,
      price: 22.72
    },
    {
      stock: 'ENBR3',
      quantity: 15,
      price: 17.17
    },
    {
      stock: 'OIBR3',
      quantity: 10,
      price: 1.83
    }
  ]
}

module.exports = { randomStocks, sortedStocks }
