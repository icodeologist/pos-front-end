export type Role = "admin" | "staff";

export interface ActionItem {
  label: string;
  description: string;
  onClick: () => void;
}
