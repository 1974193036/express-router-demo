var md5 = require('md5-node')

console.log(md5('123456')) // e10adc3949ba59abbe56e057f20f883e

console.log(md5(md5('123456'))) // 14e1b600b1fd579f47433b88e8d85291

