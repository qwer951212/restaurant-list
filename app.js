const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const Restaurant = require('./models/restaurant')
const restaurantList = require('./models/seeds/restaurant')
const app = express()
const port = 3000

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

app.use(bodyParser.urlencoded({ extended: true }))

app.use(methodOverride('_method'))

app.get('/', (req, res) => {
	Restaurant.find()
		.lean()
		.then(restaurants => res.render('index', { restaurants }))
		.catch(error => console.error(error))
})

app.get('/restaurants/new', (req, res) => {
  return res.render('new')
})

app.post('/restaurants', (req, res) => {
	const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
	return Restaurant.create({ name, name_en, category, image, location, phone, google_map, rating, description })
		.then(() => res.redirect('/'))
		.catch(error => console.log(error))
})

app.get('/restaurants/:id', (req, res) => {
	const id = req.params.id
	return Restaurant.findById(id)
		.lean()
		.then((restaurant) => res.render('show', { restaurant }))
		.catch(error => console.log(error))
})

app.get('/search', (req, res) => {
	const keyword = req.query.keyword
	const results = []
	const restaurants = restaurantList.results.filter(restaurant => {
		if ((restaurant.name.toLowerCase().includes(keyword.toLowerCase())) || (restaurant.category.toLowerCase().includes(keyword.toLowerCase()))) return results
	})
	res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.get('/restaurants/:id/edit', (req, res) => {
	const id = req.params.id
	return Restaurant.findById(id)
		.lean()
		.then((restaurant) => res.render('edit', { restaurant }))
		.catch(error => console.log(error))
})

app.put('/restaurants/:id', (req, res) => {
	const id = req.params.id
	return Restaurant.findById(id)
		.then(restaurant => {
			restaurant = Object.assign(restaurant, req.body)
			return restaurant.save()
		})
		.then(() => res.redirect(`/restaurants/${id}`))
		.catch(error => console.log(error))
})

app.delete('/restaurants/:id', (req, res) => {
	const id = req.params.id
	return Restaurant.findById(id)
		.then(restaurant => restaurant.remove())
		.then(() => res.redirect('/'))
		.catch(error => console.log(error))
})

app.listen(port, () => {
	console.log(`Express is running on http://localhost:${port}`)
})
