const ApiError = require('../error/ApiError');
const ApiErrorNames = require('../error/ApiErrorNames');
const Person = require('../../dbs/models/person')
const User = require('../../dbs/models/users')
const Passport = require('../../utils/passport')
const Redis = require('koa-redis')
//获取用户
exports.getUser = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        console.log("ctx.session")
        const { username, email, codeId } = ctx.session.passport.user
        ctx.body = {
            data: {
                user: ctx.session.passport.user
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
        await User.insertMany(list, { ordered: false }).then(res => {
            ctx.body = {
                message: "插入成功",
                data: {
                    res
                }
            }
        }).catch(err => {
            if (err.code == 11000) {
                ctx.body = {
                    message: "插入发生错误",
                    data: {
                        errResult: err.result
                    }
                }
            } else {
                throw err
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

exports.getUserList = async (ctx, next) => {
    let { username = "", codeId = "", roleId = "", page = 1, size = 20 } = ctx.request.body
    console.log("username, codeId, roleId")
    console.log(username, codeId, roleId)
    // if (!ctx.isAuthenticated()) {
    try {
        const skip = Number(size) * (Number(page) - 1)
        let filter = {}
        // if (username) filter.username = username
        // if (codeId) filter.codeId = codeId
        // if (roleId) filter.roleId = roleId
        // const result = await User.find({ username: username.indexOf(username) > -1 }, null, { skip })
        const result = await User.find({
            $or: [  // 多字段同时匹配
                { username: { $regex: username } },
                { codeId: { $regex: codeId } },
                // { roleId: { $regex: roleId } },
            ]
        }, {
                password: 0 // 返回结果不包含密码字段
            },
            {
                sort: { create_date: -1 },// 按照 _id倒序排列
                skip: skip,
                limit: Number(size)
            })
        ctx.body = {
            data: {
                result: result
            }
        }
    } catch (err) {
        throw err
    }
    // } else {
    //     ctx.body = {
    //         // code: -1
    //     }
    // }
}