
const user = require('./user')
const article = require('./article')
const category = require('./category')
const comment = require('./comment')
module.exports = {
  ...user,
  ...article,
  ...category,
  ...comment
}
