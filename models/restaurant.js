const mongoose = require('mongoose')
const Schema = mongoose.Schema
const restaurantSchema = new Schema({
  name: {
    type: String, // 資料型別是字串
    required: true // 這是個必填欄位
  },
  name_en: {
    type: String,
    required: false
  },
  category: {
    type: String,
    required: false
  },
  image: {
    type: String,
    required: false    
  },
  location: {
    type: String,
    required: false    
  },
  phone: {
    type: String,
    required: false    
  },
  goolge_map: {
    type: String,
    required: false    
  },
  rating: {
    type: String,
    required: false    
  },
  description: {
    type: String,
    required: false    
  },
})

module.exports = mongoose.model('Restaurant', restaurantSchema)
