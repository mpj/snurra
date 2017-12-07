// usage example
const { bus, routine, request, state, spec } = require('snurra')
const fetch = require('node-fetch')
const app = bus()
app.install(
  routine('capitalize')
    .started(str => request('fetch',
      { url: 'http://capitalizeapi.com/?str=' + str, parseAs: 'text' })),

  routine.impure('fetch').started(({ url, parseFunc }) =>
    fetch(url).then(response => response[opts.parseAs]()))
)
app.request('capitalize')
  .then(result => console.log(result)) // 'WORLD'

const given = spec(hello)
it('uses dumb capitalizeapi.com to capitalize', () => given
  .start('capitalize', 'hej')
  .expect(request('fetch',
    { url: 'http://capitalizeapi.com/?str=hej', parseAs: 'text' })))


/*

module.exports = routine('user')
  .start(id => request('friends', id))
  .then(friends => state({ friends }).request('avatar'))
    // shorthand for handling all responses from previous handler
  .after('avatar', (avatar, { friends }) => ({ friends, avatar }))

const given = spec(require('./user'))

const someFriends = [ 'wayne', 'tanya', 'john']
const someUrl = 'http://mycdn.com/profile123.png'

given
  .start({ id: 5 })
  .expect(request('friends', 5))

given
  .response('friends', someFriends)
  .expect(
    state({ friends: someFriends }).request('avatar'))

given
  .response('avatar', someUrl)
  .state({ friends: someFriends, avatar: someUrl })*/


  // new file here
const hello = greeting => capitalize(greeting)
const capitalize = str =>
  fetch('https://makeituppercase.com/?str='+str)
    .then(response => response.text())
hello('greeting').then(result => console.log(result)) // 'WORLD'