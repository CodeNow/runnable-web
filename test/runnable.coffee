async = require 'async'
should = require 'should'
globals = require 'rendr/shared/globals'
env = require '../server/lib/env'
faker = require 'Faker'
Fetcher = require 'rendr/shared/fetcher'
adapter = require '../server/lib/data_adapter'
server = require 'rendr/server/server'

User = require '../app/models/user'
Runnable = require '../app/models/runnable'

server.dataAdapter = new adapter env.current.api
fetcher = new Fetcher { }

user = null
user2 = null

app =
  req:
    session: { }
  fetcher: fetcher

app2 =
  req:
    session: { }
  fetcher: fetcher

describe 'Runnable', () ->

  it 'should be able to create a new runnable with default framework (node.js)', (cb) ->

    cb()


before (cb) ->

  async.parallel [
    (cb) ->
      user = new User { },
        app: app
        urlRoot: '/users'
      user.save { },
        wait: true
        success: () -> cb()
        error: () -> cb new Error 'could not create a new user'
    (cb) ->
      user2 = new User { },
        app: app2
        urlRoot: '/users'
      user.save { },
        wait: true
        success: () -> cb()
        error: () -> cb new Error 'could not create a new user'
  ], cb

after (cb) ->

  async.parallel [
    (cb) ->
      user.destroy
        success: () -> cb()
        error: () -> cb new Error 'error destorying user'
    (cb) ->
      user2.destroy
        success: () -> cb()
        error: () -> cb new Error 'error destorying user'
  ], cb