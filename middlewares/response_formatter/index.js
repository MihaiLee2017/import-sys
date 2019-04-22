var ApiError = require('../../app/error/ApiError')
// 统一返回格式
var response_formatter = (ctx, next) => {
    if (ctx.body) {
        ctx.body = {
            code: ctx.body.code || 0,
            message: ctx.body.message || "success",
            data: ctx.body.data || {}
        }
    } else {
        ctx.body = {
            message: "success",
            code: 0
        }
    }
}
// var okFn = (data, msg) => {
//     return {
//         msg,
//         data,
//         code: 0
//     }
// }
// var errFn = (msg) => {
//     return {
//         msg,
//         code: 1
//     }
// }
var url_filter = function (pattern) {
    return async function (ctx, next) {
        var reg = new RegExp(pattern)
        try {
            await next()
            if (reg.test(ctx.originalUrl)) {
                response_formatter(ctx)
            }
        } catch (error) {
            console.log(error)
            ctx.status = 200
            ctx.body = {
                code: error.code || -1,
                message: error.message || '接口错误'
            }
            throw error
            // if (error instanceof ApiError && reg.test(ctx.originalUrl)) {
            //     ctx.status = 200
            //     ctx.body = {
            //         code: error.code,
            //         message: error.message
            //     }
            // }
        }

    }
}

module.exports = url_filter