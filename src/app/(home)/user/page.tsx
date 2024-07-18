/**
 * @name UserList
 * @description
 * @author darcrand
 */

import Link from 'next/link'

export default function UserList() {
  return (
    <>
      <h1>User List</h1>

      <ol>
        <li>
          <Link href='/home/user/1'>user 1</Link>
        </li>
        <li>
          <Link href='/home/user/2'>user 2</Link>
        </li>
        <li>
          <Link href='/home/user/3'>user 3</Link>
        </li>
        <li>
          <Link href='/home/user/4'>user 4</Link>
        </li>
      </ol>
    </>
  )
}
