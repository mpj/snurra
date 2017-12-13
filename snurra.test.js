const {
  bus,
  routine,
  request
 } = require('./snurra')

it('can create a bus', () => {
  const app = bus()
})

it('handlers can issue requests', () => {
  const app = bus()
  app.install(
    routine('hello').started(val => {
      return request('capitalize', val)
    }),
    routine('capitalize')
      .started(val => val.toUpperCase())
  )
  return app.request('hello', 'world').then(result =>
    expect(result).toBe('WORLD')
  )
})

it('can do things', () => {
  const app = bus()
  app.install(
    routine('hello').started(() =>
      'world')
  )
  return app.request('hello').then(
    result => expect(result).toBe('world')
  )
})