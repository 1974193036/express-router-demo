var express = require('express')
/*引入DB数据库*/
var DB = require('../../modules/db.js')
/*图片上传模块  即可以获取form表单的数据 也可以实现上传图片*/
var multiparty = require('multiparty')
var fs = require('fs')

/*可使用 express.Router 类创建模块化、可挂载的路由句柄*/
var router = express.Router()

// 显示商品列表页面
router.get('/', function (req, res) {
  // res.send('/admin/product')
  DB.find('product', {}, function (err, data) {
    if (err) throw err
    res.render('admin/product/index', {
      list: data
    })
  })
})

// 显示新增商品页面
router.get('/add', function (req, res) {
  // res.send('/admin/product/add')
  res.render('admin/product/add')
})

// 执行新增商品
router.post('/doAdd', function (req, res) {
  // res.send('/admin/product/doAdd')

  //获取表单的数据 以及post过来的图片

  var form = new multiparty.Form()

  form.uploadDir = 'upload/images' // 上传图片保存的地址，目录必须存在

  /**
   * @fields：获取表单数据
   * @files：图片上传成功返回的信息
   * */
  form.parse(req, function (err, fields, files) {
    if (err) throw err
    // console.log(fields)
    // console.log(files)
    var title = fields.title[0]
    var price = fields.price[0]
    var fee = fields.fee[0]
    var description = fields.description[0]
    var pic = files.pic[0].path // 'upload/images/I7cAElzCq93zmkmyaqZ4osT0.png'
    // console.log(pic)

    DB.insert('product', {
      title: title,
      price: price,
      fee: fee,
      description: description,
      pic: pic
    }, function (err, data) {
      if (!err) {
        // 上传成功跳转到商品列表页
        res.redirect('/admin/product')
      }
    })
  })

})

// 显示修改商品页面
router.get('/edit', function (req, res) {
  // res.send('/admin/product/edit')
  var id = req.query.id // 5d156fd4677c26eb75c511cc
  DB.find('product', {_id: new DB.ObjectID(id)}, function (err, data) {
    if (!err) {
      res.render('admin/product/edit', {
        list: data[0]
      })
    }
  })
})

// 执行修改商品
router.post('/doEdit', function (req, res) {
  // res.send('/admin/product/doEdit')
  var form = new multiparty.Form()

  form.uploadDir = 'upload/images'  // 上传图片保存的地址

  /**
   * @fields：获取表单数据
   * @files：图片上传成功返回的信息
   * */
  form.parse(req, function (err, fields, files) {

    // 获取提交的数据以及图片上传成功返回的图片信息

    // console.log(fields)
    // console.log(files)

    var _id = fields._id[0] // 5d156fd4677c26eb75c511cc
    /*修改的条件*/
    var title = fields.title[0]
    var price = fields.price[0]
    var fee = fields.fee[0]
    var description = fields.description[0]

    var originalFilename = files.pic[0].originalFilename
    var pic = files.pic[0].path // 'upload/images/I7cAElzCq93zmkmyaqZ4osT0.png'

    if (originalFilename) {  /*修改了图片*/
      var setData = {
        title: title,
        price: price,
        fee: fee,
        description: description,
        pic: pic
      }
    } else { /*没有修改图片*/
      var setData = {
        title: title,
        price: price,
        fee: fee,
        description: description
      }
      // 删除生成的临时文件
      fs.unlink(pic, function (err) {
        if (err) throw err
        console.log('文件删除成功！')
      })
    }
    DB.update('product', {_id: new DB.ObjectID(_id)}, setData, function (err, data) {
      if (!err) {
        res.redirect('/admin/product')
      }
    })
  })
})


// 执行删除商品
router.get('/delete', function (req, res) {
  // res.send('/admin/product/delete')
  var _id = req.query.id // 5d156fd4677c26eb75c511cc
  DB.deleteOne('product', {_id: new DB.ObjectID(_id)}, function (err, data) {
    if (!err) {
      res.redirect('/admin/product')
    }
  })
})


// 执行搜索
router.get('/search', function (req, res) {
  // res.send('/admin/product/search')
  var title = req.query.title
  DB.find('product', {title: new RegExp(title)}, function (err, data) {
    if (!err) {
      res.render('admin/product/index', {
        list: data
      })
    }
  })
})

/*暴露这个 router模块*/
module.exports = router