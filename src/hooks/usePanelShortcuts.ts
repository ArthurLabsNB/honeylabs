import { useHotkeys } from 'react-hotkeys-hook'

export default function usePanelShortcuts(shortcuts: { undo: string; redo: string }, undo: () => void, redo: () => void) {
  useHotkeys(shortcuts.undo, e => { e.preventDefault(); undo(); }, [undo, shortcuts.undo])
  useHotkeys(shortcuts.redo, e => { e.preventDefault(); redo(); }, [redo, shortcuts.redo])
}
