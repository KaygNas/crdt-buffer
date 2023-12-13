const createClient = (_: {url: string, authToken: string}) => {
  return {
    execute: (_: any) => {
      return Promise.resolve({
        rows: <any[]>[{ id: '1', name: 'test' }]
      })
    }
  }
}

export const useTurso = () => {
  const config = useRuntimeConfig().TURSO

  if (!config.URL || !config.TOKEN) {
    throw new Error(
      'cannot fetch env variables'
    )
  }
  return createClient({
    url: config.URL,
    authToken: config.TOKEN
  })
}
