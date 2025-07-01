import { jsonOrNull } from './http'

export default function swrFetcher(url: string) {
  return fetch(url, { credentials: 'include' }).then(jsonOrNull)
}
