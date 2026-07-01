import type { Metadata } from "next";
import { PageStub } from "@/components/site/page-stub";

export const metadata: Metadata = { title: "Playground" };

export default function PlaygroundPage() {
  return (
    <PageStub
      eyebrow="Playground"
      title="Upload a doc. RAG anything. Watch it un-know."
      intro="An interactive workspace: drop in documents (or paste text), ingest them into a live Cogniflow store, then query with an as-of slider to watch the answer change with time — cited, with confidence labels."
      planned={[
        "Drag-and-drop upload (PDF / markdown / text) → live ingest",
        "Ask with an as-of time slider — context vs cited answer, side by side",
        "The system-time replay scrubber (what the system knew at S)",
        "Per-fact provenance + valid_at_source confidence, inline",
        "Runs against your own backend — your data never leaves",
      ]}
    />
  );
}
