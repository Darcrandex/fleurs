/**
 * @name HomeLayout
 * @description
 * @author darcrand
 */

import TopHeader from '@/components/TopHeader'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

const menus = [
  { href: '/home', title: 'Home' },
  { href: '/home/user', title: 'User' },
  { href: '/home/post', title: 'Post' },
  { href: '/home/category', title: 'Category' },
]

export default function HomeLayout(props: PropsWithChildren) {
  return (
    <>
      <section className='flex h-screen flex-col'>
        <TopHeader />

        <section className='flex flex-1'>
          <aside className='w-60 border-r'>
            <nav className='space-y-2'>
              {menus.map((item) => (
                <Link key={item.href} className='block' href={item.href}>
                  {item.title}
                </Link>
              ))}
            </nav>
          </aside>

          <main className='flex-1 overflow-auto'>{props.children}</main>
        </section>
      </section>
    </>
  )
}
