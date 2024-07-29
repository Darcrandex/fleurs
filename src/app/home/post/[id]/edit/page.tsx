/**
 * @name PostEdit
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
import { Button, Form, Input, Select } from 'antd'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function PostEdit(props: { params: { id: string } }) {
  const id = props.params.id
  const [form] = Form.useForm()
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: categories } = useQuery({
    queryKey: ['category', 'all'],
    queryFn: () => categoryService.all(),
  })

  const { data } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getById(Number(id)),
  })

  useEffect(() => {
    if (data) {
      form.setFieldsValue({ ...data, cover: data?.coverUrl })
    }
  }, [data, form])

  const updateMutation = useMutation({
    mutationFn: async (values: Prisma.PostUncheckedUpdateInput & { cover?: File }) => {
      if (!data) throw new Error('Post not found')

      let coverUrl = data?.coverUrl || ''
      let coverWidth = data?.coverWidth || 0
      let coverHeight = data?.coverHeight || 0
      let coverAspectRatio = data?.coverAspectRatio || 1
      let coverThumbnailURL = data?.coverThumbnailURL || ''

      if (values.cover && typeof values.cover === 'object') {
        const imgSize = await getImageSize(values.cover)
        const { url } = await ossService.upload(values.cover)
        coverUrl = url
        coverWidth = imgSize.width
        coverHeight = imgSize.height
        coverAspectRatio = imgSize.aspectRatio
        coverThumbnailURL = await compressAndEncodeImage(values.cover, COVER_THUMBNAIL_SIZE)
      }

      await postService.update(data?.id, {
        title: values.title,
        content: values.content,
        coverUrl,
        coverWidth,
        coverHeight,
        coverAspectRatio,
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

    updateMutation.mutate(values)
  }

  return (
    <>
      <h1>PostEdit</h1>

      <p>{props.params.id}</p>

      <Form form={form} layout='vertical' initialValues={{ ...data, cover: data?.coverUrl }} onFinish={onSubmit}>
        <Form.Item label='title' name='title'>
          <Input maxLength={50} allowClear />
        </Form.Item>

        <Form.Item label='content' name='content'>
          <Input.TextArea maxLength={500} allowClear />
        </Form.Item>

        <Form.Item label='cover' name='cover'>
          <ImageUpload />
        </Form.Item>

        <Form.Item label='categoryId' name='categoryId'>
          <Select options={categories?.map((item) => ({ label: item.name, value: item.id }))} />
        </Form.Item>

        <Form.Item label='Tags' name='tags'>
          <Select
            mode='tags'
            allowClear
            maxLength={10}
            maxTagTextLength={10}
            maxTagCount={Number(process.env.ARTICLE_TAG_MAX_COUNT || 5)}
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType='submit' type='primary'>
            update
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}
