var core = require('plugin-core')
var { router, middlewares } = core
var { express, bodyParser } = middlewares
var speedtest_ctrl = require('./controllers/speedtest_ctrl')

router.get('/speedtest-plugin', speedtest_ctrl.get)
router.post('/speedtest-plugin/start', express.urlencoded({ extended: true }), bodyParser.json(), speedtest_ctrl.start)

module.exports = router
