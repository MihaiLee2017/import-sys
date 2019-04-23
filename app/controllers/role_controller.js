
const Roles = require('../../dbs/models/roles')
const Passport = require('../../utils/passport')
const Redis = require('koa-redis')
//获取用户
exports.getRoleList = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        try {
            let roleList = await Roles.find({})
            ctx.body = {
                data: {
                    roleList
                }
            }
        } catch (err) {
            throw err
        }
    } else {
        throw {
            message: '请登录'
        }
    }
}



// 添加
exports.addRole = async (ctx, next) => {
    if (ctx.isAuthenticated()) {
        const { key, role } = ctx.request.body
        console.log(ctx.request.body)
        try {
            let result = await Roles.create({ key, role })
            ctx.body = {
                data: {
                    result
                }
            }
        } catch (err) {
            throw err
        }
    } else {
        throw {
            message: '请登录'
        }
    }
}

// 删除
exports.delRole = async (ctx, next) => {
    const { id } = ctx.request.body;
    try {
        const create_date = Date.now()
        const result = await Roles.findByIdAndDelete(id)
        ctx.body = {
            data: {
                id
            }
        }
    } catch (err) {
        throw err
    }
}

// 修改
exports.editRole = async (ctx, next) => {
    const { id, key, role } = ctx.request.body;
    try {
        const create_date = Date.now()
        const result = await Roles.findByIdAndUpdate(id, { key, role, create_date })
        ctx.body = {
            data: {
                result
            }
        }
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