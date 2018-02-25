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

it('rejects if handler tries to issue request to nonexisting routine', () => {
  const app = bus()
  app.install(
    routine('hello').started(() =>
      request('wishful-thinking')
    )
  )
  // TODO: improve this error message, hint about cause
  return expect(app.request('hello'))
    .rejects.toThrow('Routine "wishful-thinking" was not installed')
})

it('rejects if response handler tries to issue request to nonexisting routine', () => {
  const app = bus()
  app.install(
    routine('getuser')
      .started(() => request('getfriends'))
      .after('getfriends', () =>
        request('getavatars')),
    routine('getfriends')
      .started(() => 'x')
  )
  // TODO: improve this error message, hint about cause
  return expect(app.request('getuser'))
    .rejects.toThrow('Routine "getavatars" was not installed')
})

it('throws if routine is called with more than one argument')
it('throws if routine is installed that lacks started handler')
it('throws if routine is already installed')

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