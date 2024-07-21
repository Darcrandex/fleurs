/**
 * @name PostCreate
 * @description
 * @author darcrand
 */

'use client'
import { categoryService } from '@/services/category'
import { ossService } from '@/services/oss'
import { postService } from '@/services/post'
import { getImageSize } from '@/utils/getImageSize'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Select, Spin } from 'antd'
import { useRouter } from 'next/navigation'
import { useRef } from 'react'

export default function PostCreate() {
  const [form] = Form.useForm()
  const router = useRouter()
  const elRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ['category', 'all'],
    queryFn: () => categoryService.all(),
  })

  const createMutation = useMutation({
    mutationFn: async (values: Prisma.PostUncheckedCreateInput & { file?: File }) => {
      if (!values.file) throw new Error('cover is required')

      const imgSize = await getImageSize(values.file)
      const { url: coverUrl } = await ossService.upload(values.file)

      await postService.create({
        authorId: -1, // 一个假的 id
        title: values.title,
        content: values.content,
        coverUrl,
        coverWidth: imgSize.width,
        coverHeight: imgSize.height,
        coverAspectRatio: imgSize.aspectRatio,
        categoryId: values.categoryId,
        tags: values.tags,
      })
    },

    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['post'] })
      router.replace('/home/post')
    },
  })

  const onSubmit = async (values: any) => {
    console.log('values', values)
    console.log('cover file', elRef.current?.files?.[0])

    createMutation.mutate({ ...values, file: elRef.current?.files?.[0] })
  }

  return (
    <>
      <h1>PostCreate</h1>

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

            <Form.Item label='categoryId' name='categoryId'>
              <Select options={categories?.map((item) => ({ label: item.name, value: item.id }))} />
            </Form.Item>

            <Form.Item label='Tags' name='tags'>
              <Select mode='tags' />
            </Form.Item>

            <Form.Item>
              <Button htmlType='submit' type='primary'>
                create
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </section>
    </>
  )
}
