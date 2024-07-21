/**
 * @name Category
 * @description
 * @author darcrand
 */

'use client'

import { categoryService } from '@/services/category'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Input, message } from 'antd'
import { useState } from 'react'

export default function Category() {
  const queryClient = useQueryClient()
  const [messageApi, contextHolder] = message.useMessage()

  const { data } = useQuery({
    queryKey: ['category', 'all'],
    queryFn: () => categoryService.all(),
  })

  const [text, setText] = useState('')
  const createMutation = useMutation({
    mutationFn: (name: string) => categoryService.create({ name }),
    onError: () => {
      messageApi.error('create category error')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['category'] })
      setText('')
    },
  })

  return (
    <>
      {contextHolder}

      <h1>Category</h1>

      <div className='m-4'>
        <Input
          className='w-full'
          placeholder='type name and press enter to create'
          maxLength={50}
          value={text}
          allowClear
          onChange={(e) => setText(e.target.value)}
          onPressEnter={() => createMutation.mutate(text)}
        />
      </div>

      <ol className='m-4 space-y-2'>
        {data?.map((item: any) => (
          <li key={item.id} className='p-2'>
            <p>{item.name}</p>
          </li>
        ))}
      </ol>
    </>
  )
}
