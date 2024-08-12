/**
 * @name UserCreate
 * @description
 * @author darcrand
 */

'use client'

import { Button, Form, Input } from 'antd'

export default function UserCreate() {
  const [form] = Form.useForm()

  const onSubmit = async (values: any) => {
    console.log(values)
  }

  return (
    <>
      <h1>UserCreate</h1>

      <section className='mx-auto w-[800px] max-w-full'>
        <Form layout='vertical' form={form} onFinish={onSubmit} autoComplete='off'>
          <Form.Item
            name='email'
            label='email'
            required
            rules={[{ required: true, message: 'email is required' }, { type: 'email' }]}
          >
            <Input maxLength={50} />
          </Form.Item>

          <Form.Item
            name='nickname'
            label='nickname'
            required
            rules={[{ required: true, message: 'nickname is required' }]}
          >
            <Input maxLength={50} />
          </Form.Item>

          <Form.Item>
            <Button htmlType='submit'>Submit</Button>
          </Form.Item>
        </Form>
      </section>
    </>
  )
}
