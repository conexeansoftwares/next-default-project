export interface IShortcutData {
  url: string;
  label: string;
  color: string;
};

export interface IShortcut {
  id: string;
  url: string;
  label: string;
  color: string;
};

export interface IShortcutsReturnProps {
  success: boolean;
  data: IShortcut[];
  message?: string;
}

export interface IShortcutReturnProps {
  success: boolean;
  data: IShortcut | null;
  message?: string;
}
