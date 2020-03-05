const {op,select,buildFields} = require('../utils/sqlite3op')
const TABLEANME='category'
const category = {
    add({name,slug}) {
        let createAt = Date.now()
        let sql = `insert into ${TABLEANME} (name,slug,createAt) values("${name}","${slug}","${createAt}")`
        return op(sql)
        
    },
    del(id){
        let sql =`delete from ${TABLEANME} where id= ${id} `
       
        return op(sql)

    },
    mod({id,name,slug}) {
        let modStr = buildFields({name,slug},',')
        let sql = `update ${TABLEANME} set ${modStr} where id=${id}`
        return op(sql)
    },
    sel({name,slug} = {}) {

        let whereStr = buildFields({name,slug},'and')
        let sql = `select id,name,slug,createAt from ${TABLEANME} `
        if(whereStr){
            sql += ` where ${whereStr} `
           
        }
        return select(sql)
    },
    chk({name,slug} = {}) {

        let whereStr = buildFields({name,slug},'or')
        let sql = `select id,name,slug,createAt from ${TABLEANME} `
        if(whereStr){
            sql += ` where ${whereStr} `
           
        }
        return select(sql)
    }
}
module.exports = category