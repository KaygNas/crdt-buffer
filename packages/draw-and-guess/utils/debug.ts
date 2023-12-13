export const debuglog = (...args: any) => {
  if (process.env.NODE_ENV !== 'production' || import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.info('[Debug]', ...args)
  }
}
