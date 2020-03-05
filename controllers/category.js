const mCategory = require("../model/category")
const mArticle= require("../model/article")
module.exports = {
  // 分类查询
  category_search(req, res) {
    // 获取所有并返回
    mCategory.sel().then(result => {
      res.send({
        msg: '分类获取完毕',
        code: 200,
        data: result
      })
    }).catch(err=>{
      res.send({
        code:500,
        msg:err
      })
    })
  },
  // 分类新增
  category_add(req, res) {
    // 获取数据
    if (!req.body.name || !req.body.name.trim()) {
      res.send({
        msg: 'name不能为空',
        code: 400
      })
      return
    }
    if (!req.body.slug || !req.body.slug.trim()) {
      res.send({
        msg: 'slug不能为空',
        code: 400
      })
      return
    }
    // 取值
    const name = req.body.name.trim()
    const slug = req.body.slug.trim()
    mCategory.chk({name,slug}).then(result =>{
      if(result.length) {
        res.send({
          msg: '新增失败，分类名称或者别名重复',
          code: 400
        })
        return
      } else {
        mCategory.add({name,slug}).then(result => {
          console.log(result)
          res.send({
            msg: '新增成功',
            code: 200
          })
        }).catch(err=>{
          console.log(err)
          
          res.send({
            msg: '服务器错误',
            code: 500
          })
        })
      }
    })
    
  },
  // 分类编辑
  async category_edit(req, res) {
    // 获取数据
    if (!req.body.id || !req.body.id.trim() || isNaN(req.body.id)) {
      res.send({
        msg: 'id不对哦，请检查',
        code: 400
      })
    }
    // 获取数据
    if (!req.body.name || !req.body.name.trim()) {
      res.send({
        msg: 'name不能为空',
        code: 400
      })
      return
    }
    if (!req.body.slug || !req.body.slug.trim()) {
      res.send({
        msg: 'slug不能为空',
        code: 400
      })
      return
    }
    // 获取数据
    const id = req.body.id
    const name = req.body.name
    const slug = req.body.slug
    let result = await mCategory.chk({name,slug})

    if(result.length > 1) {
      res.send({
        msg: '修改失败，名称或者别名重复',
        code: 400
      })
      return
    }
    // 调用修改方法
    mCategory.mod({ id, name, slug }).then(result => {
      console.log(result)
      
      res.send({
        msg: '修改成功',
        code: 200
      })
    }).catch( err =>{
      console.log(err)
      res.send({
        msg: '修改失败,请重试',
        code: 400
      })
    })
  },

  // 分类删除
  async category_delete(req, res) {
    // 获取数据
    if (!req.body.id || !req.body.id.trim || isNaN(req.body.id)) {
      res.send({
        msg: 'id不对，请检查',
        code: 400
      })
    }
    // 获取数据
    const id = req.body.id
    
    let {num=0} = await mArticle.isExitTypeId(id) || {}
    if(num>0){
      res.send({
        msg: `不能删除此类别,还有${num}条文章`,
        code: 400
      })
      return
    }

    mCategory.del(id).then(result =>{
      console.log(result)
      res.send({
        msg: '删除成功',
        code: 200
      })
    }).catch(err =>{
      console.log(err)
      res.send({
        msg: '删除失败，系统错误',
        code: 500
      })
    })
  }
}
