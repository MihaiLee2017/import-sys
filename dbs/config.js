module.exports = {
    dbs: 'mongodb://127.0.0.1:27017/excel',
    redis: {
        get host() {
            return '127.0.0.1'
        },
        get port() {
            return 6379
        }
    },
    smtp: {
        get host() {
            return 'smtp.qq.com'
        },
        get user() { }
    }
}