// 导入express
const express = require('express')
// 导入路由
const router = express.Router()

const categoryController = require('../controllers/category')
const {justifyCoverPath}  = require("../utils/urlPath")
const  zh   = require("../utils/zh")
const mArticle = require('../model/article')
const mComment = require('../model/comment')
const  Chain  = require("../utils/opchain")

// 文章搜索
router.get('/article_search', async (req, res, next) => {

  // 参数获取
  const page = Number(req.query.page) || 1
  const state =  req.query.state
  const typeId =  req.query.typeId
  const perpage = req.query.perpage ? Number(req.query.perpage) : 6

  // 类型判断
  if (isNaN(page) || isNaN(perpage)) {
    next({ msg: '参数格式不正确' })
    return
  }
  // 数据获取
  let result = await mArticle.count({typeId, state})
    let total = result[0].total
    let totalPage = Math.ceil( total / perpage )

    console.log("total,  totalPage", totalPage)

  
  mArticle.selBref({perpage,page,state,typeId}).then(result =>{
    res.json({
      code: 200,
      msg: '查询成功',
      pages: totalPage,
      page,
      // data:  result ,
      data: (new Chain(result)).then(justifyCoverPath).then(zh).end()
    })
  }).catch(err => {
    console.log(err)
  })
})

router.post('/visit', (req, res) => {
  let id = req.body.id
  
  mArticle.visit(id).then(result =>{
    res.json({
      code: 200,
      msg: '查询成功'
    })
  }).catch(err => {
    console.log(err)
  })
})


// 获取最新
router.get('/lastest', (req, res) => {
  
  let num = 5
  let offset = 5
  mArticle.selLast(num,offset).then(result =>{
    res.json({
      code: 200,
      msg: '查询成功',
      data: (new Chain(result)).then(justifyCoverPath).then(zh).end()
      // data: justifyCoverPath(result)
    })
  }).catch(err => {
    console.log(err)
  })
})
// 评论
router.post('/post_comment', (req, res) => {
  // 参数获取
  const art_id = req.body.article_id
  const name = req.body.name
  const content = req.body.content
  if(!art_id) {
    res.send({
      msg: '文章编号 没有设置',
      code: 400
    })
    return 
  }
  if(!name) {
    res.send({
      msg: '用户名没有设置',
      code: 400
    })
    return 
  }
  if(!content) {
    res.send({
      msg: '内容没有设置',
      code: 400
    })
    return 
  }

  mComment.add({ name, content, art_id }).then(result => {
    // console.log(result)
    res.send({
      msg: '添加评论成功',
      code: 200
    })
  }).catch(err => {
    console.log(err)
    res.send({
      msg: '添加评论不成功',
      code: 400
    })
  })

})

// 获取指定文章编号的评论
router.get('/get_comments', (req, res) => {
  // 参数获取

  const art_id = req.query.article_id
  if(!art_id){
    res.send({
      msg: '缺少文章编号',
      code: 400
    })
    return
  }
  mComment.sel({art_id,m_state:"已审核"}).then(result =>{
    res.send({
      msg: '获取评论成功！',
      code: 200,
      data: result
    })
  }).catch(err=>{
    console.log(err)
    res.send({
      msg: '获取评论不成功',
      code: 400
    })
  })
})

// 分类获取
router.get('/category', categoryController.category_search)

// 访问新闻详情
router.get('/article', (req, res, _next) => {
  let { id } = req.query
  id = Number(id)
  if (isNaN(id)) {
    _next({ msg: '文章编号格式不对' })
    return
  }
  mArticle.sel({id}).then(result => {
    mArticle.visit(id)
    res.json({
      code: 200,
      data: result[0]
    })

  }).catch(err=>{
    console.log(err)
  })
})

// 获取最新的6条评论列表
router.get('/get_latest_comments', (req, res,next) => {
  let {art_id} = req.query
  mComment.rank({num:7,art_id}).then(data=>{
    res.json({
      code:200,
      msg:"获取成功",
      data
    })
  }).catch(err=>{
    next(err)
  })
})

// 阅读量排行
router.get('/rank', (req, res, _next) => {
  var {typeId} = req.query
  var num = 7 // 只取排名前7
  mArticle.rank({num,typeId}).then(data => {
    res.json({
      code: 200,
      data
    })
  }).catch(err =>{
    _next(err)
  })

  
})
// 暴露
module.exports = router
