var express = require('express')
var url = require('url')

/*可使用 express.Router 类创建模块化、可挂载的路由句柄*/
var router = express.Router()

var login = require('./admin/login.js')
var product = require('./admin/product.js')
var user = require('./admin/user.js')


// 中间件配置拦截功能，判断登录是否存在
router.use(function (req, res, next) {
  var pathname = url.parse(req.url).pathname
  if (pathname === '/login' || pathname === '/login/doLogin') {
    next()
  } else {
    if (req.session.userinfo && req.session.userinfo.username != '') {
      /** 配置全局变量  可以在任何ejs模板里面使用 */
      req.app.locals['userinfo'] = req.session.userinfo
      next()
    } else {
      res.redirect('/admin/login')
    }
  }
})




router.use('/login', login)
router.use('/product', product)
router.use('/user', user)



/*暴露这个 router模块*/
module.exports = router