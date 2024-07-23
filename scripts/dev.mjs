import { ip } from 'address'

async function main() {
  try {
    const ipv4 = ip()
    const port = process.env.PORT || 3000
    const url = `http://${ipv4}:${port}`

    console.log(url)
  } catch (error) {
    console.error(error)
  }
}

main()
