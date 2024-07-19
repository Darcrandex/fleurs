/**
 * @name HomeLayout
 * @description
 * @author darcrand
 */

import TopHeader from '@/components/TopHeader'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

export default function HomeLayout(props: PropsWithChildren) {
  return (
    <>
      <section className='flex h-screen flex-col'>
        <TopHeader />

        <section className='flex flex-1'>
          <aside className='w-60 border-r'>
            <nav className='space-y-2'>
              <Link className='block' href='/'>
                Home
              </Link>
              <Link className='block' href='/user'>
                User
              </Link>
              <Link className='block' href='/article'>
                Article
              </Link>
            </nav>
          </aside>

          <main className='flex-1 overflow-auto'>{props.children}</main>
        </section>
      </section>
    </>
  )
}
