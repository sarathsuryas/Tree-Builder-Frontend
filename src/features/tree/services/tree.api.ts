import { api } from "@/services/api.ts";
import { ENDPOINTS } from "@/services/endpoints";
import type { TreeNodeType } from "../types/tree.types";
// GET all nodes
export const getNodes = async (): Promise<TreeNodeType[]> => {
  const res = await api.get(ENDPOINTS.TREE);
  return res.data;
};

// CREATE node
export const createNode = async (data: Partial<TreeNodeType>) => {
  const res = await api.post(ENDPOINTS.TREE, data);
  return res.data;
};

// DELETE node
export const deleteNode = async (id: string) => {
  const res = await api.delete(`${ENDPOINTS.TREE}/${id}`);
  return res.data;
};
