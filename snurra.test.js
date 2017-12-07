const { bus, routine } = require('./snurra')

it('can create a bus', () => {
  const app = bus()
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