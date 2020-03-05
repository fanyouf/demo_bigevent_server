const {op,select,buildFields} = require('../utils/sqlite3op')
const TABLEANME='comment'
const dayjs = require('dayjs')

const category = {
    add({art_id,name,content,state='未审核'}) {
        let createAt = Date.now()
        let sql = `insert into ${TABLEANME} (art_id,name,content,m_state,createAt) values("${art_id}","${name}","${content}","${state}","${createAt}")`
        return op(sql)
        
    },
    del(id){
        let sql = `delete from ${TABLEANME} where id= ${id} `
       
        return op(sql)

    },
    modState(id,state){
        let sql = `update ${TABLEANME} set m_state="${state}"  where id=${id}`
        return op(sql)
    },
    /**
     * 评论搜索，可供分页
     * @param {*} param0 
     */
    sel({art_id,m_state,perpage=6,page=1} = {perpage: 6,page: 1}) {
        let start = (page-1) * perpage
        // let end = start + perpage
        let whereStr = buildFields({art_id,m_state},'and')
        // console.log(perpage,page)
                  
        let sql = `select comment.id,art_id,title, name ,comment.content,m_state,comment.createAt from ${TABLEANME} , article where comment.art_id=article.id order by comment.createAt desc  limit ${perpage} offset ${start} `
        if(whereStr){
            sql = `select comment.id,art_id,title, name ,comment.content,m_state,comment.createAt from ${TABLEANME} , article where comment.art_id=article.id and ${whereStr}  order by comment.createAt desc  limit ${perpage} offset ${start} `
        }
        return select(sql)

    },
    /**
     * 按创建时间来排行
     * @param {obejct} param0 
     */
    rank({num=7,art_id}={}){
        let sql = `select  id,name,content from ${TABLEANME}  order by createAt desc  limit ${num} offset 0 `
        if(art_id) {
            sql = `select  id,name,content from ${TABLEANME} where art_id=${art_id}  order by createAt desc  limit ${num} offset 0 `
        
        }
        return select(sql)
    },
    /**
     * 查询条件下的数量，以供分页使用
     * @param {*} param0 
     */
    count(){
        let whereStr = buildFields({},'and')
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
        let now = dayjs().format('YYYY-MM-DD')
        let start = dayjs(now).valueOf()
        let end = dayjs(now).add(1,'day').valueOf()

        let sql = `select count(id) as total from ${TABLEANME} where createAt >= ${start} and createAt <= ${end}`
        
        return select(sql)
    },
    
}
module.exports = category