/**
 * @name Post
 * @description post list
 * @author darcrand
 */

import Link from 'next/link'

export default function Post() {
  return (
    <>
      <h1>Post</h1>

      <ol>
        <li>
          <Link href='/post/1'>post 1</Link>
        </li>
        <li>
          <Link href='/post/2'>post 2</Link>
        </li>
        <li>
          <Link href='/post/3'>post 3</Link>
        </li>
        <li>
          <Link href='/post/4'>post 4</Link>
        </li>
      </ol>
    </>
  )
}
