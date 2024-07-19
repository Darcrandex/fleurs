/**
 * @name ArticleList
 * @description
 * @author darcrand
 */

'use client'
import { articelService } from '@/services/article'
import { useQuery } from '@tanstack/react-query'
import { Breadcrumb, Button, Card, Col, Pagination, Row } from 'antd'
import { usePathname, useRouter } from 'next/navigation'
import QueryString from 'qs'

type ArticleListProps = {
  searchParams: {
    page?: string
    pageSize?: string
    keyword?: string
  }
}

export default function ArticleList(props: ArticleListProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { data } = useQuery({
    queryKey: ['articles', props.searchParams],
    queryFn: () => articelService.pages(props.searchParams),
  })

  const onSearchChange = (fields?: any) => {
    const params = QueryString.stringify({ ...props.searchParams, ...fields })
    const url = `${pathname}?${params}`
    router.replace(url)
  }

  return (
    <>
      <Breadcrumb items={[{ title: 'Home', href: '/' }, { title: 'Article' }]} />

      <section>
        <Button href='/article/create'>新建</Button>
      </section>

      <Row gutter={16}>
        {data?.records?.map((v) => (
          <Col key={v.id} span={8}>
            <Card
              hoverable
              style={{ width: 240 }}
              cover={<img src={v.coverUrl} alt={v.title} width={240} height={120} />}
            >
              <Card.Meta title={v.title} description={v.content} />
            </Card>
          </Col>
        ))}
      </Row>

      <Pagination hideOnSinglePage total={data?.total} onChange={(page) => onSearchChange({ page })} />
    </>
  )
}
