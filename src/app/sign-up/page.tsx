/**
 * @name SignUp
 * @description
 * @author darcrand
 */

'use client'
import { authService } from '@/services/auth'
import { Prisma } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import CryptoJS from 'crypto-js'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [form] = Form.useForm()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { mutate } = useMutation({
    mutationFn: async (values: Prisma.UserCreateInput) => authService.signUp(values),
    onSuccess() {
      queryClient.invalidateQueries()
      router.replace('/login')
    },
  })

  const onSubmit = async (values: Prisma.UserCreateInput) => {
    console.log('用户注册', values)

    const { email, password, name } = values
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_ENCRYPT_KEY || '').toString()
    mutate({ email, password: encryptedPassword, name })
  }

  return (
    <>
      <section className='mx-auto mt-20 w-96 max-w-full rounded-lg p-6 shadow-lg'>
        <Form layout='vertical' form={form} onFinish={onSubmit}>
          <Form.Item
            name='email'
            label='Email'
            required
            rules={[{ required: true, message: 'email is required' }, { type: 'email' }]}
          >
            <Input maxLength={50} />
          </Form.Item>

          <Form.Item
            name='password'
            label='Password'
            required
            rules={[{ required: true, message: 'password is required' }]}
          >
            <Input.Password maxLength={50} />
          </Form.Item>

          <Form.Item name='name' label='Name' required rules={[{ required: true, message: 'name is required' }]}>
            <Input maxLength={50} />
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit' type='primary'>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  )
}
