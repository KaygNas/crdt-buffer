import { useTurso } from '~/utils/turso'

export default defineEventHandler(async () => {
  const client = useTurso()

  const result = await client.execute(
    'select * from threads'
  )

  return {
    data: result.rows
  }
})
