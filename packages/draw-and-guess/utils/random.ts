const letterBytes = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*()_+='

export function generateRandom (length: number) : string {
  let result = ''
  const charactersLength = letterBytes.length
  let counter = 0
  while (counter < length) {
    result += letterBytes.charAt(Math.floor(Math.random() * charactersLength))
    counter += 1
  }
  return result
}
