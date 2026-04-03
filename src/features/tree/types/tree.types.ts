export type TreeNodeType = {
  id: string;
  name: string;
  parentId?: string;
  children: TreeNodeType[];
  isExpanded?: boolean;
  isPending?: boolean;
};
