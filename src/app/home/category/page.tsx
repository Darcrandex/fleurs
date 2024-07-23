/**
 * @name Category
 * @description
 * @author darcrand
 */

'use client'
import { categoryService } from '@/services/category'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { App, Button, Input, Space } from 'antd'
import { useState } from 'react'

export default function Category() {
  const queryClient = useQueryClient()
  const { message, modal } = App.useApp()

  const { data } = useQuery({
    queryKey: ['category', 'all'],
    queryFn: () => categoryService.all(),
  })

  const [text, setText] = useState('')
  const createMutation = useMutation({
    mutationFn: (name: string) => categoryService.create({ name }),
    onError: () => {
      message.error('create category error')
    },
    onSuccess: () => {
      message.success('create success')
      queryClient.invalidateQueries({ queryKey: ['category'] })
      setText('')
    },
  })

  const removeMutation = useMutation({
    mutationFn: (id: number) => categoryService.remove(id),
    onError: () => {
      message.error('remove category error')
    },
    onSuccess: () => {
      message.success('removed')
      queryClient.invalidateQueries({ queryKey: ['category'] })
    },
  })

  return (
    <>
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
          <li key={item.id} className='flex justify-between p-2'>
            <p>{item.name}</p>
            <Space>
              <Button
                onClick={() =>
                  modal.confirm({ content: 'Are you sure?', onOk: () => removeMutation.mutateAsync(item.id) })
                }
              >
                remove
              </Button>
            </Space>
          </li>
        ))}
      </ol>
    </>
  )
}
