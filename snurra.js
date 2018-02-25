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
    const installedRoutines = {}
    const api = {
      install: (...routines) => {
        routines.forEach(routine =>
          installedRoutines[routine.name] =
            routine
        )
      },
      request: (name, payload) => {
        const routine = installedRoutines[name]
        const valueOrIntent = routine.handlers.started(payload)
        if (valueOrIntent.$request) {
          const intent = valueOrIntent
          const responseValuePromise = api.request(
            intent.$request.name,
            intent.$request.payload
          )
          return responseValuePromise
            .then(installedRoutines.hello.handlers.after[intent.$request.name])
        } else {
          const value = valueOrIntent
          if (value instanceof Promise && routine.isPure) {
            return Promise.reject(
              new Error('Handler of impure routine is not allowed to return promises')
            )
          }
          return Promise.resolve(value)
        }
      },
    }
    return api
  },
  routine: pureRoutine,
  request: (name, payload) => ({
    $request: { name, payload }
  })
}