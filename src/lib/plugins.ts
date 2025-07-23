import metadata from "../../packages/plugins/metadata.json";
import * as logger from '@lib/logger'

export async function loadPlugins() {
  const list: { name: string; entry: string }[] = (metadata as any).plugins || [];
  const loaded = [] as any[];
  for (const p of list) {
    try {
      const mod = await import(`../../packages/plugins/${p.name}/index`);
      loaded.push(mod.default?.());
    } catch (err) {
      logger.error('Failed to load plugin', p.name, err);
    }
  }
  return loaded;
}
