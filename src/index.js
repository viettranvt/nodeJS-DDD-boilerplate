// /src/index.js

const express = require('express')
const bodyParser = require('body-parser')
const container = require('./infrastructure/config/inversify.config')

async function bootstrap() {
  const app = express()

  // Middleware
  app.use(bodyParser.json())

  // Dependency Injection
  app.use((req, res, next) => {
    req.container = container
    next()
  })

  // Routes
  const userRoute = container.get(UserRoute)
  app.use('/api/users', userRoute.router)

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something went wrong!')
  })

  // Start the server
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap the application:', error)
  process.exit(1)
})
