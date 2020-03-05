const {imageType} = require('../utils/config')
// 导入express
const express = require('express')
// 导入路由
const router = express.Router()
// 导入控制器
const adminController = require('../controllers/adminController')
// 导入bodyParser中间件
const bodyParser = require('body-parser')
// 导入multer中间件
const multer = require('multer')
const upload = multer({ dest: 'uploads/articles/' })
const uploadUser = multer({ 
    // dest: 'uploads/' ,
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname+Date.now()+'.png')
        }
    }),
    fileFilter: function (req, file, cb) {
        // 这个函数应该调用 `cb` 用boolean值来
        // 指示是否应接受该文件
        // console.log('------fileFilter---------------')
        // console.log(file)
        if(!imageType.includes(file.mimetype)){
            cb(new Error('图片格式不对'))
        }
        cb(null, true)
    },
    limits: {
        // 图片大小是1M
        fileSize: 1024 * 1204 
    }
}).single('cover')

const uploadImage = multer({ dest: 'uploads/img' })
// 注册body-parser中间件
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

// 登录
router.post('/login', adminController.login)

// 登出
router.post('/logout', adminController.logout)

router.post('/edituser',function(req,res,next){
    uploadUser(req,res,err=>{
        if(err) {
            console.log(err)
            res.json({
                code: 400,
                msg: '图像格式不对'
            })
        } else {
            next()
        }
    })
},adminController.userEdit)

// 获取用户信息
router.get('/getuser', adminController.getuser)


// 统计：本月内新增文章数
router.get('/article_count_month', adminController.article_count_curmonth_new)
// 统计：文章类型分类汇总
router.get('/article_category_count', adminController.article_countStat)
// 统计：月文章访问量
router.get('/article_count_VisitByMonthAndType', adminController.article_count_VisitByMonthAndType)

// 统计：文章当日新增
router.get('/article_count_today', adminController.article_num_today)
// 统计：文章总计
router.get('/article_count', adminController.article_num_total)

// 统计：评论总计
router.get('/comment_count', adminController.comment_num_total)

// 统计：当日新增
router.get('/comment_countToDay', adminController.comment_countToDay)


// 文章搜索
router.get('/article_sel', adminController.article_search)
// 文章发布
router.post('/article_add', upload.single('cover'), adminController.article_publish)
// 文章修改
router.post('/article_mod', upload.single('cover'), adminController.article_edit)
// 文章删除
router.post('/article_del', adminController.article_delete)
// 文章修改状态
router.post('/article_modstate', adminController.article_modstate)


router.post('/submit_image', uploadImage.single('file'), function(req, res) {
    // console.log(req.file)
    res.json({ url: '/static/' + req.file })
})

// 分类获取
router.get('/category_sel', adminController.category_search)
// 分类新增
router.post('/category_add', adminController.category_add)
// 分类编辑
router.post('/category_mod', adminController.category_edit)
// 分类删除
router.post('/category_del', adminController.category_delete)

// 文章评论搜索
router.get('/comment_sel', adminController.comment_search)
// 评论审核通过
router.post('/comment_mod', adminController.comment_mod )
// 删除评论
router.post('/comment_del', adminController.comment_delete)

// 暴露
module.exports = router
