var express = require('express')
// var bodyParser = require('body-parser')
// var url = require('url')
// var md5 = require('md5-node')
// var fs = require('fs')
// var multiparty = require('multiparty')  // 图片上传模块  即可以获取form表单的数据 也可以实现上传图片
// var DB = require('./modules/db.js')

var app = express()

// 中间件配置 获取post数据，表单提交 application/x-www-form-urlencoded
// app.use(bodyParser.urlencoded({extended: false}))

// 中间件配置 获取post数据，json提交 application/json
// app.use(bodyParser.json())




// 保存用户信息
var session = require('express-session')
// 中间件配置  固定格式
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30 // 30分钟失效
  },
  rolling: true
}))


// 设置ejs模版引擎
app.set('view engine', 'ejs')

// 给 public 目录下面的文件提供静态资源托管
app.use(express.static('public'))
app.use('/upload', express.static('upload')) // 添加虚拟目录，http://localhost:3000/upload/images/MtFznjEkRGJA4ZfggM2Tri8B.png



/**
 * 以下为路由模块化设计
 *
 * */
var index = require('./routes/index.js')
var admin = require('./routes/admin.js')

app.use('/', index)
app.use('/admin', admin)



// 这是404 表示路由没有匹配到
app.use(function (req, res) {
  res.render('error/404')
})



// 中间件配置拦截功能，判断登录是否存在
// app.use(function (req, res, next) {
//   var pathname = url.parse(req.url).pathname
//   if (pathname === '/login' || pathname === '/doLogin') {
//     next()
//   } else {
//     if (req.session.userinfo && req.session.userinfo.username != '') {
//       /** 配置全局变量  可以在任何ejs模板里面使用 */
//       app.locals['userinfo'] = req.session.userinfo
//       next()
//     } else {
//       res.redirect('/login')
//     }
//   }
// })


// app.get('/', function (req, res) {
//   res.send('index')
// })

// 显示登录页面
// app.get('/login', function (req, res) {
//   res.render('login')
// })

// 登录接口
// app.post('/doLogin', function (req, res) {
//   var username = req.body.username
//   var password = md5(req.body.password)
//
//   // 操作数据库
//   DB.find('user', {username: username, password: password}, function (err, data) {
//     if (err) throw err
//     if (data.length > 0) {
//       console.log('登录成功')
//       // 保存用户信息
//       req.session.userinfo = data[0] // [{ username: '1974193036@qq.com', password: '加密后的123456' }]
//       res.redirect('/product')
//     } else {
//       res.send('<script>alert("登录失败");location.href="/login"</script>')
//     }
//   })
// })

// 显示商品列表页面
// app.get('/product', function (req, res) {
//   DB.find('product', {}, function (err, data) {
//     if (err) throw err
//     res.render('product', {
//       list: data
//     })
//   })
// })

// 显示增加商品的页面
// app.get('/productadd', function (req, res) {
//   res.render('productadd')
// })

// 获取表单提交的数据 以及post过来的图片
// app.post('/doProductAdd', function (req, res) {
//   //获取表单的数据 以及post过来的图片
//
//   var form = new multiparty.Form()
//
//   form.uploadDir = 'upload/images' // 上传图片保存的地址，目录必须存在
//
//   /**
//    * @fields：获取表单数据
//    * @files：图片上传成功返回的信息
//    * */
//   form.parse(req, function (err, fields, files) {
//     if (err) throw err
//     // console.log(fields)
//     // console.log(files)
//     var title = fields.title[0]
//     var price = fields.price[0]
//     var fee = fields.fee[0]
//     var description = fields.description[0]
//     var pic = files.pic[0].path // 'upload/images/I7cAElzCq93zmkmyaqZ4osT0.png'
//     // console.log(pic)
//
//     DB.insert('product', {
//       title: title,
//       price: price,
//       fee: fee,
//       description: description,
//       pic: pic
//     }, function (err, data) {
//       if (!err) {
//         // 上传成功跳转到商品列表页
//         res.redirect('/product')
//       }
//     })
//   })
// })


// 显示修改页面
// app.get('/productedit', function (req, res) {
//   var id = req.query.id // 5d156fd4677c26eb75c511cc
//   DB.find('product', {_id: new DB.ObjectID(id)}, function (err, data) {
//     if (!err) {
//       // console.log(data)
//       res.render('productedit', {
//         list: data[0]
//       })
//     }
//   })
// })

// 执行修改的路由
// app.post('/doProductEdit', function (req, res) {
//   var form = new multiparty.Form()
//
//   form.uploadDir = 'upload/images'  // 上传图片保存的地址
//
//   /**
//    * @fields：获取表单数据
//    * @files：图片上传成功返回的信息
//    * */
//   form.parse(req, function (err, fields, files) {
//
//     // 获取提交的数据以及图片上传成功返回的图片信息
//
//     // console.log(fields)
//     // console.log(files)
//
//     var _id = fields._id[0] // 5d156fd4677c26eb75c511cc
//     /*修改的条件*/
//     var title = fields.title[0]
//     var price = fields.price[0]
//     var fee = fields.fee[0]
//     var description = fields.description[0]
//
//     var originalFilename = files.pic[0].originalFilename
//     var pic = files.pic[0].path // 'upload/images/I7cAElzCq93zmkmyaqZ4osT0.png'
//
//     if (originalFilename) {  /*修改了图片*/
//       var setData = {
//         title: title,
//         price: price,
//         fee: fee,
//         description: description,
//         pic: pic
//       }
//     } else { /*没有修改图片*/
//       var setData = {
//         title: title,
//         price: price,
//         fee: fee,
//         description: description
//       }
//       // 删除生成的临时文件
//       fs.unlink(pic, function (err) {
//         if (err) throw err
//         console.log('文件删除成功！')
//       })
//     }
//     DB.update('product', {_id: new DB.ObjectID(_id)}, setData, function (err, data) {
//       if (!err) {
//         res.redirect('/product')
//       }
//     })
//   })
// })


// 执行删除的路由
// app.get('/productdelete', function (req, res) {
//   var _id = req.query.id // 5d156fd4677c26eb75c511cc
//   DB.deleteOne('product', {_id: new DB.ObjectID(_id)}, function (err, data) {
//     if (!err) {
//       res.redirect('/product')
//     }
//   })
// })


// app.get('/loginOut', function (req, res) {
//   // 销毁session
//   req.session.destroy(function (err) {
//     if (err) {
//       console.log(err)
//     } else {
//       res.redirect('/login')
//     }
//   })
// })


// 查询接口
// app.get('/search', function (req, res) {
//   var query = req.query // {title: 'iphone8'}
//   // 操作数据库
//   DB.find('product', {title: new RegExp(query.title)}, function (err, data) {
//     if (err) throw err
//     res.send({code: 1, data: data, errMsg: '查询成功'})
//   })
// })





app.listen(3004, '127.0.0.1', function () {
  console.log('Server running at http://127.0.0.1:3004/')
})