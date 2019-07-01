var express = require('express')
var DB = require('../../modules/db.js')

/*可使用 express.Router 类创建模块化、可挂载的路由句柄*/
var router = express.Router()

// 显示用户页面
router.get('/', function (req, res) {
  // res.send('/admin/user')
  DB.find('user', {}, function (err, data) {
    res.render('admin/user/index', {
      list: data
    })
  })
})

// 执行增加用户
router.get('/add', function (req, res) {
  res.send('/admin/user/add')
})

// 显示编辑页面
router.get('/edit', function (req, res) {
  res.send('/admin/user/edit')
})

// 执行删除操作
router.get('/delete', function (req, res) {
  res.send('/admin/user/delete')
})



/*暴露这个 router模块*/
module.exports = router