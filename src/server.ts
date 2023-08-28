import { app } from './app'

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`🚀 HTTP server running on port http://localhost:${PORT}`)
})
