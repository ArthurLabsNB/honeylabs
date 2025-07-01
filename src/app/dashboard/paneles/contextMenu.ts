export enum MenuAction {
  Copy = 'copy',
  Cut = 'cut',
  Duplicate = 'duplicate',
  Delete = 'delete',
  Rename = 'rename',
  BringFront = 'bringFront',
  SendBack = 'sendBack',
  ToggleLock = 'toggleLock',
  Color = 'color',
  Comment = 'comment',
  AssignOwner = 'assignOwner',
  History = 'history',
  Group = 'group',
  Align = 'align',
  Distribute = 'distribute',
  DuplicateMulti = 'duplicateMulti',
  ExportGroup = 'exportGroup',
  AssignGroup = 'assignGroup',
  Paste = 'paste',
  NewMarkdown = 'newMarkdown',
  ToggleGrid = 'toggleGrid',
  ChangeBg = 'changeBg',
  NewSub = 'newSub',
  SwitchSub = 'switchSub',
  Search = 'search',
  InsertTemplate = 'insertTemplate',
  SaveTemplate = 'saveTemplate',
  OpenGallery = 'openGallery',
  AddMedia = 'addMedia',
  GenerateAI = 'generateAI',
  ConfigRules = 'configRules',
  IASuggest = 'iaSuggest',
}

export interface MenuItem { label: string; action: MenuAction; value?: string }

import type { LayoutItem } from '@/hooks/usePanelSync';
import type { Subboard } from '@/hooks/useSubboards';

export function buildMenu(
  type: 'widget' | 'multi' | 'board',
  params: {
    id?: string;
    clipboard: boolean;
    layout: LayoutItem[];
    showGrid: boolean;
    subboards: Subboard[];
    activeSub: string;
  },
): MenuItem[] {
  const { id, clipboard, layout, showGrid, subboards, activeSub } = params;
  if (type === 'widget') {
    const locked = layout.find(l => l.i === id)?.locked;
    return [
      { label: 'Copiar', action: MenuAction.Copy },
      { label: 'Cortar', action: MenuAction.Cut },
      { label: 'Duplicar', action: MenuAction.Duplicate },
      { label: 'Eliminar', action: MenuAction.Delete },
      { label: 'Renombrar', action: MenuAction.Rename },
      { label: 'Traer al frente', action: MenuAction.BringFront },
      { label: 'Enviar al fondo', action: MenuAction.SendBack },
      { label: locked ? 'Desbloquear' : 'Bloquear', action: MenuAction.ToggleLock },
      { label: 'Color', action: MenuAction.Color },
      { label: 'Comentario', action: MenuAction.Comment },
      { label: 'Asignar responsable', action: MenuAction.AssignOwner },
      { label: 'Historial', action: MenuAction.History },
    ];
  }
  if (type === 'multi') {
    return [
      { label: 'Agrupar', action: MenuAction.Group },
      { label: 'Alinear', action: MenuAction.Align },
      { label: 'Distribuir', action: MenuAction.Distribute },
      { label: 'Duplicar', action: MenuAction.DuplicateMulti },
      { label: 'Exportar grupo', action: MenuAction.ExportGroup },
      { label: 'Asignar a grupo', action: MenuAction.AssignGroup },
    ];
  }
  return [
    ...(clipboard ? [{ label: 'Pegar', action: MenuAction.Paste }] : []),
    { label: 'Nuevo Markdown', action: MenuAction.NewMarkdown },
    { label: showGrid ? 'Ocultar cuadrícula' : 'Mostrar cuadrícula', action: MenuAction.ToggleGrid },
    { label: 'Cambiar fondo', action: MenuAction.ChangeBg },
    { label: 'Nueva subpizarra', action: MenuAction.NewSub },
    ...subboards
      .filter(b => b.id !== activeSub)
      .map(b => ({ label: `Cambiar a ${b.nombre}`, action: MenuAction.SwitchSub, value: b.id })),
    { label: 'Buscar elemento', action: MenuAction.Search },
    { label: 'Insertar plantilla', action: MenuAction.InsertTemplate },
    { label: 'Guardar plantilla', action: MenuAction.SaveTemplate },
    { label: 'Abrir galería', action: MenuAction.OpenGallery },
    { label: 'Agregar media', action: MenuAction.AddMedia },
    { label: 'Generar diagrama IA', action: MenuAction.GenerateAI },
    { label: 'Configurar reglas', action: MenuAction.ConfigRules },
    { label: 'Sugerencia IA', action: MenuAction.IASuggest },
  ];
}
