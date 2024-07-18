import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createUser() {
  const newUser = await prisma.user.create({
    data: {
      name: 'Elliott',
      email: 'xelliottx@example-user.com',
      image: ''
    }
  })

  return newUser
}

export async function deleteUser() {
  const user = await prisma.user.findFirst()
  if (!user) {
    return
  }
  await prisma.user.delete({
    where: {
      id: user.id
    }
  })
}

export async function getUsers() {
  const users = await prisma.user.findMany()
  return users
}
