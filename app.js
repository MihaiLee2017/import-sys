const Koa = require('koa')
const app = new Koa()
// const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
// const koalogger = require('koa-logger')

/**
 * 自定义中间件
 * */
// middlewares
const response_formatter = require('./middlewares/response_formatter')
// 日志
const logUtil = require('./middlewares/logger/log_util')

// router api 接口
const api = require('./routes/api')
// const index = require('./routes/index')
// const users = require('./routes/users')

// mongoose
const mongoose = require('mongoose')
const dbConfig = require('./dbs/config')

// redis 
const session = require('koa-generic-session')
const Redis = require('koa-redis')

// 登陆验证
const passport = require('./utils/passport')

// error handler
onerror(app)

// redis 
app.keys = ['excel', 'keyskeys']
app.proxy = true
app.use(session({
  key: 'excel',
  prefix: 'excel:uid',
  store: new Redis()
}))

// middlewares
app.use(bodyparser({
  enableTypes: ['json', 'form', 'text']
}))
app.use(json())
// app.use(koalogger())
app.use(require('koa-static')(__dirname + '/public'))

// app.use(views(__dirname + '/views', {
//   extension: 'pug'
// }))

// 验证登陆
app.use(passport.initialize())
app.use(passport.session())

// logger
app.use(async (ctx, next) => {
  //响应开始时间
  const start = new Date();
  //响应间隔时间
  var ms;
  try {
    //开始进入到下一个中间件
    await next();
    ms = new Date() - start;
    //记录响应日志
    logUtil.logResponse(ctx, ms);

  } catch (error) {
    ms = new Date() - start;
    //记录异常日志
    logUtil.logError(ctx, error, ms);
  }
})

// 统一返回格式
app.use(response_formatter("^/api"))

// routes
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
app.use(api.routes(), api.allowedMethods())


// 连接数据库
mongoose.connect(dbConfig.dbs, {
  useNewUrlParser: true
})

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
