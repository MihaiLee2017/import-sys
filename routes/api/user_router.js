var router = require('koa-router')()
var user_controller = require('../../app/controllers/user_controller')
router.prefix('/users')
router.get('/getUser', user_controller.getUser)
router.get('/exit', user_controller.exit)
router.post('/signIn', user_controller.signIn)
router.post('/signUp', user_controller.signUp)
router.post('/importUser', user_controller.importUser)
router.post('/getUserList', user_controller.getUserList)
router.post('/delUser', user_controller.delUser)


// router.post('/updatePerson', user_controller.updatePerson)
module.exports = router