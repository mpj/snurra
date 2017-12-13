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

it('handler of pure routine cannot return a promise')

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