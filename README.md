## 说明

它是大事件项目的接口服务器。

具体接口说明：https://github.com/fanyoufu/demo_bigevent_front/apidoc.md

大事件项目的前端代码地址：https://github.com/fanyoufu/demo_bigevent_front

大事件项目的前端在线预览地址：https://fanyoufu.github.io/demo_bigevent_front/web_front/index.html

## 安装依赖

切换到根目录下:

运行命令：`npm i`

如果安装速度很慢，可以修改npm镜像

```bash
# 先运行
npm config set registry http://registry.npm.taobao.org/
# 再运行
npm i
```

安装成功之后，才能进行后续操作。

## 启动

方式一： 如果是window操作，直接双击`开始.bat` 即可。

方式二：命令行

- `node app.js` 正常启动后端
- `node app.js token` 接口带token 校验



>  会占用8000 端口