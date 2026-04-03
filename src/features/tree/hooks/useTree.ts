// features/tree/hooks/useTree.ts

import { useEffect, useState } from "react";
import type { TreeNodeType } from "../types/tree.types";
import { getNodes, createNode, deleteNode } from "../services/tree.api";
import {
  addNodeOptimistic,
  addTreeUiState,
  removeNodeById,
  replaceNodeById,
  toggleNodeById,
} from "../utils/tree.helpers";

export const useTree = () => {
  const [tree, setTree] = useState<TreeNodeType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = async () => {
    setLoading(true);
    try {
      const data = await getNodes();
      setError(null);
      const withUIState = addTreeUiState(data);

      setTree(withUIState);
    } catch (error) {
      console.error("Failed to fetch tree:", error);
      setError("We couldn't load the tree. Please refresh and try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void fetchTree();
  }, []);

  const toggleNode = (id: string) => {
    setTree((prev) => toggleNodeById(prev, id));
  };

  const buildOptimisticNode = (
    name: string,
    parentId?: string,
  ): TreeNodeType => {
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    return {
      id: tempId,
      name,
      parentId,
      children: [],
      isExpanded: true,
      isPending: true,
    };
  };

  const addRootNode = async (name: string) => {
    const optimisticNode = buildOptimisticNode(name);
    setError(null);
    setTree((prev) => addNodeOptimistic(prev, optimisticNode));

    try {
      const createdNode = await createNode({ name });
      const syncedNode: TreeNodeType = {
        ...createdNode,
        children: [],
        isExpanded: true,
        isPending: false,
      };

      setTree((prev) => replaceNodeById(prev, optimisticNode.id, syncedNode));
    } catch (error) {
      setTree((prev) => removeNodeById(prev, optimisticNode.id));
      console.error("Failed to create root node:", error);
      setError("We couldn't save that root node. Your change was rolled back.");
    }
  };

  const addChildNode = async (parentId: string, name: string) => {
    const optimisticNode = buildOptimisticNode(name, parentId);
    setError(null);
    setTree((prev) => addNodeOptimistic(prev, optimisticNode));

    try {
      const createdNode = await createNode({ name, parentId });
      const syncedNode: TreeNodeType = {
        ...createdNode,
        children: [],
        isExpanded: true,
        isPending: false,
      };

      setTree((prev) => replaceNodeById(prev, optimisticNode.id, syncedNode));
    } catch (error) {
      setTree((prev) => removeNodeById(prev, optimisticNode.id));
      console.error(`Failed to create child node under parent ${parentId}:`, error);
      setError("We couldn't save that child node. Your change was rolled back.");
    }
  };

  const removeNode = async (id: string) => {
    await deleteNode(id);
    setTree((prev) => removeNodeById(prev, id));
  };

  return {
    tree,
    loading,
    error,
    fetchTree,
    toggleNode,
    addRootNode,
    addChildNode,
    removeNode,
  };
};
