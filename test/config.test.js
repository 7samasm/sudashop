import test from 'ava'
import createNuxt from './helpers/create-nuxt'

let nuxt = null

// Init nuxt.js and create server listening on localhost:4000
test.before('Init Nuxt.js', async (t) => {
  nuxt = createNuxt()
  await nuxt.listen(3000, 'localhost')
})

test('Plugin', (t) => {
  const plugins = nuxt.options.plugins
  t.is(plugins[1], '@/plugins/i18n', 'i18n plugin added to config')
  t.is(plugins[2], '@/plugins/element-ui', 'element-ui plugin added to config')
  t.is(plugins[3], '@/plugins/clipboard.client', 'clipboard plugin added to config')
  t.is(plugins[4], '@/plugins/error-handler.client', 'error handler plugin added to config')
})

test('Modules', (t) => {
  const modules = nuxt.options.modules
  t.is(modules[0], '@nuxtjs/axios', 'Axios Nuxt Module')
})

test('Middleware', async (t) => {
  const { html, redirected } = await nuxt.renderRoute('/', { req: { headers: { 'accept-language': 'zh' } } })
  t.true(html.includes('<div id="__nuxt"></div>'), 'auth plugin works 1')
  t.true(!html.includes('前端项目模板'), 'auth plugin works 2')
  t.true(redirected.path === '/login', 'auth plugin works 3')
  t.true(redirected.status === 302, 'auth plugin works')
})

// Close server and ask nuxt to stop listening to file changes
test.after('Closing server and nuxt.js', async (t) => {
  await nuxt.close()
})
