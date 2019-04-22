const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const Person = require('../../dbs/models/person')
const User = require('../../dbs/models/users')
const Passport = require('../../utils/passport')
const Redis = require('koa-redis')
//获取用户
exports.getUser = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        const { username, email, codeId } = ctx.session.passport.user
        ctx.body = {
            data: {
                user: {
                    username,
                    email,
                    codeId
                }
            }
        }
    } else {
        throw {
            message: '用户已登出'
        }
    }
}



// 登陆
exports.signIn = async (ctx, next) => {
    return Passport.authenticate('local', function (err, user, info, status) {
        if (err) {
            throw err
        } else {
            if (user) {
                ctx.body = {
                    message: '登陆成功',
                    data: {
                        user
                    }
                }
                return ctx.login(user)
            } else {
                throw {
                    message: info || '',
                    code: -1
                }
            }
        }
    })(ctx, next)
}

//用户注册
exports.signUp = async (ctx, next) => {
    const { username, password, email, codeId } = ctx.request.body;
    try {
        let user = await User.find({ codeId })
        if (user.length) {
            throw {
                code: -1,
                message: '用户已存在'
            }
        }
        let nuser = await User.create({ username, password, email, codeId })
        if (nuser) {
            ctx.body = {
                data: {
                    username,
                    codeId
                }
            }
        }
    } catch (err) {
        throw err
    }
}

// 批量注册
exports.importUser = async (ctx, next) => {
    const { list } = ctx.request.body;
    try {
        // let list = [{
        //     codeId: '201803113',
        //     password: '20180111',
        //     username: '20180111',
        //     email: ''
        // }, {
        //     codeId: '201801311',
        //     password: '20180111',
        //     username: '20180111',
        //     email: ''
        // }, {
        //     codeId: '201801513',
        //     password: '20180111',
        //     username: '20180111',
        //     email: ''
        // }]
        await User.insertMany(list, { ordered: false }).then(res => {
            ctx.body = {
                message: "插入成功",
                data: {
                    res
                }
            }
        }).catch(err => {
            ctx.body = {
                data: {
                    err: err
                }
            }
        })
    } catch (err) {
        throw err
    }
}

// 登出
exports.exit = async (ctx, next) => {
    await ctx.logout()
    if (!ctx.isAuthenticated()) {
        ctx.body = {
            // code: 0
        }
    } else {
        ctx.body = {
            // code: -1
        }
    }
}