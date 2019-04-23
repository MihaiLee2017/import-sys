var router = require('koa-router')()
var role_controller = require('../../app/controllers/role_controller')
router.prefix('/role')
router.get('/getRoleList', role_controller.getRoleList)
router.post('/addRole', role_controller.addRole)
router.post('/editRole', role_controller.editRole)
router.post('/delRole', role_controller.delRole)
// router.post('/updatePerson', user_controller.updatePerson)
module.exports = router