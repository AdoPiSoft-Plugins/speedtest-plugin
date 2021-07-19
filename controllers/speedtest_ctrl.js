'use strict'

var { promisify } = require('util')
var core = require('plugin-core')
var path = require('path')
var { admin_socket } = core
var { spawn } = require('child_process')
var request = require('request')
var httpGet = promisify(request.get)
var running = false
var e = 'terminal:output'
var servers_api_url = 'https://www.speedtest.net/api/js/servers?engine=js&limit=50&https_functional=true'

exports.get = async (req, res, next) => {
  var servers = []
  try {
    servers = JSON.parse((await httpGet(servers_api_url)).body)
  } catch (e) {}
  try {
    res.json({
      servers,
      running
    })
  } catch (e) {
    next(e)
  }
}

exports.start = async (req, res, next) => {
  var {server_id} = req.body
  try {
    running = true
    var py_exec_path = path.join(process.env.APPDIR, 'plugins', 'speedtest', 'scripts', 'speedtest.py')
    var args = [py_exec_path]
    if (server_id) {
      args.push(`--server=${server_id}`)
    }

    var { stdout, stderr } = spawn('python', args)
    stdout.on('data', d => {
      d = d || ''
      admin_socket.emitAdmin(e, d.toString())
    })

    var onEnd = (d) => {
      d = d || ''
      running = false
      admin_socket.emitAdmin(`${e}:end`)
      console.log(d.toString())
    }
    stdout.on('close', onEnd)
    stdout.on('end', onEnd)
    stdout.on('exit', onEnd)

    stderr.on('data', (d) => {
      d = d || ''
      running = false
      admin_socket.emitAdmin(`${e}:error`, d.toString())
    })

    res.json({})
  } catch (e) {
    next(e)
  }
}
