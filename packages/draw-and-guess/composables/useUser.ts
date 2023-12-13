import { useStorage } from '@vueuse/core'

import { generateRandom } from '~/utils/random'

export default function () {
  const user = useStorage('ncs-user', { id: generateRandom(128), name: null })
  return { user }
}
