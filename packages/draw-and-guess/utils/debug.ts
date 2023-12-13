export const debuglog = (...args: any) => {
  if (process.env.NODE_ENV !== 'production' || import.meta.env.DEV) {
    console.info('[Debug]', ...args)
  }
}
