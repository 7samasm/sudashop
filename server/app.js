const express = require('express')
const { Nuxt, Builder } = require('nuxt')
const chalk = require('chalk')
const proxy = require('koa-proxies')
const cors  = require('cors')
require('dotenv').config()

const config = require('../nuxt.config.js')
const useMiddlewares = require('./middlewares')
const useRoutes = require('./routes')
const {connectDb} = require('./config')
const consts = require('./utils/consts')

// Start nuxt.js
async function start() {
  const host = consts.HOST
  const port = consts.PORT
  const app = express()

  // app.keys = ['hare-server']
  config.dev = !(app.env === 'production')

  const nuxt = new Nuxt(config)
  app.use(cors())
  // Build only in dev mode
  if (config.dev) {
    const devConfigs = config.development
    if (devConfigs && devConfigs.proxies) {
      for (const proxyItem of devConfigs.proxies) {
        // eslint-disable-next-line no-console
        console.log(
          `Active Proxy: path[${proxyItem.path}] target[${proxyItem.target}]`
        )
        app.use(proxy(proxyItem.path, proxyItem))
      }
    }
    await new Builder(nuxt).build()
  }

  // select sub-app (admin/api) according to host subdomain (could also be by analysing request.url);
  // separate sub-apps can be used for modularisation of a large system, for different login/access
  // rights for public/protected elements, and also for different functionality between api & web
  // pages (content negotiation, error handling, handlebars templating, etc).

  app.use(async (req, res, next) => {
    // use subdomain to determine which app to serve: www. as default, or admin. or api
    // note: could use root part of path instead of sub-domains e.g. ctx.request.url.split('/')[1]
    req.subapp = req.url.split('/')[1] // subdomain = part after first '/' of hostname
    if (req.subapp !== consts.API) {
      res.status(200)// koa defaults to 404 when it sees that status is unset
      await new Promise((resolve, reject) => {
        nuxt.render(req, res, err => err ? reject(err) : resolve())
      })
    } else {
      next()
    }
  })

  useMiddlewares(app)
  useRoutes(app)
  // centerlize errors
  app.use((error, req, res, next) => {
    console.log(error.message);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });

  //conect to db
connectDb((err,res) => {
	if (err) return console.log(err.message)
  app.listen(port, host)
})

  const _host = host === '0.0.0.0' ? 'localhost' : host
  // eslint-disable-next-line no-console
  console.log('\n' + chalk.bgHex('#009688').white(' OPEN ') + chalk.white(` http://${_host}:${port}\n`))
}

start()
