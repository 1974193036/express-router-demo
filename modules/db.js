// 数据库操作
var MongoClient = require('mongodb').MongoClient
var DbUrl_Path = 'productmanage' // 数据库名称
var DbUrl = 'mongodb://localhost:27017/' + DbUrl_Path
var ObjectID = require('mongodb').ObjectID

function __connectDb(callback) {
  MongoClient.connect(DbUrl, {useNewUrlParser: true}, function (err, db) {
    if (err) {
      console.log(err)
      console.log('数据库连接失败!')
      return
    }
    callback(db)
  })
}

exports.ObjectID = ObjectID

exports.find = function (collectionName, json, callback) {
  __connectDb(function (db) {
    var dbo = db.db(DbUrl_Path)
    var result = dbo.collection(collectionName).find(json)
    result.toArray(function (err, data) {
      db.close()
      callback(err, data)
    })
  })
}

exports.insert = function (collectionName, json, callback) {
  __connectDb(function (db) {
    var dbo = db.db(DbUrl_Path)
    dbo.collection(collectionName).insertOne(json, function (err, data) {
      db.close()
      callback(err, data)
    })
  })
}

exports.update = function (collectionName, json1, json2, callback) {
  __connectDb(function (db) {
    var dbo = db.db(DbUrl_Path)
    dbo.collection(collectionName).updateOne(json1, {$set: json2}, function (err, data) {
      db.close()
      callback(err, data)
    })
  })
}

exports.deleteOne = function (collectionName, json, callback) {
  __connectDb(function (db) {
    var dbo = db.db(DbUrl_Path)
    dbo.collection(collectionName).deleteOne(json, function (err, data) {
      db.close()
      callback(err, data)
    })
  })
}

// 原始写法
// MongoClient.connect(DbUrl, {useNewUrlParser: true}, function (err, db) {
//   if (err) {
//     console.log(err)
//     console.log('数据库连接失败!')
//     return
//   }
//   var dbo = db.db('productmanage')
//   var result = dbo.collection('product').find({})
//   result.toArray(function (err, data) {
//     if (err) throw err
//     res.render('product', {
//       list: data
//     })
//     db.close()
//   })
// })