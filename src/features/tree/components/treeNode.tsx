import type { TreeNodeType } from "../types/tree.types";
import { NodeActions } from "./nodeActions";

type Props = {
  node: TreeNodeType;
  toggleNode: (id: string) => void;
  addChildNode: (parentId: string, name: string) => Promise<void>;
  removeNode: (id: string) => Promise<void>;
};

export const TreeNode = ({
  node,
  toggleNode,
  addChildNode,
  removeNode,
}: Props) => {
  const hasChildren = node.children.length > 0;

  return (
    <div className="relative ml-4 mt-4 pl-6 before:absolute before:bottom-0 before:left-2 before:top-0 before:w-px before:bg-linear-to-b before:from-amber-200 before:via-slate-200 before:to-transparent">
      <div className="relative rounded-3xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="absolute left-[-1.2rem] top-7 h-px w-4 bg-amber-200" />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => toggleNode(node.id)}
            className="flex h-9 w-9 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-600 transition hover:border-amber-300 hover:bg-amber-50"
            aria-label={node.isExpanded ? "Collapse node" : "Expand node"}
          >
            <svg
              viewBox="0 0 16 16"
              className={`h-4 w-4 transition-transform ${node.isExpanded ? "rotate-90" : ""}`}
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 3.5L10.5 8L6 12.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="min-w-48 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-semibold tracking-tight text-slate-900">
                {node.name}
              </span>
              {node.isPending && (
                <span className="rounded-full bg-sky-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-sky-700">
                  Saving
                </span>
              )}
              <span className="rounded-full bg-amber-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-amber-700">
                {hasChildren
                  ? `${node.children.length} child${node.children.length > 1 ? "ren" : ""}`
                  : "Leaf"}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              {node.isPending
                ? "Creating node and syncing it with the backend."
                : hasChildren
                ? node.isExpanded
                  ? "Branch open for editing and review."
                  : "Branch collapsed. Expand to inspect children."
                : "No children yet. Add one to keep building."}
            </p>
          </div>

          <NodeActions
            nodeId={node.id}
            addChildNode={addChildNode}
            removeNode={removeNode}
          />
        </div>
      </div>

      {node.isExpanded && hasChildren && (
        <div className="mt-3 space-y-1">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              toggleNode={toggleNode}
              addChildNode={addChildNode}
              removeNode={removeNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};
