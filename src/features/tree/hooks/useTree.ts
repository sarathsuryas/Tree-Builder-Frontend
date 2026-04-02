// features/tree/hooks/useTree.ts

import { useEffect, useState } from "react";
import type { TreeNodeType } from "../types/tree.types";
import { getNodes, createNode, deleteNode } from "../services/tree.api";

export const useTree = () => {
  const [tree, setTree] = useState<TreeNodeType[]>([]);
  const [loading, setLoading] = useState(false);

  const addExpandState = (nodes: TreeNodeType[]): TreeNodeType[] => {
    return nodes.map((node) => ({
      ...node,
      isExpanded: true,
      children: addExpandState(node.children || []),
    }));
  };

  const fetchTree = async () => {
    setLoading(true);
    try {
      const data = await getNodes();

      // initialize collapsed state
      const withUIState = addExpandState(data);

      setTree(withUIState);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTree();
  }, []);

  const toggleNode = (id: string) => {
    const toggle = (nodes: TreeNodeType[]): TreeNodeType[] => {
      return nodes.map((node) => {
        if (node.id === id) {
          return { ...node, isExpanded: !node.isExpanded };
        }
        return {
          ...node,
          children: toggle(node.children),
        };
      });
    };

    setTree((prev) => toggle(prev));
  };
  const addRootNode = async (name: string) => {
    const newNode = await createNode({ name });

    setTree((prev) => [
      ...prev,
      { ...newNode, isExpanded: false, children: [] },
    ]);
  };

  const addChildNode = async (parentId: string, name: string) => {
    console.log("Creating node...");
    await createNode({ name, parentId });

    console.log("Fetching updated tree...");
    await fetchTree();
  };

  const removeNode = async (id: string) => {
    await deleteNode(id);

    const remove = (nodes: TreeNodeType[]): TreeNodeType[] => {
      return nodes
        .filter((node) => node.id !== id)
        .map((node) => ({
          ...node,
          children: remove(node.children),
        }));
    };

    setTree((prev) => remove(prev));
  };

  return {
    tree,
    loading,
    fetchTree,
    toggleNode,
    addRootNode,
    addChildNode,
    removeNode,
  };
};
