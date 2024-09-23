export interface IShortcut {
  id: string;
  url: string;
  label: string;
  color: string;
}

export type DefaultShortcutActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

  export type GetShortcutActionResult =
  | (Omit<Extract<DefaultShortcutActionResult, { success: true }>, 'message'> & {
      data: IShortcut;
    })
  | Extract<DefaultShortcutActionResult, { success: false }>;

export type GetAllShortcutsActionResult =
  | (Omit<Extract<DefaultShortcutActionResult, { success: true }>, 'message'> & {
      data: IShortcut[];
    })
  | Extract<DefaultShortcutActionResult, { success: false }>;

