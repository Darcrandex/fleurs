/**
 * @name ArticleDetail
 * @description
 * @author darcrand
 */

'use client'
import { articelService } from '@/services/article'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button, Modal } from 'antd'
import { useRouter } from 'next/navigation'

export default function ArticleDetail(props: { params: { id: string } }) {
  const router = useRouter()
  const [modal, ctxHolder] = Modal.useModal()

  const { data } = useQuery({
    enabled: !!props?.params?.id,
    queryKey: ['article', props?.params?.id],
    queryFn: () => articelService.getById(Number(props?.params?.id)),
  })

  console.log('data', data)

  const removeMutation = useMutation({
    mutationFn: () => articelService.remove(Number(props?.params?.id)),
    onSuccess: () => {
      router.replace('/article')
    },
  })

  return (
    <>
      {ctxHolder}

      <h1>ArticleDetail</h1>

      <p>{data?.title}</p>

      <Button onClick={() => modal.confirm({ content: 'Are you sure?', onOk: () => removeMutation.mutate() })}>
        Remove
      </Button>
    </>
  )
}
