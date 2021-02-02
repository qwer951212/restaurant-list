const Restaurant = require('../restaurant')
const db = require('../../config/mongoose')

db.once('open', () => {
  const restaurantList = require('./restaurant.json')
  for (let i = 0; i < restaurantList.results.length; i++) {
    Restaurant.create(restaurantList.results[i])
  }
  console.log('done')
})
