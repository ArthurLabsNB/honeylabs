import { jsonOrNull } from './http'
import { apiFetch } from './api'

export default function swrFetcher(url: string) {
  return apiFetch(url).then(jsonOrNull)
}
