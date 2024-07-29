/**
 * @name PostCreate
 * @description
 * @author darcrand
 */

'use client'
import ImageUpload from '@/components/ImageUpload'
import { COVER_THUMBNAIL_SIZE } from '@/constant/common'
import { categoryService } from '@/services/category'
import { ossService } from '@/services/oss'
import { postService } from '@/services/post'
import { compressAndEncodeImage } from '@/utils/compressAndEncodeImage.client'
import { getImageSize } from '@/utils/getImageSize'
import { Prisma } from '@prisma/client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, Form, Input, Select, Spin } from 'antd'
import { useRouter } from 'next/navigation'

export default function PostCreate() {
  const [form] = Form.useForm()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ['category', 'all'],
    queryFn: () => categoryService.all(),
  })

  const createMutation = useMutation({
    mutationFn: async (values: Prisma.PostUncheckedCreateInput & { cover?: File }) => {
      if (!values.cover) throw new Error('cover is required')

      const imgSize = await getImageSize(values.cover)
      const { url: coverUrl } = await ossService.upload(values.cover)
      const base64URL = await compressAndEncodeImage(values.cover, COVER_THUMBNAIL_SIZE)

      await postService.create({
        title: values.title,
        content: values.content,
        coverUrl,
        coverWidth: imgSize.width,
        coverHeight: imgSize.height,
        coverAspectRatio: imgSize.aspectRatio,
        coverThumbnailURL: base64URL,
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
    console.log('create post values', values)
    createMutation.mutate(values)
  }

  return (
    <>
      <h1>PostCreate</h1>

      <section className='mx-auto w-md max-w-full'>
        <Spin spinning={createMutation.isPending}>
          <Form form={form} layout='vertical' onFinish={onSubmit}>
            <Form.Item label='title' name='title' rules={[{ required: true, message: 'title is required' }]}>
              <Input maxLength={50} allowClear />
            </Form.Item>

            <Form.Item label='content' name='content' rules={[{ required: true, message: 'content is required' }]}>
              <Input.TextArea maxLength={500} allowClear />
            </Form.Item>

            {/* 先不考虑重新编辑的情况 */}
            <Form.Item label='cover' name='cover' rules={[{ required: true, message: 'cover is required' }]}>
              <ImageUpload />
            </Form.Item>

            <Form.Item
              label='categoryId'
              name='categoryId'
              rules={[{ required: true, message: 'categoryId is required' }]}
            >
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
