const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const Restaurant = require('./models/restaurant')
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
	const restaurants = restaurantList.results.filter(restaurant => {
		return restaurant.name.toLowerCase().includes(keyword.toLowerCase())
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

app.post('/restaurants/:id/edit', (req, res) => {
	const id = req.params.id
	const { name, name_en, category, image, location, phone, google_map, rating, description } = req.body
	console.log(req.body)
	return Restaurant.findById(id)
		.then(restaurant => {
			restaurant.name = name
      restaurant.name_en = name_en
      restaurant.category = category
      restaurant.image = image
      restaurant.location = location
      restaurant.phone = phone
      restaurant.google_map = google_map
      restaurant.rating = rating
			restaurant.description = description
			return restaurant.save()
		})
		.then(() => res.redirect(`/restaurants/${id}`))
		.catch(error => console.log(error))
})

app.listen(port, () => {
	console.log(`Express is running on http://localhost:${port}`)
})
