'use client'

// 将原始图片进行压缩和编码
export async function compressAndEncodeImage(
  file: File,
  maxWidth: number = 375,
  quality: number = 0.9,
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        resolve(compressImage(event.target.result, maxWidth, quality))
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

async function compressImage(imageUrl: string, maxWidth: number, quality: number): Promise<string> {
  const image = await loadImage(imageUrl)
  const canvas = createCanvas(maxWidth, maxWidth * (image.height / image.width))
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('canvas context is null')
  }
  ctx.drawImage(image, 0, 0, maxWidth, maxWidth * (image.height / image.width))

  const base64 = canvas.toDataURL('image/jpeg', { quality })
  return base64
}

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
