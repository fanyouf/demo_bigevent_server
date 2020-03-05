const {op,select,buildFields,insert,update,selectOne} = require('../utils/sqlite3op')
const dayjs = require('dayjs')
const TABLEANME = 'article'
const category = {
    /**
     * 添加文章
     * @param {*} param0 
     */
    add({title,content,coverPath,typeId,visitedNum,commentNum,author,state='草稿',date}={}) {
        let createAt = Date.now()
        // var valuesStr = buildFieldsForValue({title,createAt,content,coverPath,typeId,visitedNum,commentNum,author,state})
        // var sql = `insert into ${TABLEANME} ${valuesStr}`

        // console.log(sql)
        return insert(TABLEANME, {title,date,createAt,content,coverPath,typeId,visitedNum,commentNum,author,state})
        
    },
    /**
     * 删除文章
     * @param {*} id 
     */
    del(id){
        let sql = `delete from ${TABLEANME} where id= ${id} `
        return op(sql)
    },
    // 是否还有这个类别的文章
    isExitTypeId(typeId){
        return selectOne(`select count(id) as num from ${TABLEANME} where typeId=${typeId}`)
    },
    mod({id,title,content,coverPath,typeId,visitedNum,commentNum,author,state,date}) {
        return update(TABLEANME,{id}, {title,date,content,coverPath,typeId,visitedNum,commentNum,author,state})
    },
    /**
     * 文章搜索，可供分页
     * @param {*} param0 
     */
    sel({id,typeId,state,perpage,page} = {perpage: 6,page: 1}) {
        let start = (page-1) * perpage
        // let end = start + perpage
        let whereStr = buildFields({id,typeId,state},'and')
        // console.log(perpage,page)
        if(id) {
            return this.selById(id)
        } else {
            let sql = `select article.id,typeId,name as typeName,date, coverPath ,state,title,author from ${TABLEANME} , category where category.id=article.typeId order by date desc  limit ${perpage} offset ${start} `
            if(whereStr){
                sql = `select article.id,typeId,name as typeName,date, coverPath ,state,title,author from ${TABLEANME} , category where category.id=article.typeId and ${whereStr} order by date desc  limit ${perpage} offset ${start}`
            }
            return select(sql)
        }  
    },
    selById(id) {
        let sql = `select article.id,content,typeId,name as typeName,date, coverPath ,state,title,author,visitedNum from ${TABLEANME} , category where category.id=article.typeId and article.id=${id}`
        return select(sql)
    },
    selBref({id,typeId,state,perpage,page} = {perpage: 6,page: 1}) {
        let start = (page-1) * perpage
        // let end = start + perpage
        let whereStr = buildFields({id,typeId,state},'and')
        // console.log(perpage,page)
        if(id) {
            let sql = `select article.id,content,typeId,name as typeName,date, coverPath ,state,title,author,visitedNum,commentNum from ${TABLEANME} , category where category.id=article.typeId and article.id=${id}`
            return select(sql)
        } else {
            let sql = `select article.id,typeId,content,name as typeName,date, coverPath ,state,title,author,visitedNum,commentNum from ${TABLEANME} , category where category.id=article.typeId order by date desc  limit ${perpage} offset ${start} `
            if(whereStr){
                sql = `select article.id,typeId,content,name as typeName,date, coverPath ,state,title,author,visitedNum,commentNum from ${TABLEANME} , category where category.id=article.typeId and ${whereStr} order by date desc  limit ${perpage} offset ${start}`
            }
            return select(sql)
        }  
    },
    /**
     * 从偏移offset开始取出num条
     * @param {*} num 数量
     * @param {*} offset 偏移量
     */
    selLast(num = 5,offset=0) {
        let sql = `select article.id,content,typeId,name as typeName,date, coverPath ,state,title,author,visitedNum,commentNum from ${TABLEANME} , category where category.id=article.typeId order by date desc  limit ${num} offset ${offset} `

        return select(sql)
    },
    /**
     * 查询条件下的数量，以供分页使用
     * @param {*} param0 
     */
    count({ typeId,state }){
        let whereStr = buildFields({typeId,state},'and')
        let sql = `select count(id) as total from ${TABLEANME}`
        if(whereStr) {
            sql += ` where ${whereStr}`
        }
        return select(sql)
    },

    /**
     * 获取日新增文章
     */
    countToDay(){
        let today = dayjs().format('YYYY-MM-DD')

        let sql = `select count(id) as total from ${TABLEANME} where date = "${today}"`
        
        return select(sql)
    },
    /**
     * 获取  文章数量及类别
     */
    countStat(){
        let sql = `SELECT
            count(article.id) as value, category.name
        FROM
            category,
            article
        WHERE
        category.id = article.typeId 
        group BY article.typeId`
        return select(sql)
    },

    /**以月为单位统计 类别和访问量 */
    countVisitByMonthAndType() {
        let sql = `select mon,name,num as visitedNum from (SELECT
            typeId,count(article.visitedNum) as num, substr(date,1,7) as mon
        FROM
            article
        group BY  mon,typeId) as t  left join category on category.id = t.typeId order by mon`
        return select(sql)
    },
    /**
     * 获取本月内新增文章
     */
    countCurmonthNew(){
    // var days = dayjs().daysInMonth()
        let dateStart = dayjs().startOf('month').format('YYYY-MM-DD')
        let dateEnd = dayjs().endOf('month').format('YYYY-MM-DD')
        let sql = `SELECT
        count(article.id) as count, date
    FROM
        
        article
    where date>="${dateStart}" and date<="${dateEnd}"
    
    group BY date`
        return select(sql)
    },

    
    /**
     * 添加一次访问量
     * @param {*} id  编号
     */
    visit(id){
        let sql =`update ${TABLEANME} set visitedNum=visitedNum+1 where id=${id}`
        return op(sql)
    },
    /**
     * 按访问量来排行
     * @param {obejct} param0 
     */
    rank({num=7,typeId}={}){
        let sql = `select  id,title,visitedNum from ${TABLEANME}  order by visitedNum desc  limit ${num} offset 0 `
        if(typeId) {
            sql = `select  id,title,visitedNum from ${TABLEANME} where typeId=${typeId}  order by visitedNum desc  limit ${num} offset 0 `
        
        }
        return select(sql)
    }
    

}
module.exports = category