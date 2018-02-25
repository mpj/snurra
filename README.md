# snurra
A communication bus with a strict request/response interface, aiming to make unit testing simpler, by treating side effects as data.

## The challenge of testing functions that cause side effects
Pure functions (i.e. functions that take a value and return another value, and have no internal side effects) are great. They are painless to deal with - they are easy to reason about, easy to combine with other code, and very easy to unit test. However, side effects are part of life - a program without side effects pretty much only makes a computer warm. Is there a way to have the vast majority of your program be pure functions, even if you have lots of side-effect happening? That is what snurra aims to explore, by turning side-effects of functions into data. This is absolutely not the first exploration of this - we have things like redux-saga for example, but snurra aims to explore what the concept would look like without any of the react/redux heritage, and without making use of the generator syntax, which I never found to lend itself particularly well to this.

## Early API example
All this is super early sketch level, but this is sort of the API we are going for:

```javascript
// usage example
const { routine, request, state } = snurra
module.exports = routine('user')
  .inspect.start(id => request('friends', id)) // <- inspect will log info about start requests to web service
  .after('friends', friends => state({ friends }).request('avatar'))
  .after((avatar, { friends }) => ({ friends, avatar })) // <- can omit request name for handling all responses from previous handler.

// Comparison to closures:
module.exports = function user(id) {
  friends(id).then(friends => avatar().then(avatar => { friends, avatar }))
}

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
  .state({ friends: someFriends, avatar: someUrl })
```
