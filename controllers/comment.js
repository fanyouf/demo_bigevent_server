const path = require('path')

const mComment = require('../model/comment')
module.exports = {
  // 文章评论搜索
  async comment_search(req, res) {
    // 数据获取
    let {page=1,perpage=6} = req.query

   
    let result = await mComment.count()
    let total = result[0].total
    let totalPage = Math.ceil( total / perpage )
    if(page > totalPage){
      res.json( {
        msg: '当前搜索的页码超过了最大的页码',
        code: 400
      })
      return
    }

    // 查询数据
    mComment.sel({page}).then(data => {
      res.send({
        msg: '获取成功',
        code: 200,
        data,
        totalpage:totalPage
      })
    })
  },
  // 评论审核通过
  comment_mod(req, res) {
    let {id,m_state} = req.body
    console.log(id,m_state)
    mComment.modState(id,m_state).then(result=> {
      res.send({
        msg: '设置成功',
        code: 200,
        data:result
      })
    }).catch(err => {
      console.log(err)
      res.send({
        msg: '设置失败,请重试',
        code: 400
      })
    })
  },
  // 评论删除
  comment_delete(req, res) {
    if (db.deleteComments(req.body.id)) {
      res.send({
        msg: '删除成功',
        code: 200
      })
    } else {
      res.send({
        msg: '删除失败,请重试',
        code: 400
      })
    }
  },
  // 评论总数
  comment_num_total(req,res,next){
    mComment.count({}).then(data=>{
      res.send({ msg: '获取成功', code: 200,data:data[0] })
    }).catch(err=>{
     next(err)
    })
  },
  // 日增评论总数
  comment_countToDay(req,res,next){
    mComment.countToDay().then(data=>{
      res.send({ msg: '获取成功', code: 200,data:data[0] })
    }).catch(err=>{
     next(err)
    })
  }
}
