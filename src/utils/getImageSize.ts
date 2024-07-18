'use client'

export function getImageSize(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => {
      const image = new Image()
      image.onload = () => {
        resolve({ width: image.width, height: image.height })
      }
      image.onerror = (error) => {
        reject(error)
      }
      image.src = event.target?.result as string
    }
    reader.onerror = (error) => {
      reject(error)
    }
    reader.readAsDataURL(file)
  })
}
