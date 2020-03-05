const {op,select,buildFields} = require('../utils/sqlite3op')
const TABLEANME="users"
const user = {
    login(name,password){
        var sql = `select username,nickname,email,user_pic from ${TABLEANME} where username="${name}" and password="${password}"`
       
        return select(sql)

    },
    getUser(name){
        var sql = `select username,nickname,email,user_pic from ${TABLEANME} where username="${name}"`
       
        return select(sql)

    },
    async mod({username,nickname,email,user_pic,password}={}) {

        let setStr = buildFields({username,nickname,email,user_pic,password})
        if(setStr){
            let sql = `update ${TABLEANME} set ${setStr} where username="${username}"`
            let rs = await op(sql)
            console.log(rs)
        }

    }
}
module.exports = user