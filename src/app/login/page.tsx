/**
 * @name Login
 * @description
 * @author darcrand
 */

'use client'
import { TOKEN_STORAGE_KEY } from '@/constant/common'
import { authService } from '@/services/auth'
import { User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import CryptoJS from 'crypto-js'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [form] = Form.useForm()
  const router = useRouter()

  const { mutate, isPending } = useMutation({
    mutationFn: async (values: Pick<User, 'email' | 'password'>) => authService.login(values),

    onSuccess(data) {
      console.log('登录成功', data)
      window.localStorage.setItem(TOKEN_STORAGE_KEY, data.token)
      router.replace('/home')
    },
  })

  const onSubmit = async (values: any) => {
    console.log(values)

    const { email, password } = values
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.AES_ENCRYPT_KEY || '').toString()
    mutate({ email, password: encryptedPassword })
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

            <Button href='/sign-up'>SignUp</Button>
          </Form.Item>
        </Form>
      </section>
    </>
  )
}
