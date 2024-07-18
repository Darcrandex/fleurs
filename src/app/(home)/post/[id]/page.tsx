/**
 * @name PostDetail
 * @description
 * @author darcrand
 */

'use client'

import Link from 'next/link'

export default function PostDetail(props: { params: { id: string } }) {
  return (
    <>
      <h1>PostDetail {props.params.id}</h1>

      <button>
        <Link href={`/post/${props.params.id}/edit`}>edit</Link>
      </button>
    </>
  )
}
