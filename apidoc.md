# 接口文档

https://documenter.getpostman.com/view/7729771/SWTD9d5z?version=latest

## 基地址

接口的默认基地址为 http://localhost:8000。

- localhost它表示一个特殊的ip地址，就是当前电脑的地址。
- 如果你访问的是他人电脑上的服务器，则这个localhost应该改成运行对应的那台电脑的ip地址。
- 所有接口的完整地址均需要加上这个部分，8000也不能少。



## 状态说明

| *状态码* | *含义*                | *说明*                               |
| -------- | --------------------- | ------------------------------------ |
| 200      | OK                    | 请求成功                             |
| 201      | CREATED               | 创建成功                             |
| 400      | BAD REQUEST           | 请求的地址不存在或者包含不支持的参数 |
| 401      | UNAUTHORIZED          | 未授权                               |
| 404      | NOT FOUND             | 请求的资源不存在                     |
| 500      | INTERNAL SERVER ERROR | 内部错误                             |





## 管理员-22个接口

### POST 管理员-登陆

url地址： localhost:8000/admin/login

- application/x-www-form-urlencoded

参数：

- user_name admin 用户名

- password 123456密码

> 默认用户名是admin,密码是00000

### POST 管理员-登出

url地址： localhost:8000/admin/login

application/x-www-form-urlencoded



### POST 管理员-个人信息-编辑

url地址：http://localhost:8000/admin/edituser

formdata



参数： 

- nickname 昵称可选。昵称。
- email 邮件
- cover 用户头像
- oldPassword 旧密码
- newPassword 新密码



### GET 管理员-个人信息-获取

url地址：http://localhost:8000/admin/getuser



### GET 管理员-文章类别-获取

http://localhost:8000/admin/category_sel





### POST 管理员-文章类别-增加

http://localhost:8000/admin/category_add



application/x-www-form-urlencoded



参数：

- name 类别的名称
- slug 类别的别名



### POST 管理员-文章类别-编辑

http://localhost:8000/admin/category_mod



application/x-www-form-urlencoded

参数:

- id 类别编号
- name  类别名字
- slug 类别别名

### POST 管理员-文章类别-删除

http://localhost:8000/admin/category_del

application/x-www-form-urlencoded

参数：

- id:  要删除的文章编号

### GET 管理员-文章-搜索

http://localhost:8000/admin/article_sel

参数：

- typeId 可选。文章类别编号。
- state:状态，可选。草稿或者已发布。
- page:当前查询的页数。可选。默认是第一页
- perpage:一页显示几条。可选。默认是6条。



### POST 管理员-文章-删除

http://localhost:8000/admin/article_del



application/x-www-form-urlencoded

参数：

- id：要删除的文章的编号



### POST 管理员-文章-增加

http://localhost:8000/admin/article_add

 formdata

参数：

- title： 文章标题

- content： 文章正文
- typeId ：文章类型编号
- date ：发表日期
- cover :文件，它表示文章封面
- state状态。已发布|草稿



### POST 管理员-文章-编辑

http://localhost:8000/admin/article_add



BODY formdata

参数：

- title 文章标题
- content 文章正文
- typeId 文章类型编号
- date 发表日期
- cover 文章封面
- state 状态。已发布|草稿
- id 文章编号，表示要编辑的文章



### GET 管理员-评论-获取

http://localhost:8000/admin/comment_sel

参数

page： 要查询的页码

### POST 管理员-评论-删除

http://localhost:8000/admin/article_del



application/x-www-form-urlencoded

参数：

- id 要删除的评论



### POST 管理员-评论-编辑状态

http://localhost:8000/admin/comment_mod

审核评论。只有通过审核之后的评论才能显示出来

application/x-www-form-urlencoded

参数

- id 要编辑状态的评论id

- m_state:已审核|未审核





### GET 管理员-统计-本月新增明细列表

http://localhost:8000/admin/article_count_month





### GET 管理员-统计-文章分类汇总

http://localhost:8000/admin/article_category_count



### GET 管理员-统计-评论总数量

http://localhost:8000/admin/comment_count



### GET 管理员-统计-所有文章数量

http://localhost:8000/admin/article_count

管理员-统计-所有文章数量

### GET 管理员-统计-文章-当日新增量

http://localhost:8000/admin/article_count_today



### GET 管理员-统计-评论-当日新增量

http://localhost:8000/admin/comment_countToDay





### GET 管理员-统计-每月各类别文章的总访问量

http://localhost:8000/admin/article_count_VisitByMonthAndType



## 游客- 8个接口

### GET 游客-文章类别-获取

http://localhost:8000/category



### GET 游客-文章-获取最近新闻5条

http://localhost:8000/lastest



### GET 游客-文章-搜索

http://localhost:8000/article_search

参数

- page 可选。第几页
- typeId:可选。文章类别





### GET 游客-文章-按文章访问量排行榜

http://localhost:8000/rank

参数

------

- typeId:可选。类别编号



### GET 游客-文章-获取获取指定文章详情

http://localhost:8000/article

参数

------

id:必填。文章编号



### GET 游客-评论-获取最新6条

http://localhost:8000/get_latest_comments



### POST 游客-评论-添加评论

http://localhost:8000/post_comment



参数

------

- name 游客名字

- content游客内容

- article_id 文章编号



### GET 游客-评论-获取某篇文章

http://localhost:8000/get_comments?article_id=7

参数

------

- article_id 必须，文章编号