import type { Metadata } from "next";
import { PageStub } from "@/components/site/page-stub";

export const metadata: Metadata = { title: "Plugins" };

export default function PluginsPage() {
  return (
    <PageStub
      eyebrow="Plugins"
      title="Every layer is a plug. Bring your own."
      intro="Embedder, reranker, generation model, graph backend — each is config-selected and fail-loud. Pick a hosted provider, add a custom OpenAI-compatible endpoint, or point at a local self-hosted model. Nothing is hard-wired."
      planned={[
        "Embedder: BGE-M3 / NVIDIA / OpenAI / custom endpoint / local",
        "Reranker: bge-reranker-v2-m3 / nvidia-rerank / off (measured, not assumed)",
        "Generation: MiniMax / OpenAI / Anthropic / local (Ollama, vLLM)",
        "Backend: FalkorDB / Neo4j",
        "Add a custom provider with your own base URL + API key, saved locally",
        "Fail-loud validation + dimension checks before anything runs",
      ]}
    />
  );
}
