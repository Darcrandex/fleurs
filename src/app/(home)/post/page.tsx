/**
 * @name PostList
 * @description post list
 * @author darcrand
 */

'use client'
import { useSuspenseQuery } from '@tanstack/react-query'
import { Button, Form, Input } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import QueryString from 'qs'
import * as R from 'ramda'
import { useEffect } from 'react'

type PostListProps = {
  searchParams: {
    page?: string
    pageSize?: string
    keyword?: string
  }
}

export default function PostList(props: PostListProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['posts', props.searchParams],
    queryFn: async () => {
      console.log('queryFn', props.searchParams)
      const query = QueryString.stringify(props.searchParams, { indices: false })
      const res = await fetch(`http://localhost:3000/api/article${query ? `?${query}` : ''}`)
      const data = await res.json()
      return data
    },
  })

  useEffect(() => {
    console.log('data', data)
  }, [data])

  const router = useRouter()
  const pathname = usePathname()
  const onSubmit = async (values?: any) => {
    const params = JSON.parse(JSON.stringify(values))
    const url =
      R.isNotNil(params) && R.isNotEmpty(params) ? `${pathname}?${new URLSearchParams(params).toString()}` : pathname
    router.replace(url)
  }

  return (
    <>
      <Form layout='inline' initialValues={props.searchParams} onFinish={onSubmit}>
        <Form.Item name='keyword' label='标题'>
          <Input placeholder='keyword' allowClear maxLength={20} />
        </Form.Item>
        <Form.Item>
          <Button htmlType='submit'>查询</Button>
        </Form.Item>
      </Form>
    </>
  )
}
