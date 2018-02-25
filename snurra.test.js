const {
  bus,
  routine,
  request
 } = require('./snurra')

it('can handle response', () => {
  const app = bus()
  app.install(
    routine('hello')
      .started(val => request('capitalize', val))
      .after('capitalize',
        val => val.substring(0,3)),
    routine('capitalize')
      .started(val => val.toUpperCase())
  )
  return app.request('hello', 'world')
  .then(result =>
    expect(result).toBe('WOR'))
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

it('handler of impure routine can return a promise', () => {
  const app = bus()
  app.install(
    routine('hello').started(val => {
      return request('async-capitalize', val)
    }),
    routine.impure('async-capitalize')
      .started(val => Promise.resolve(val.toUpperCase()))
  )
  return app.request('hello', 'world').then(result =>
    expect(result).toBe('WORLD')
  )
})

it('handler of pure routine cannot return a promise', () => {
  const app = bus()
  app.install(
    routine('hello').started(() => {
      return new Promise(() => {})
    })
  )
  return expect(
    app.request('hello')
  ).rejects.toThrow('Handler of impure routine is not allowed to return promises')
})

it('request handler can return values', () => {
  const app = bus()
  app.install(
    routine('hello').started(() =>
      'world')
  )
  return app.request('hello').then(
    result => expect(result).toBe('world')
  )
})