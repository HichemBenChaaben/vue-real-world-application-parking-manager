import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import axios from 'axios'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

app.use(cors())
app.use(cookieParser())
app.use(express.json())

app.use(express.static(path.join(__dirname, '../dist')))

app.use(
  '/v1',
  createProxyMiddleware({
    target: 'https://parkdemeer-afde952e3fef.herokuapp.com/v1',
    changeOrigin: true,
    selfHandleResponse: false,
    logger: console,
    on: {
      proxyReq: (proxyReq, req) => {
        proxyReq.setHeader('Authorization', `Bearer ${req.cookies['accessToken']}`)
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err)
      res.status(500).send('Proxy error')
    }
  })
)

app.post('/auth/login', (req, res) => {
  axios
    .post(`https://parkdemeer-afde952e3fef.herokuapp.com/v1/auth/password`, req.body)
    .then((response) => {
      const accessToken = response.data.data.auth.accessToken

      // important note Safari / old browsers with strict cookie policy
      // if you want to test production bundle on safari, change the cookie policy first
      // this configuration will not work for some browsers on localhost like some versions safari
      // the config is meant for the application to be deployed on a domain using https and used as a first party cookie
      res.cookie('accessToken', accessToken, { httpOnly: true, secure: true, sameSite: 'strict' })
      res.json({ data: response.data.data })
    })
    .catch((error) => {
      res
        .status(error.response.status || 500)
        .json(error.response.data || { error: 'Internal server error' })
    })
})

app.post('/auth/logout', (req, res) => {
  req.headers.authorization = ''
  res.clearCookie('accessToken')
  res.status(200).send('Logged out successfully')
})

app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
