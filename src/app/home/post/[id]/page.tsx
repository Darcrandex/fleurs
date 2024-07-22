/**
 * @name PostDetail
 * @description
 * @author darcrand
 */

'use client'
import { postService } from '@/services/post'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button, message, Modal, Space } from 'antd'
import { useRouter } from 'next/navigation'

export default function PostDetail(props: { params: { id: string } }) {
  const id = props.params.id
  const router = useRouter()
  const queryClient = useQueryClient()
  const [messageApi] = message.useMessage()
  const [modal, contextHolder] = Modal.useModal()

  const { data } = useQuery({
    queryKey: ['post', id],
    queryFn: () => postService.getById(Number(id)),
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => postService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post'] })
      router.replace('/home/post')
    },
  })

  return (
    <>
      {contextHolder}

      <h1>PostDetail</h1>
      <h2>{data?.title}</h2>
      <p>{data?.content}</p>

      <Space>
        <Button
          onClick={() => modal.confirm({ content: '确定删除吗?', onOk: () => removeMutation.mutate(Number(id)) })}
        >
          remove
        </Button>

        <Button href={`/home/post/${id}/edit`}>edit</Button>
      </Space>
    </>
  )
}
