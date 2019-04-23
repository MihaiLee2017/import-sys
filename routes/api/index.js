var router = require('koa-router')();
var user_router = require('./user_router');
var role_router = require('./role_router');
router.prefix('/api')
router.use(user_router.routes(), user_router.allowedMethods());
router.use(role_router.routes(), role_router.allowedMethods());
module.exports = router;