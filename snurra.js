const R = require('ramda')

const pipe = (...funcs) => arg =>
  funcs.reduce((prev, cur) =>
    prev.then(x => cur(x, arg)), Promise.resolve(arg))


module.exports = pipe
const routine = (isPure, name) => {
  const api = {
    name,
    isPure,
    handlers: {
      after: {}
    },
    started: handler => {
      api.handlers.started = handler
      return api
    },
    after: (responseName, handler) => {
      api.handlers.after[responseName] = handler
      return api
    }
  }
  return api
}

const pureRoutine = routine.bind(null, true)
pureRoutine.impure = routine.bind(null, false)

module.exports = {
  bus: () => {
    const
      installedRoutines = {},

      // Takes the result from a handler function, which
      // can be an intent or a normal value, and returns a
      // promise that resolves the final value.
      handlerResultResolver = routine => R.cond([

        // Request intent
        // The most common type of intent - a request to another routine.
        [ R.has('$request'), intent =>
          makeRequest(intent.$request)
            .then(routine.handlers.after[intent.$request.name])
            .then(handlerResultResolver(routine))],

        // Value
        // When the handler returns a plain value, just wrap it in a promise
        // and return. If it is a promise, crash if the routine isn't marked
        // as impure.
        [ R.T, value => value instanceof Promise && routine.isPure
          ? Promise.reject(new Error('Handler of impure routine is not allowed to return promises'))
          : Promise.resolve(value)
        ]
      ]),

      makeRequest = pipe(
        request => installedRoutines[request.name] ||
          Promise.reject(new Error(`Routine "${request.name}" was not installed`)),
        (routine, request) =>
          handlerResultResolver(routine)(routine.handlers.started(request.payload)),
      )

      install = (...routines) =>
        routines.forEach(routine =>
          installedRoutines[routine.name] = routine)

    return {
      install,
      request: (name, payload) => makeRequest({ name, payload }),
    }
  },
  routine: pureRoutine,
  request: (name, payload) => ({
    $request: { name, payload }
  })
}