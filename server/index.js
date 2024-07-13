import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { fileURLToPath } from 'url'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = 3000

app.use(cors())
app.use(cookieParser())

app.use(express.static(path.join(__dirname, '../dist')))

const authToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InN1cGVyIiwiZW1haWwiOiJzdXBlckBwYXJrZGVtZWVyLm5sIiwiaWF0IjoxNzIwODk0Njk0LCJleHAiOjE3MjA4OTgyOTR9.i53W1OKplRSKhnBOUVTtC1TYl0j37chhc6mN3M3PwEs'

const addAuthToken = (req, res, next) => {
  req.headers['Authorization'] = `Bearer ${authToken}`
  next()
}

// just add a token for quick access
app.use(addAuthToken)

// function verifyToken(req, res, next) {
//   const authToken = req.cookies.Authorization

//   if (authToken) {
//     // Attach the token to the request object
//     req.authToken = authToken
//     next()
//   } else {
//     res.status(401).send('Unauthorized')
//   }
// }

// function redirectTest(req, res, next) {
//   if (req.cookies.someCookie) {
//     res.redirect('/')
//   }
// }

// ! important
// Example of using the middleware to protect a route
// we can check if the authentication cookie is present in the request
// if not we should redirect the user back to login
// we should use the code 401 in the client to redirect back to login as well

// app.get('/*', redirectTest, (req, res) => {
//   // If the token is verified, you can proceed with the protected route logic
//   res.send('Protected route accessed')
// })

// function setAuthHeaderFromCookie(req, res, next) {
//   if (req.cookies.Authorization && !req.headers['authorization']) {
//     req.headers['authorization'] = `Bearer ${req.cookies.Authorization}`
//   }
//   next()
// }
// app.use(setAuthHeaderFromCookie)

app.use(
  '/v1',
  createProxyMiddleware({
    target: 'https://parkdemeer-afde952e3fef.herokuapp.com/v1',
    changeOrigin: true,
    selfHandleResponse: false, // res.end() will be called internally by responseInterceptor()
    logger: console,
    on: {
      proxyReq: (proxyReq, req) => {
        console.log('====================== incoming request ===============================')
        // proxyReq.setHeader('Authorization', `Bearer ${authToken}`)
        // console.log('what is this function ?', req.headers)
        // console.log(req.path)
        // if (req.cookies.authToken) {
        // req.headers('Authorization', `Bearer ${authToken}`)
        // }
      },
      proxyRes: (proxyRes, req, res, next) => {
        console.log('satus code ?', proxyRes.statusCode)

        // unauthorised user
        if (proxyRes.statusCode === 401) {
          console.log('unauthorised user')
          console.log('cookies', req.cookies)
          // remove auth headers
          res.clearCookie('Authorization')
          // display cookies
          console.log('cookies', req.cookies)

          res.cookie('someCookie', 1234, {
            httpOnly: true,
            secure: true, // Set 'secure' to true if using HTTPS
            sameSite: 'strict' // Recommended for CSRF protection
          })
        }
        // let parsedJson = null
        // if (req.path.includes('/auth/password') && !req.cookies.authToken) {
        //   let jsonObject = ''
        //   proxyRes.on('data', (chunk) => {
        //     jsonObject += chunk
        //   })
        //   proxyRes.on('end', () => {
        //     if (jsonObject.includes('accessToken')) {
        //       parsedJson = JSON.parse(jsonObject)
        //     }
        //   })
        // }
        // if (parsedJson && res) {
        //   res.cookie('authToken', parsedJson.data.auth.accessToken, {
        //     httpOnly: true,
        //     sameSite: true,
        //     secure: true
        //   })
        // }
        // let jsonObject = ''
        // proxyRes.on('data', (chunk) => {
        //   jsonObject += chunk
        // })
        // proxyRes.on('end', () => {
        //   console.log(JSON.parse(jsonObject))
        // })

        // return proxyRes
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err)
      res.status(500).send('Proxy error')
    }
  })
)

// Serve index.html for all other routes
app.get('*', (req, res, next) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'))
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
