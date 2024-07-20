/**
 * @name TopHeader
 * @description
 * @author darcrand
 */

'use client'
import { authService } from '@/services/auth'
import { useQuery } from '@tanstack/react-query'
import { Button } from 'antd'

export default function TopHeader() {
  const { data } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => authService.profile(),
  })

  return (
    <>
      <header className='flex items-center border-b p-2'>
        <h1 className='text-lg font-bold'>Fleurs</h1>

        <div className='ml-auto'>{data?.id ? <span>{data?.nickname}</span> : <Button href='/login'>Login</Button>}</div>
      </header>
    </>
  )
}
