'use client'

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      resolve(image)
    }
    image.onerror = (error) => {
      reject(error)
    }
    image.src = url
  })
}

function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  return canvas
}

async function resizeImage(imageUrl: string, maxWidth: number, quality: number) {
  const image = await loadImage(imageUrl)
  const canvas = createCanvas(maxWidth, maxWidth * (image.height / image.width))
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('canvas context is null')
  }

  ctx.drawImage(image, 0, 0, maxWidth, maxWidth * (image.height / image.width))

  const base64URL = canvas.toDataURL('image/jpeg', { quality })
  const arrayBuffer = await (await fetch(base64URL)).arrayBuffer()

  return { base64URL, arrayBuffer }
}

function readFileAsync(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        resolve(event.target.result)
      } else {
        reject(new Error('event.target.result is null'))
      }
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsDataURL(file)
  })
}

export async function resizeImageToData(file: File, maxWidth: number = 375, quality: number = 0.8) {
  // 读取本地文件
  const filepath = await readFileAsync(file)

  // 缩放图片到指定的宽度，高度自适应
  const { base64URL, arrayBuffer } = await resizeImage(filepath, maxWidth, quality)

  // 转成 ArrayBuffer
  return { base64URL, arrayBuffer }
}
