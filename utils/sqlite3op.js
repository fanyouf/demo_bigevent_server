let sqlite3 = require('sqlite3').verbose()
let path =require('path')
let db = new sqlite3.Database(path.join(__dirname,'../db/db.db'))

const selectOne = function(sql){
    console.log(sql)
    return new Promise((resolve,reject) => {
        db.get(sql, function(err, rows){
            if(err){
                console.log(err)
                reject(err)
            } else {
                console.log(rows)

                resolve(rows)
            }
        })
    })
}

const select = function(sql){
    console.log(sql)
    return new Promise((resolve,reject) => {
        db.all(sql, function(err, rows){
            if(err){
                console.log(err)
                reject(err)
            } else {
                console.log(rows)

                resolve(rows)
            }
        })
    })
}

const insert  = function(tableName,obj){
    let keyArr = Object.keys(obj).filter(key => obj[key] != undefined)
    let valStr = `(${keyArr.join(',')}) values(${keyArr.map(i=>'?').join(',')})`
    return new Promise((resolve,reject) => {
        let sql = `INSERT INTO ${tableName} ${valStr}`
        let stmt = db.prepare(sql)
        console.log(sql)
        let p = keyArr.map(key => obj[key])
        let fn = (err)=>{

            if(err){
                console.log(err)
                reject(err)
            } else {
                console.log(this)

                resolve(this)
            }
        }
        p.push(fn)
        stmt.run(...p)
     
    })
   
}
const update  = function(tableName,objc,obj){
    let keyArr = Object.keys(obj).filter(key => obj[key] != undefined)
    let valStr = `${keyArr.map(key=>`${key}=?`).join(',')}`
    return new Promise((resolve,reject) => {
        let condStr = Object.keys(objc).map(it=>`${it}="${objc[it]}"`).join('and')
        let sql = `update  ${tableName} set ${valStr} where ${condStr}`
        let stmt = db.prepare(sql)
        let p = keyArr.map(key => obj[key])
        console.log('update',sql)
        console.log('参数',p)
        let fn = (err)=>{
            if(err){
                console.log(err)
                reject(err)
            } else {
                console.log(this)

                resolve()
            }
        }
        p.push(fn)
        stmt.run(...p)
     
    })
   
}


const op = function(sql){
    console.log(sql)
    return new Promise((resolve,reject) => {
        db.run(sql, function(err, rows){
            if(err){
                reject(err)
            } else {
                resolve(rows)
            }
        })
    })
}

const buildFields = function(obj,opStr) {   
    let arr = Object.keys( obj).filter(key => ( obj[key] !== undefined && obj[key] !==''))
    return arr.map( key => ` ${key}="${obj[key]}" `).join(opStr)
}
const buildFieldsForValue = function(obj) {   
    let arr = Object.keys( obj).filter(key => obj[key] !== undefined)
    let keys = arr.map( key => ` ${key} `).join(',')
    let values = arr.map( key => ` "${obj[key]}" `).join(',')

    return `(${keys} ) values (${values} )`
}

// select("select * from category").then(res=>{
//     console.log(res)
    
// })
module.exports = {
    select,
    op,
    buildFields,
    buildFieldsForValue,
    insert,
    update,
    selectOne
}
