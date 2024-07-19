/**
 * @name SignUp
 * @description
 * @author darcrand
 */

'use client'
import { authService } from '@/services/auth'
import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import CryptoJS from 'crypto-js'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const [form] = Form.useForm()
  const router = useRouter()

  const { mutate } = useMutation({
    mutationFn: async (values: any) => {
      const { email, password, nickname } = values
      await authService.signUp({ email, password, nickname, avatar: '' })
    },
    onError(error) {
      console.log('error', error)
    },
    onSuccess(data) {
      console.log('data', data)
      router.replace('/login')
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

          <Form.Item
            name='nickname'
            label='Nickname'
            required
            rules={[{ required: true, message: 'nickname is required' }]}
          >
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
