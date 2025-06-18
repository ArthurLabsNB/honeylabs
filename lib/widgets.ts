import fs from 'node:fs'
import path from 'node:path'
import widgetsData from './widgets.json'

export interface WidgetMeta {
  key: string
  title: string
  file: string
  category?: string
  w?: number
  h?: number
  minW?: number
  minH?: number
  plans?: string[]
}

export async function getWidgets(): Promise<WidgetMeta[]> {
  const dir = path.join(process.cwd(), 'src/app/dashboard/components/widgets')
  let files: string[] = []
  try {
    files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'))
  } catch {
    return []
  }

  const set = new Set(files.map(f => path.parse(f).name))
  const result: WidgetMeta[] = []

  ;(widgetsData as WidgetMeta[]).forEach(w => {
    if (set.has(w.file)) {
      result.push(w)
      set.delete(w.file)
    }
  })

  for (const name of set) {
    const key = name.replace(/Widget$/, '').toLowerCase()
    const title = name
      .replace(/Widget$/, '')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .trim()
    result.push({
      key,
      title,
      file: name,
      w: 2,
      h: 2,
      minW: 2,
      minH: 2,
    })
  }

  return result
}
