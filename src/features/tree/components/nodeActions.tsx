import { useState } from "react";

type Props = {
  nodeId: string;
  addChildNode: (parentId: string, name: string) => Promise<void>;
  removeNode: (id: string) => Promise<void>;
};

export const NodeActions = ({ nodeId, addChildNode, removeNode }: Props) => {
  const [name, setName] = useState("");
  const [showInput, setShowInput] = useState(false);
  const hasName = name.trim().length > 0;

  const handleAdd = async () => {
    if (!hasName) return;
    await addChildNode(nodeId, name.trim());
    setName("");
    setShowInput(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100"
        onClick={() => setShowInput(!showInput)}
      >
        {showInput ? "Close" : "+ Child"}
      </button>

      <button
        type="button"
        className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold tracking-wide text-rose-700 transition hover:border-rose-300 hover:bg-rose-100"
        onClick={async () => {
          await removeNode(nodeId);
        }}
      >
        Delete
      </button>

      {showInput && (
        <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/90 p-2 shadow-sm">
          <input
            className="min-w-40 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Child name"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                void handleAdd();
              }
            }}
          />
          <button
            type="button"
            className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={() => {
              void handleAdd();
            }}
            disabled={!hasName}
          >
            Save
          </button>
        </div>
      )}
    </div>
  );
};
