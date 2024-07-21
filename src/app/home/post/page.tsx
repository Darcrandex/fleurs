/**
 * @name PostList
 * @description
 * @author darcrand
 */

'use client'

import { postService } from '@/services/post'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'
import Link from 'next/link'

export default function PostList() {
  const { data } = useQuery({
    queryKey: ['post', 'pages'],
    queryFn: () => postService.pages(),
  })

  return (
    <>
      <h1>PostList</h1>

      <header>
        <Button type='primary' href='/home/post/create'>
          Add Post
        </Button>
      </header>

      <ol className='m-4 space-y-2'>
        {data?.records?.map((item: any) => (
          <li key={item.id} className='p-2'>
            <Link href={`/home/post/${item.id}`}>{item.title}</Link>
          </li>
        ))}
      </ol>
    </>
  )
}
