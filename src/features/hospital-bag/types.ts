export interface BagItem {
  id: string;
  label: string;
  /** Optional short tip shown under the label. */
  note?: string;
}

export interface BagCategory {
  key: string;
  title: string;
  /** True for the must-not-forget documents group. */
  essential?: boolean;
  items: readonly BagItem[];
}
