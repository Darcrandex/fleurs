/**
 * @name Login
 * @description
 * @author darcrand
 */

'use client'
import { authService } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import CryptoJS from 'crypto-js'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [form] = Form.useForm()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: any) => {
      const { email, password } = values
      return await authService.login({ email, password })
    },
    onError(error) {
      console.log('error ===>', error)
    },
    onSuccess(data) {
      console.log('data', data)
      window.localStorage.setItem('token', data.token)
      router.replace('/')
    },
  })

  const onSubmit = async (values: any) => {
    console.log(values)

    const { email, password, nickname } = values
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_ENCRYPT_KEY || '').toString()
    mutate({ email, password: encryptedPassword, nickname })
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

          <Form.Item>
            <Button htmlType='submit' type='primary' loading={isPending}>
              Submit
            </Button>
          </Form.Item>
        </Form>
      </section>
    </>
  )
}
