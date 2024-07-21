/**
 * @name PostList
 * @description
 * @author darcrand
 */

'use client'
import { postService } from '@/services/post'
import { useQuery } from '@tanstack/react-query'
import { Button, Image } from 'antd'
import { useRouter } from 'next/navigation'

export default function PostList() {
  const router = useRouter()
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

      <ol className='m-4 grid grid-cols-6 gap-4 space-y-2'>
        {data?.records?.map((item) => (
          <li key={item.id} className='flex flex-col p-2'>
            <Image src={item.coverUrl} alt={item.title} />
            <p onClick={() => router.push(`/home/post/${item.id}`)}>{item.title}</p>
          </li>
        ))}
      </ol>
    </>
  )
}
