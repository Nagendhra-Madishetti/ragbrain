import type { Metadata } from "next";
import { PageStub } from "@/components/site/page-stub";

export const metadata: Metadata = { title: "Docs" };

export default function DocsPage() {
  return (
    <PageStub
      eyebrow="Docs"
      title="Quickstart, concepts, and the audit trail — in the open."
      intro="For an audit product the strongest documentation is the code that produces the audit trail. A Quickstart, the bi-temporal concepts, the plugin contracts, and the reproducible harnesses — all version-controlled alongside the engine."
      planned={[
        "Quickstart: clean-clone to first temporally-correct answer",
        "Concepts: event-time vs system-time, the un-knowing invariant",
        "Plugin contracts: embedder / reranker / generator / backend",
        "Self-hosting guide: your VPC, your models, your data",
        "The context API, the audit dashboard, and the benchmark harness",
      ]}
    />
  );
}
