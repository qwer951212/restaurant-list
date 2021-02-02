const express = require('express')
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const restaurantList = require('./models/seeds/restaurant')
const routes = require('./routes')
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

app.use(routes)

app.get('/search', (req, res) => {
	const keyword = req.query.keyword
	const results = []
	const restaurants = restaurantList.results.filter(restaurant => {
		if ((restaurant.name.toLowerCase().includes(keyword.toLowerCase())) || (restaurant.category.toLowerCase().includes(keyword.toLowerCase()))) return results
	})
	res.render('index', { restaurants: restaurants, keyword: keyword })
})

app.listen(port, () => {
	console.log(`Express is running on http://localhost:${port}`)
})
