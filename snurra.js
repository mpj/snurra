module.exports = {
  bus: () => {
    const installedRoutines = {}
    return {
      install: routine => {
        installedRoutines[routine.name] =
          routine
      },
      request: name => {
        const routine = installedRoutines[name]
        return Promise.resolve(routine.handlers.started())
      }
    }
  },
  routine: name => {
    const api = {
      name,
      handlers: {},
      started: handler => {
        api.handlers.started = handler
        return api
      }
    }
    return api
  }
}