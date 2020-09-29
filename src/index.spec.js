const request = require('supertest')
const app = require('./server')

describe('App Server', () => {
  it('should return a success message when accessing the main GET route', async () => {
    const res = await request(app).get('/')
    const desiredResponse = { status: 'ROBOT ONLINE' }

    expect(res.statusCode).toBe(200)
    expect(res.body).toHaveProperty('status')
    expect(res.body).toMatchObject(desiredResponse)
  })
})
