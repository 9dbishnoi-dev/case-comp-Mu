export interface ImportRowIssue {
  row: number;
  name?: string;
  message: string;
}

export interface ImportState {
  status: "idle" | "done" | "error";
  totalRows: number;
  created: number;
  updated: number;
  skipped: ImportRowIssue[];
  errors: ImportRowIssue[];
}

export const initialImportState: ImportState = {
  status: "idle",
  totalRows: 0,
  created: 0,
  updated: 0,
  skipped: [],
  errors: [],
};
