import type { TreeNodeType } from "../types/tree.types";

export const addTreeUiState = (nodes: TreeNodeType[]): TreeNodeType[] => {
  return nodes.map((node) => ({
    ...node,
    isExpanded: node.isExpanded ?? true,
    isPending: node.isPending ?? false,
    children: addTreeUiState(node.children ?? []),
  }));
};

export const addNodeOptimistic = (
  tree: TreeNodeType[],
  newNode: TreeNodeType,
): TreeNodeType[] => {
  if (!newNode.parentId) {
    return [...tree, newNode];
  }

  return tree.map((node) => {
    if (node.id === newNode.parentId) {
      return {
        ...node,
        isExpanded: true,
        children: [...node.children, newNode],
      };
    }

    return {
      ...node,
      children: addNodeOptimistic(node.children, newNode),
    };
  });
};

export const removeNodeById = (
  tree: TreeNodeType[],
  nodeId: string,
): TreeNodeType[] => {
  return tree
    .filter((node) => node.id !== nodeId)
    .map((node) => ({
      ...node,
      children: removeNodeById(node.children, nodeId),
    }));
};

export const toggleNodeById = (
  tree: TreeNodeType[],
  nodeId: string,
): TreeNodeType[] => {
  return tree.map((node) => {
    if (node.id === nodeId) {
      return { ...node, isExpanded: !node.isExpanded };
    }

    return {
      ...node,
      children: toggleNodeById(node.children, nodeId),
    };
  });
};

export const replaceNodeById = (
  tree: TreeNodeType[],
  nodeId: string,
  nextNode: TreeNodeType,
): TreeNodeType[] => {
  return tree.map((node) => {
    if (node.id === nodeId) {
      return nextNode;
    }

    return {
      ...node,
      children: replaceNodeById(node.children, nodeId, nextNode),
    };
  });
};
