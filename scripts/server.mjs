import { ip } from 'address'
import { createServer } from 'http'
import next from 'next'
import { parse } from 'url'

const dev = process.env.NODE_ENV !== 'production'
const hostname = ip()
const port = Number(process.env.PORT) || 3000
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

console.log(`> starting server...`)

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}\n`)
    })
})
