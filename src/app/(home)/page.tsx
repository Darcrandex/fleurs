/**
 * @name HomePage
 * @description
 * @author darcrand
 */

import { Button, Divider, Space } from 'antd'

export default function HomePage() {
  return (
    <>
      <h1>HomePage</h1>

      <Divider />

      <Space>
        <Button>Click</Button>
        <Button type='primary'>Click 2</Button>
      </Space>
    </>
  )
}
