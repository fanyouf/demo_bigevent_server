const path = require('path')

const fs = require('fs')
const {justifyCoverPath} = require("../utils/urlPath")
const mArticle = require("../model/article")
module.exports = {
  /**
   * 文章搜索
   * @param {*} req 
   * @param {*} res 
   */
  async article_search (req, res) {
    // 获取提交的数据
    // const key = req.query.key || ''
    const typeId = req.query.typeId || ''
    const state = req.query.state || ''
    const page = parseInt(req.query.page || 1)
    const perpage = parseInt(req.query.perpage || 6)
    const id = req.query.id
    if (id) {
      mArticle.sel({id}).then(result=> {
        console.log("搜索",id)
        res.json( {
          msg: '搜索成功',
          code: 200,
          data: justifyCoverPath(result[0])
        })
        return
      }).catch(err=>{
        console.log(err)
      })
      return 
    }
    
    let result = await mArticle.count({typeId, state})
    let total = result[0].total
    let totalPage = Math.ceil( total / perpage )
    if(page > totalPage){
      res.json( {
        msg: '当前搜索的页码超过了最大的页码',
        code: 400
      })
      return
    }
    console.log("total,  totalPage", totalPage)
    
    mArticle.sel({typeId, state,page, perpage}).then(result=> {
      // console.log("搜索",result)
      res.json( {
        msg: '搜索成功',
        code: 200,
        data: justifyCoverPath(result),
        totalPage:totalPage 
      })
      return
    }).catch(err=>{
      console.log(err)
    })
  },
  // 文章发布
  article_publish (req, res) {
    // 获取数据
    const title = req.body.title || ''
    const typeId = req.body.typeId || 0
    const date = req.body.date
    const content = req.body.content || ''
    const state = req.body.state || '草稿'
    let cover
    // 允许的图片类型
    if (!req.file) {
      res.send({
        msg: '封面不能为空哦',
        code: 400
      })
      return
    } else if (req.file.size > 1024 * 1024 * 5 || ['image/gif', 'image/jfif', 'image/png', 'image/jpeg', 'image/webp'].indexOf(req.file.mimetype) == -1) {
      res.send({
        msg: '文件大小或类型不对，请检查',
        code: 400
      })
      fs.unlinkSync(path.join(__dirname, '../', req.file.path))
      return
    }
    // 标题判断
    if (!title) {
      res.send({
        msg: '标题不能为空哦',
        code: 400
      })
      return
    }
    // 标题判断
    if (!typeId) {
      res.send({
        msg: '类型不能为空哦',
        code: 400
      })
      return
    }
    // 设置封面
    cover = `/static/articles/${req.file.filename}`
    // 获取文章
    mArticle.add( {
      title,
      content,
      coverPath:cover,
      visitedNum:0,
      commentNum:0,
      typeId,
      date,
      author: '管理员',
      state
    } ).then( result => {
      res.send({
        msg: '发布成功',
        code: 201
      })
    }).catch(err => {
      console.log(err)
      res.send({
        msg: '发布失败',
        code: 400
      })
    })
  },
  // 文章修改状态
  article_modstate(req,res){
    let {id,state} = req.body
    if(!id){
      res.json({code:400,msg:"文章编号不能为空"});
      return 
    }
    if(!['已发布','草稿'].includes(state)){
      res.json({code:400,msg:"文章状态必须是已发布或者是草稿"});
      return  
    }
    mArticle.mod({id,state}).then(result => {
      res.json({
        code:200,
        msg:"编辑成功",
        data:result
      })
    })

  },
  // 文章编辑
  article_edit (req, res) {
    const id = req.body.id
    // 获取数据
    const title = req.body.title
    const typeId = req.body.typeId
    const date = req.body.date
    const content = req.body.content
    let cover

    // id不能为空
    if (!id || isNaN(id)) {
      res.send({
        msg: 'id不能为空',
        code: 400
      })
      return
    }
    // 标题判断
    if (!title) {
      res.send({
        msg: '标题不能为空哦',
        code: 400
      })
      return
    }
    // 标题判断
    if (!typeId) {
      res.send({
        msg: '类型不能为空哦',
        code: 400
      })
      return
    } 
    // 允许的图片类型
    if (req.file) {
      if (req.file.size > 1024 * 1024 || ['image/gif', 'image/png', 'image/jpeg'].indexOf(req.file.mimetype) == -1) {
        res.send({
          msg: '文件大小或类型不对，请检查',
          code: 400
        })
        fs.unlinkSync(path.join(__dirname, '../', req.file.path))
        return
      }
      cover = `/static/articles/${req.file.filename}`
    }
    // 设置封面
    // 修改文章
    mArticle.mod({ id, title, typeId, content, cover, date }).then(result=>{
      console.log(result)
      res.send({
        msg: '修改成功',
        code: 200
      })
    }).catch(err=>{
      console.log(err)
      res.send({
        msg: '修改失败，请检查参数',
        code: 400
      })
    })
  },

  // 文章删除
  article_delete (req, res,next) {
    const {id} = req.body
    // 获取id
    if (!id) {
      res.send({ msg: 'id不能为空', code: 400 })
      return
    }
    if (isNaN(id)) {
      res.send({ msg: 'id无效,请检查', code: 400 })
      return
    }

    // 删除
    mArticle.del(id).then(data=>{
      res.send({ msg: '删除成功', code: 200,data })
    }).catch(err=>{
     next(err)
    })
  },

  /**
   * 获取 日新增文章数
   * 只返回一个数值
   */
  article_num_today(req,res,next){
    mArticle.countToDay().then(data=>{
      res.send({ msg: '获取成功', code: 200,data:data[0] })
    }).catch(err=>{
     next(err)
    })
  },
  /**
   * 获取 文章总数
   */
  article_num_total(req,res,next){
    mArticle.count({}).then(data=>{
      res.send({ msg: '获取成功', code: 200,data:data[0] })
    }).catch(err=>{
     next(err)
    })
  },
  /**
   * 以月为单位统计访问量
   */
  article_count_VisitByMonthAndType(req,res,next){
    mArticle.countVisitByMonthAndType().then(data=>{
      var monthSet = new Set()
      var typeSet = new Set()
      data.forEach(item=>{
        monthSet.add(item.mon)
        typeSet.add(item.name)
      })
      var typeArr = [...typeSet]
      var monthArr = [...monthSet]

      
      var datas = typeArr.map(name => {
        var visitedNum = []
        monthArr.forEach(mon => {
    
          let d = data.find(d=>d.name==name&&d.mon==mon)
          let num = d? d.visitedNum : 0
          visitedNum.push(num)
        })
        return {
          name,
          visitedNum
        }
      })

      res.send({ msg: '获取成功', code: 200,data:{month:monthArr,data:datas} })
    }).catch(err=>{
     next(err)
    })
  },
  
  /**
   * 获取 文章统计信息
   */
  article_countStat(req,res,next) {
    mArticle.countStat().then(data=>{
      res.send({ msg: '获取成功', code: 200,data })
    }).catch(err=>{
     next(err)
    })
  },
  /**
   * 本月内新增文章数
  */
  article_count_curmonth_new(req,res,next){
    mArticle.countCurmonthNew().then(data=>{
      res.send({ msg: '获取成功', code: 200,data })
    }).catch(err=>{
     next(err)
    })
  }

}
