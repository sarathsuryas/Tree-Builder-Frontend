import { useState } from "react";
import { useTree } from "../hooks/useTree";
import { TreeNode } from "./treeNode";

export const Tree = () => {
  const { tree, loading, addRootNode, addChildNode, removeNode, toggleNode } =
    useTree();
  const [name, setName] = useState("");
  const rootCount = tree.length;

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addRootNode(name.trim());
    setName("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.18),_transparent_35%),linear-gradient(180deg,#fffdf7_0%,#f8fafc_100%)] px-4 py-10">
        <div className="mx-auto max-w-5xl rounded-[2rem] border border-white/70 bg-white/75 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur">
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-24 animate-pulse rounded-[1.5rem] bg-slate-100" />
          <div className="mt-3 h-24 animate-pulse rounded-[1.5rem] bg-slate-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.2),_transparent_30%),linear-gradient(180deg,#fffdf7_0%,#f8fafc_100%)] px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/70 bg-white/80 p-6 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-700">
                Tree Builder
              </p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Shape your hierarchy with clean, expandable nodes.
              </h1>
              <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
                Add root items, branch them into children, and manage the
                structure in a calmer, more readable workspace.
              </p>
            </div>

            <div className="rounded-3xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-700">
                Roots
              </p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                {rootCount}
              </p>
            </div>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200/80 bg-slate-50/90 p-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Create a new root node"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void handleAdd();
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  void handleAdd();
                }}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Add Root
              </button>
            </div>
          </div>

          <div className="mt-8">
            {tree.length === 0 ? (
              <div className="rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50/80 px-6 py-12 text-center">
                <p className="text-lg font-semibold tracking-tight text-slate-900">
                  Start with your first root node
                </p>
                <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-500">
                  This canvas is ready for structure. Add a root node above and
                  grow the tree from there.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {tree.map((node) => (
                  <TreeNode
                    key={node.id}
                    node={node}
                    toggleNode={toggleNode}
                    addChildNode={addChildNode}
                    removeNode={removeNode}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
