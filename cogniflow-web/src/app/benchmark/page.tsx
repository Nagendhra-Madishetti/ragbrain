import type { Metadata } from "next";
import { PageStub } from "@/components/site/page-stub";

export const metadata: Metadata = { title: "Benchmark" };

export default function BenchmarkPage() {
  return (
    <PageStub
      eyebrow="Benchmark"
      title="Cogniflow vs LlamaIndex, LangChain, Haystack — for real."
      intro="A reproducible head-to-head against three widely-adopted RAG frameworks, run on the same docs with the same models. Standard questions tie; as-of questions are where a temporal store wins. Every number comes from a live run — the harness is in the repo."
      planned={[
        "Live runs of LlamaIndex, LangChain, and Haystack on the same corpus",
        "Two panels: standard-fact accuracy (tie) and as-of accuracy (the gap)",
        "Bar charts + per-question drill-down with the actual answers",
        "Fictional corpus so no model can answer from training — the honest test",
        "One-command reproduction (python demo/benchmark.py) linked from every number",
      ]}
    />
  );
}
