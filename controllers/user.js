const path = require('path')

const jwt = require('jsonwebtoken')
const {justifyCoverPath} = require("../utils/urlPath")

const mUser = require("../model/users")
module.exports = {
  // 用户登录
  login (req, res) {
    // 数据获取
    
    const user_name = req.body.user_name || ''
    const password = req.body.password || ''
    // 类型判断
    console.log(user_name, password)
    mUser.login(user_name,password).then(userInfo=>{
      if(!userInfo){
        res.send({
          msg: '用户名或密码错误',
          code: 400
        })
        return 
      }
      if(userInfo.length === 0) {
        res.send({
          msg: '用户名或密码错误',
          code: 400
        })
        return
      }
      console.log(userInfo)
    // if (user_name === 'admin' && password === '123456') {
      const secretOrPrivateKey = 'jwt' // 这是加密的key（密钥）
      const token = jwt.sign({ user_name: userInfo.username }, secretOrPrivateKey, {
        expiresIn: 60 * 60 * 1 // 1小时过期
      })
      // res.setHeader('set-cookie', ['token=' + token]);
      res.cookie('token', token)
      res.cookie('username', user_name)
      res.send({
        msg: '登录成功',
        code: 200,
        data:userInfo

      })
    }).catch(err=> {
      res.send({
        msg: '登录失败',
        code: 500
      })
    })
  },
  // 用户登出
  logout (req, res) {
    res.send({
      msg: '登出成功',
      code: 200
    })
  },
  // 获取用户信息
  getuser (req, res) {
    const {username } = req.cookies
    mUser.getUser(username).then(result=>{
      // 获取用户信息
      res.send({
        msg: '获取成功',
        code: 200,
        data: justifyCoverPath(result[0],'user_pic')
      })
    })
  },
  // 编辑用户信息
  async userEdit(req, res) {
  
    // 获取数据
    const { username }  = req.cookies
    const {nickname,oldPassword:oldpassword,newPassword:password,email} = req.body
   
    let user_pic = req.file ?
    `/static/${req.file.filename}` :
    undefined

       let userInfo = await mUser.login(username,oldpassword)
    if(!userInfo){
      res.json({
        code:500,
        msg:"服务器错误"
      })
      return
    }
    if(!userInfo.length){
      res.json({
        code:400,
        msg:"原密码错误"
      })
      return
    }
    if (!nickname) {
      res.send({
        msg: '昵称不能为空哦',
        code: 400
      })
      return
    } 
  
    mUser.mod({username,nickname,password,user_pic,email}).then(result=>{
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
}
