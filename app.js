const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const app = express()
const port = 3000
const restaurantList = require('./restaurant.json')

mongoose.connect('mongodb://localhost/restaurant-list',{ useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection
db.on('error', () => {
	console.log('mongodb error!')
})
db.once('open', () => {
	console.log('mongodb connected!')
})

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.static('public'))

app.get('/', (req, res) => {
	res.render('index', { restaurants: restaurantList.results })
})

app.get('/restaurants/:restaurant_id', (req, res) => {
	const restaurant = restaurantList.results.find(
		restaurant => restaurant.id.toString() === req.params.restaurant_id
	)
	res.render('show', { restaurant: restaurant })
})

app.get('/search', (req, res) => {
	const keyword = req.query.keyword
	const restaurants = restaurantList.results.filter(restaurant => {
		return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
	})
	res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.listen(port, () => {
	console.log(`Express is running on http://localhost:${port}`)
})
