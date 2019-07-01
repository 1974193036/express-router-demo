var express = require('express')
var bodyParser = require('body-parser')
var md5 = require('md5-node')
var DB = require('../../modules/db.js')

/*可使用 express.Router 类创建模块化、可挂载的路由句柄*/
var router = express.Router()


// 中间件配置 获取post数据，表单提交 application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({extended: false}))

// 中间件配置 获取post数据，json提交 application/json
router.use(bodyParser.json())





// 显示登录页面
router.get('/', function (req, res) {
  // res.send('/admin/login')
  res.render('admin/login')
})

// 执行登录
router.post('/doLogin', function (req, res) {
  // res.send('/admin/login/doLogin')
  var username = req.body.username
  var password = md5(req.body.password)

  // 操作数据库
  DB.find('user', {username: username, password: password}, function (err, data) {
    if (err) throw err
    if (data.length > 0) {
      console.log('登录成功')
      // 保存用户信息
      req.session.userinfo = data[0] // [{ username: '1974193036@qq.com', password: '加密后的123456' }]
      res.redirect('/admin/product')
    } else {
      res.send('<script>alert("登录失败");location.href="/login"</script>')
    }
  })
})


router.get('/loginOut', function (req, res) {
  // 销毁session
  req.session.destroy(function (err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/admin/login')
    }
  })
})



/*暴露这个 router模块*/
module.exports = router