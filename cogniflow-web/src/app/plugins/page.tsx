"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Cpu, Database, Layers, Loader2, Plug, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Plugins = {
  embedders: string[];
  rerankers: string[];
  generators: string[];
  backends: string[];
  defaults: Record<string, string>;
};

export default function PluginsPage() {
  const [sid, setSid] = useState<string | null>(null);
  const [plugins, setPlugins] = useState<Plugins | null>(null);
  const [down, setDown] = useState(false);
  const [embedder, setEmbedder] = useState("bge-m3");
  const [reranker, setReranker] = useState("off");
  const [saving, setSaving] = useState(false);

  // custom provider (OpenAI-compatible / local)
  const [custom, setCustom] = useState(false);
  const [cBase, setCBase] = useState("http://localhost:11434/v1");
  const [cModel, setCModel] = useState("");
  const [cKey, setCKey] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const p = await api.plugins();
        setPlugins(p);
        setEmbedder(p.defaults.embedder ?? "bge-m3");
        setReranker(p.defaults.reranker ?? "off");
      } catch {
        setDown(true);
      }
      try {
        const s = localStorage.getItem("cf_session") || (await api.newSession());
        localStorage.setItem("cf_session", s);
        setSid(s);
      } catch {
        setDown(true);
      }
    })();
  }, []);

  const save = useCallback(async () => {
    if (!sid) return;
    setSaving(true);
    try {
      await api.setConfig(sid, {
        embedder: custom ? "openai" : embedder,
        embedder_base_url: custom ? cBase : undefined,
        embedder_model: custom ? cModel || undefined : undefined,
        embedder_api_key: custom ? cKey || undefined : undefined,
        reranker,
      });
      toast.success("Plugin config saved for your session.");
    } catch (e) {
      toast.error(`Save failed: ${(e as Error).message}`);
    } finally {
      setSaving(false);
    }
  }, [sid, embedder, reranker, custom, cBase, cModel, cKey]);

  return (
    <div className="mx-auto max-w-5xl px-5 py-12">
      <p className="eyebrow mb-3">Plugins</p>
      <h1 className="text-hero mb-3 !text-[clamp(2rem,4vw,3rem)]">Every layer is a plug.</h1>
      <p className="text-subhead mb-8 max-w-[62ch]">
        Embedder, reranker, generation model, and graph backend are each config-selected and
        fail-loud. Pick a provider, bring a custom OpenAI-compatible endpoint, or point at a
        local model &mdash; nothing is hard-wired.
      </p>

      {down && (
        <div className="mb-8 flex items-start gap-3 rounded-xl border border-warn/40 bg-warn/10 p-4 text-sm">
          <AlertTriangle className="mt-0.5 size-5 shrink-0 text-warn" />
          <div>
            <div className="font-semibold">Backend not reachable</div>
            <p className="mt-1 text-muted-foreground">
              Start it to select plugins live:{" "}
              <code className="rounded bg-secondary px-1.5 py-0.5">python cogniflow-api/main.py</code>
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <Layer icon={<Layers className="size-4" />} title="Embedder" desc="Turns text into vectors for semantic recall.">
          <Chips options={plugins?.embedders ?? ["hash", "bge-m3", "nvidia-e5"]} value={embedder} onChange={(v) => { setEmbedder(v); setCustom(false); }} disabled={custom} />
          <button onClick={() => setCustom((v) => !v)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-brand hover:underline">
            <Plug className="size-3.5" /> {custom ? "Use a built-in embedder" : "Add custom / local provider"}
          </button>
          {custom && (
            <div className="mt-3 space-y-2 rounded-lg border border-border bg-secondary/40 p-3">
              <p className="text-xs text-muted-foreground">OpenAI-compatible endpoint (e.g. Ollama, vLLM, or a hosted provider).</p>
              <Input placeholder="base URL (http://localhost:11434/v1)" value={cBase} onChange={(e) => setCBase(e.target.value)} className="h-8" />
              <Input placeholder="model (e.g. nomic-embed-text)" value={cModel} onChange={(e) => setCModel(e.target.value)} className="h-8" />
              <Input placeholder="API key (blank for local)" value={cKey} onChange={(e) => setCKey(e.target.value)} className="h-8" type="password" />
            </div>
          )}
        </Layer>

        <Layer icon={<Sparkles className="size-4" />} title="Reranker" desc="Optional cross-encoder. Off by default; on by evidence.">
          <Chips options={plugins?.rerankers ?? ["off", "bge-reranker-v2-m3", "nvidia-rerank"]} value={reranker} onChange={setReranker} />
        </Layer>

        <Layer icon={<Cpu className="size-4" />} title="Generation model" desc="Answers from the served context. Model-agnostic, fail-loud.">
          <Chips options={plugins?.generators ?? ["nvidia", "minimax", "openai"]} value={plugins?.generators?.[0] ?? "nvidia"} onChange={() => toast.info("Generator is set via COGNIFLOW_GENERATOR / .env for now.")} />
          <p className="mt-2 text-xs text-muted-foreground">Configured via environment; swapping models re-runs the temporal-correctness check (see docs).</p>
        </Layer>

        <Layer icon={<Database className="size-4" />} title="Graph backend" desc="The bi-temporal store.">
          <Chips options={plugins?.backends ?? ["falkordb", "neo4j"]} value={plugins?.backends?.[0] ?? "falkordb"} onChange={() => toast.info("Backend is set via .env (COGNIFLOW_BACKEND_DRIVER).")} />
          <p className="mt-2 text-xs text-muted-foreground">Same Graphiti driver abstraction; FalkorDB by default, Neo4j supported.</p>
        </Layer>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <Button onClick={save} disabled={saving || down}>
          {saving ? <Loader2 className="size-4 animate-spin" /> : "Save plugin config"}
        </Button>
        <span className="text-xs text-muted-foreground">
          Applies to your playground session. Fail-loud: a missing key or unknown name raises &mdash; never a silent fallback.
        </span>
      </div>
    </div>
  );
}

function Layer({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 elev">
      <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
        <span className="text-brand">{icon}</span> {title}
      </div>
      <p className="mb-3 text-xs text-muted-foreground">{desc}</p>
      {children}
    </div>
  );
}

function Chips({
  options,
  value,
  onChange,
  disabled,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => (
        <button
          key={o}
          disabled={disabled}
          onClick={() => onChange(o)}
          className={`rounded-full border px-3 py-1 text-sm transition-colors disabled:opacity-40 ${
            value === o
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-background text-foreground hover:bg-accent"
          }`}
        >
          {o}
        </button>
      ))}
    </div>
  );
}
