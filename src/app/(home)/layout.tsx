/**
 * @name HomeLayout
 * @description
 * @author darcrand
 */

import Link from 'next/link'
import { PropsWithChildren } from 'react'

export default function HomeLayout(props: PropsWithChildren) {
  return (
    <>
      <section className='flex flex-col h-screen'>
        <header className='p-2 text-lg border-b'>Fleurs</header>

        <section className='flex-1 flex'>
          <aside className='w-60 border-r'>
            <nav className='space-y-2'>
              <Link className='block' href='/'>
                Home
              </Link>
              <Link className='block' href='/user'>
                User
              </Link>
              <Link className='block' href='/post'>
                Post
              </Link>
            </nav>
          </aside>

          <main className='flex-1'>{props.children}</main>
        </section>
      </section>
    </>
  )
}
