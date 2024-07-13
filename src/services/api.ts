import * as login from './authService'
import * as sessions from './sessionService'
import * as spaces from './spacesService'

/**
 * group services under api
 * the goal is to create a façade pattern for future iterations
 * where the api implementation details might be easily swapper and replaced
 * by something else if necessary
 * */

interface API {
  loginService: typeof login
  sessionsService: typeof sessions
  spacesService: typeof spaces
}

const api: API = {
  loginService: login,
  sessionsService: sessions,
  spacesService: spaces
}

export default api
