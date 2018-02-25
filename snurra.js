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

    function processValue(value) {
      if (value instanceof Promise && routine.isPure) {
        return Promise.reject(
          new Error('Handler of impure routine is not allowed to return promises')
        )
      }
      return Promise.resolve(value)
    }
    function processRequestIntent(intent) {
      const responseHandler = routine.handlers.after[intent.$request.name]
      const responseValuePromise = api.request(
        intent.$request.name,
        intent.$request.payload
      )
      return responseValuePromise
        .then(responseHandler)
    }
    const processHandlerResult = (valueOrIntent) =>
      valueOrIntent.$request
        ? processRequestIntent(valueOrIntent)
        : processValue(valueOrIntent)

    const api = {
      install: (...routines) => {
        routines.forEach(routine =>
          installedRoutines[routine.name] =
            routine
        )
      },

      request: (name, payload) => {
        const routine = installedRoutines[name]
        if(!routine)
          return Promise.reject(
            new Error(`Routine "${name}" was not installed`))
        return processHandlerResult(routine.handlers.started(payload))

      },
    }
    return api
  },
  routine: pureRoutine,
  request: (name, payload) => ({
    $request: { name, payload }
  })
}