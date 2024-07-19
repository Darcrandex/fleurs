/**
 * @name TopHeader
 * @description
 * @author darcrand
 */

'use client'

import { authService } from '@/services/auth'
import { useQuery } from '@tanstack/react-query'

export default function TopHeader() {
  const { data } = useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => authService.profile(),
  })

  return (
    <>
      <header className='flex border-b p-2'>
        <h1 className='text-lg font-bold'>Fleurs</h1>
        <span className='ml-auto'>{data?.nickname}</span>
      </header>
    </>
  )
}
