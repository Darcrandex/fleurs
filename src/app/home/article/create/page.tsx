/**
 * @name ArticleCreate
 * @description
 * @author darcrand
 */

'use client'
import { articelService } from '@/services/article'
import { ossService } from '@/services/oss'
import { tagService } from '@/services/tag'
import { getImageSize } from '@/utils/getImageSize'
import { Article } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Select, Space, Spin, message } from 'antd'
import Decimal from 'decimal.js'
import { useRouter } from 'next/navigation'
import { KeyboardEventHandler, useRef, useState } from 'react'

export default function ArticleCreate() {
  const [form] = Form.useForm()
  const router = useRouter()
  const elRef = useRef<HTMLInputElement>(null)

  const { data: tagOptions } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.all(),
  })

  const createMutation = useMutation({
    mutationFn: async (values: Pick<Article, 'title' | 'content'> & { file?: File; tags?: string[] }) => {
      if (!values.file) throw new Error('cover is required')

      const imgSize = await getImageSize(values.file)
      const { url: coverUrl } = await ossService.upload(values.file)

      await articelService.create({
        title: values.title,
        content: values.content,
        coverUrl,
        coverWidth: imgSize.width,
        coverHeight: imgSize.height,
        aspectRatio: new Decimal(imgSize.aspectRatio),
        tags: values.tags,
      })
    },
    onError(error) {
      console.log('error', error)
    },
    onSuccess(data) {
      console.log('data', data)
      router.replace('/article')
    },
  })

  const onSubmit = async (values: any) => {
    console.log('values', values)
    console.log('cover file', elRef.current?.files?.[0])
    createMutation.mutate({ ...values, file: elRef.current?.files?.[0] })
  }

  return (
    <>
      <h1>ArticleCreate</h1>

      <section className='mx-auto w-[800px] max-w-full'>
        <Spin spinning={createMutation.isPending}>
          <Form form={form} layout='vertical' onFinish={onSubmit}>
            <Form.Item label='title' name='title'>
              <Input maxLength={50} allowClear />
            </Form.Item>

            <Form.Item label='content' name='content'>
              <Input.TextArea maxLength={500} allowClear />
            </Form.Item>

            {/* 先不考虑重新编辑的情况 */}
            <Form.Item label='cover'>
              <input ref={elRef} type='file' accept='image/*' />
            </Form.Item>

            <Form.Item label='Tags' name='tags'>
              <Select mode='tags' options={tagOptions} fieldNames={{ label: 'name', value: 'name' }} />
            </Form.Item>

            <Form.Item>
              <Button htmlType='submit' type='primary'>
                ok
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </section>
    </>
  )
}

function TagSelect(props: { value?: number; onChange?: (value?: number) => void }) {
  const { data: tagOptions } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.all(),
  })

  const [messageApi, contextHolder] = message.useMessage()
  const queryClient = useQueryClient()

  const addTagMutation = useMutation({
    mutationFn: async (tagName: string) => {
      await tagService.create({ name: tagName })
    },
    onSuccess() {
      messageApi.success('create tag success')
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
  })

  const [text, setText] = useState('')
  const onEnter: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && text.trim()) {
      setText('')
      addTagMutation.mutate(text)
    }
  }

  return (
    <>
      {contextHolder}

      <Space>
        <Select
          className='!w-60'
          mode='multiple'
          options={tagOptions}
          fieldNames={{ label: 'name', value: 'id' }}
          value={props.value}
          onChange={props.onChange}
          allowClear
          placeholder=''
        />

        <Input
          className='w-24'
          maxLength={20}
          placeholder='add tag'
          allowClear
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={onEnter}
        />
      </Space>
    </>
  )
}
