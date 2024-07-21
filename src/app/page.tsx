/**
 * @name RootPage
 * @description
 * @author darcrand
 */

import { redirect } from 'next/navigation'

export default function RootPage() {
  return redirect('/home')
}
