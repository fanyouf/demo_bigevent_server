const { getIPAdress } = require('./ipAdress')
let ip = getIPAdress()
ip = ip || 'localhost'
// console.log(ip);

module.exports = {
    // serverAddress:'https://autumnfish.cn/big'
    serverAddress: `http://${ip}:8000/`,
    imageType: ['image/gif', 'image/png', 'image/jpeg']
}
