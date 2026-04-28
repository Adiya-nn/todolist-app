import { useState } from "react";

type Props = {
  text: string;
};

export default function ToggleText({ text }: Props) {
  const [visible, setVisible] = useState(true);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setVisible(!visible)}
        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 active:scale-[0.99]"
      >
        {visible ? "Hide" : "Show"}
      </button>

      {visible && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-slate-800">
          {text}
        </div>
      )}
    </div>
  );
}
