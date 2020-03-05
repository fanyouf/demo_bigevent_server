let urljoin = require('url-join')
let path = require('path')
const config = require(path.join(__dirname, './config'))

module.exports = {
    justifyCoverPath(obj,key='coverPath') {

        if (Array.isArray(obj)) {
            obj.forEach(item => {
                item[key] &&  (item[key] = urljoin(config.serverAddress, item[key]))
            })
        } else {
            obj && obj[key] && (obj[key] = urljoin(config.serverAddress, obj[key]))
        }

        return obj
    }
}