
const test = require('tape')
const pull = require('pull-stream')
const { drain } = pull
const html = require('../')
const { read } = require('pull-files')

test('bundles html', t => {
  t.plan(2)

  pull(
    html('foo.html', {
      title: 'testing',
      js: read(__dirname + '/foo.js'),
      css: read(__dirname + '/foo.css')
    }),
    drain(file => {
      t.is(file.path, 'foo.html', 'got html file')

    }, t.false)
  )
})

test('script async', t => {
  t.plan(3)

  pull(
    html('foo.html', {
      js: read(__dirname + '/foo.js'),
      scriptAsync: true
    }),
    drain(file => {
      const html = file.data.toString()
      t.assert(html.indexOf('async="true"') > -1, 'script has async attribute')
      t.assert(html.indexOf('async="true"') < html.indexOf('</head>'), 'script is before closing head tag')
    }, t.false)
  )
})

test('links', t => {
  t.plan(3)

  pull(
    html('foo.html', {
      links: [ { type: 'text/css', rel: 'stylesheet', href: 'foo.css' } ]
    }),
    drain(file => {
      const html = file.data.toString()
      t.assert(html.indexOf('<link') > -1, 'has link')
      t.assert(html.indexOf('href="foo.css"') > -1, 'points to foo.css')
    }, t.false)
  )
})

test('meta', t => {
  t.plan(3)

  pull(
    html('foo.html', {
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=0' }
      ]
    }),
    drain(file => {
      const html = file.data.toString()
      t.assert(html.indexOf('<meta') > -1, 'has a meta tag')
      t.assert(html.indexOf('name="viewport"') > -1, 'has a viewport meta')
      // console.log(html)
    }, t.false)
  )
})


