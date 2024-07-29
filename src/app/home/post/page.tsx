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

      <ol className='m-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'>
        {data?.records?.map((item) => (
          <li key={item.id} className='flex flex-col space-y-2 overflow-hidden rounded-md shadow'>
            <Image
              src={item.coverThumbnail}
              preview={{ src: item.coverUrl }}
              alt=''
              className='!h-48 w-full rounded-t-md object-cover'
            />

            <p className='cursor-pointer p-2' onClick={() => router.push(`/home/post/${item.id}`)}>
              {item.title}
            </p>
          </li>
        ))}
      </ol>
    </>
  )
}
