const routine = (isPure, name) => {
  const api = {
    name,
    isPure,
    handlers: {},
    started: handler => {
      api.handlers.started = handler
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
          return api.request(
            intent.$request.name,
            intent.$request.payload
          )
        } else {
          const value = valueOrIntent
          return Promise.resolve(value)
        }
      }
    }
    return api
  },
  routine: pureRoutine,
  request: (name, payload) => ({
    $request: { name, payload }
  })
}