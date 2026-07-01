"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowDownUp,
  Boxes,
  Clock,
  FileCheck2,
  FileText,
  MessageSquareText,
  Network,
  Scissors,
} from "lucide-react";
import type { ReactNode } from "react";

type Stage = {
  phase: string;
  title: string;
  desc: string;
  icon: ReactNode;
  hub?: boolean;
};

const STAGES: Stage[] = [
  { phase: "Ingest", title: "Documents in", desc: "Any PDF, markdown, or text — with the date each fact was true.", icon: <FileText className="size-5" /> },
  { phase: "Ingest", title: "Parse & chunk", desc: "Structure-preserving chunks; tables and sections kept intact.", icon: <Scissors className="size-5" /> },
  { phase: "Ingest", title: "Embed", desc: "Semantic vectors for meaning-based recall.", icon: <Boxes className="size-5" /> },
  { phase: "Memory", title: "Temporal knowledge graph", desc: "Facts stored bi-temporally — when they were true, and when we learned them. The core.", icon: <Network className="size-5" />, hub: true },
  { phase: "Answer", title: "As-of retrieval", desc: "Filter context to the moment you ask about — the past, correctly un-known.", icon: <Clock className="size-5" /> },
  { phase: "Answer", title: "Rerank", desc: "Optional cross-encoder sharpens ranking — on by evidence.", icon: <ArrowDownUp className="size-5" /> },
  { phase: "Answer", title: "Grounded generation", desc: "Answer only from the retrieved facts — no leaking the present into the past.", icon: <MessageSquareText className="size-5" /> },
  { phase: "Answer", title: "Cited answer", desc: "Every claim traces to a fact, and every fact to a document.", icon: <FileCheck2 className="size-5" /> },
];

export function RagFlow() {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      {/* spine */}
      <div className="absolute left-[27px] top-2 bottom-2 w-px bg-border sm:left-[31px]" aria-hidden />
      {!reduce && (
        <motion.div
          aria-hidden
          className="absolute left-[24px] size-2.5 rounded-full bg-brand sm:left-[28px]"
          style={{ boxShadow: "0 0 16px 3px color-mix(in oklab, var(--brand) 60%, transparent)" }}
          initial={{ top: "0%", opacity: 0 }}
          animate={{ top: ["0%", "100%"], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      <ol className="space-y-3">
        {STAGES.map((s, i) => (
          <motion.li
            key={s.title}
            className="relative flex gap-4 pl-0"
            initial={reduce ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className={`relative z-10 flex size-14 shrink-0 items-center justify-center rounded-2xl border ${
                s.hub
                  ? "border-brand/40 bg-brand/10 text-brand ring-glow"
                  : "border-border bg-card text-foreground elev"
              }`}
            >
              {s.icon}
            </div>
            <div
              className={`flex-1 rounded-xl border p-4 ${
                s.hub ? "border-brand/30 bg-brand/[0.04]" : "border-border bg-card"
              } elev`}
            >
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-brand">
                  {s.phase}
                </span>
                <span className="text-xs text-muted-foreground">step {i + 1}</span>
              </div>
              <div className="mt-0.5 font-display text-[15px] font-semibold">{s.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}
