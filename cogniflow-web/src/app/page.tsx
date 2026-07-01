import Link from "next/link";
import { ArrowRight, Check, Clock, Code, Minus, ShieldCheck, Server } from "lucide-react";
import demo from "@/data/demo_data.json";
import bench from "@/data/benchmark_data.json";
import { site } from "@/lib/site";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { BenchmarkChart, type PanelDatum } from "@/components/landing/benchmark-chart";

const clean = (s: string) => s.replace(/\*\*/g, "").trim();

const H = demo.as_of_headline;
const panels: PanelDatum[] = [
  {
    panel: "Standard",
    plain: bench.panels.standard.plain_score,
    cogniflow: bench.panels.standard.cogniflow_score,
    n: bench.panels.standard.n,
  },
  {
    panel: "As-of",
    plain: bench.panels.as_of.plain_score,
    cogniflow: bench.panels.as_of.cogniflow_score,
    n: bench.panels.as_of.n,
  },
];

const matrix = [
  { cap: "Standard retrieval / recall", cf: "tie", other: "Strong", note: "inherited, not a win" },
  { cap: "Temporal correctness / as-of replay", cf: "win", other: null },
  { cap: 'Auditable provenance — "why did this change?"', cf: "win", other: null },
  { cap: "System-time replay (what did it know then)", cf: "win", other: null },
  { cap: "Self-hostable / in-VPC / data never leaves", cf: "win", other: null },
];

const boundaries = [
  {
    t: "Structured input is deterministic",
    d: "Facts you assert get precise temporal validity. Facts extracted from raw prose are only as good as the extraction LLM — each served fact is labeled with its confidence, so nothing is laundered.",
  },
  {
    t: "Retrieval is inherited, not class-leading",
    d: "We use Graphiti's retrieval; we don't out-retrieve the recall specialists. An optional reranker is measured, off by default, on by evidence.",
  },
  {
    t: 'Not "first" at temporal RAG',
    d: "Validity filters and temporal-graph RAG exist. What we ship is honest system-time replay — the un-knowing invariant — as auditable, self-hostable infrastructure.",
  },
];

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-20 sm:pt-28">
          <p className="eyebrow mb-5">Self-hostable · Apache-2.0 · Graphiti × LlamaIndex</p>
          <h1 className="text-hero max-w-[18ch]">
            The <span className="text-gradient">auditable, self-hostable</span> belief ledger
            for agents.
          </h1>
          <p className="text-subhead mt-6 max-w-[62ch]">
            Plain RAG tells you what&rsquo;s true <em>now</em>. Cogniflow tells you what your
            agent believed at any <em>past</em> moment &mdash; and proves it. Temporally-correct
            context and cited answers, in your own VPC, where your data never leaves.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <LinkButton href="/playground" size="lg" className="h-12 px-6 text-[15px] font-semibold">
              Try the playground <ArrowRight className="size-4" />
            </LinkButton>
            <LinkButton
              href={site.repo}
              external
              size="lg"
              variant="outline"
              className="h-12 px-6 text-[15px]"
            >
              <Code className="size-4" /> Read the code
            </LinkButton>
          </div>

          {/* proof card - real captured run */}
          <div className="ring-glow mesh-panel mt-14 max-w-3xl rounded-xl p-6">
            <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-brand" />
              Real captured run · {H.query}
            </div>
            <dl className="space-y-3 text-[15px]">
              <Row k="Cogniflow · as of 2015" v={clean(H.past_2015.answer)} good />
              <Row k="Cogniflow · now" v={clean(H.now.answer)} good />
              <Row k="Plain RAG · as of 2015" v="Can't answer it at all — no temporal axis." bad />
            </dl>
          </div>
        </div>
      </section>

      {/* THE ONE THING */}
      <Section eyebrow="The one thing plain RAG can't do" title={`Ask "as of when?"`}>
        <p className="text-subhead max-w-[62ch]">
          Modern RAG (and hosted memory) has no time axis. It answers from whatever it retrieves
          today. Cogniflow filters context to the moment you ask about, so the answer is
          temporally correct &mdash; and cites the fact it stood on.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 elev">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-danger">
              <Minus className="size-4" /> Plain RAG
            </div>
            <p className="text-sm text-muted-foreground">
              Sees both the old and new fact, with no dates to separate them. It hedges
              (&ldquo;conflicting information&rdquo;) or picks the wrong one.
            </p>
          </div>
          <div className="ring-glow rounded-xl border border-border bg-card p-6 elev">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-brand">
              <Check className="size-4" /> Cogniflow · as of 2015
            </div>
            <p className="text-sm text-foreground">{clean(H.past_2015.answer)}</p>
          </div>
        </div>
        <div className="mt-6">
          <LinkButton href="/playground" variant="outline">
            Watch it live in the playground <ArrowRight className="size-4" />
          </LinkButton>
        </div>
      </Section>

      {/* CAPABILITY MATRIX */}
      <Section eyebrow="Positioned by contrast" title="The axis the recall-optimized clouds vacated">
        <p className="text-subhead max-w-[62ch]">
          Not a worse hosted-memory service &mdash; the answer to a question their governed cloud
          structurally can&rsquo;t, for the regulated buyer who can&rsquo;t send data out. We tie
          on retrieval; we win where they&rsquo;re blank.
        </p>
        <div className="mt-8 overflow-hidden rounded-xl border border-border bg-card elev">
          <table className="w-full text-left text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-semibold">Capability</th>
                <th className="px-5 py-3 font-semibold">Cogniflow</th>
                <th className="px-5 py-3 font-semibold">Hosted recall memory</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((r) => (
                <tr key={r.cap} className="border-t border-border">
                  <td className="px-5 py-4 text-foreground">{r.cap}</td>
                  <td className="px-5 py-4">
                    {r.cf === "tie" ? (
                      <span className="font-semibold text-warn">Tie — {r.note}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
                        <Check className="size-4" /> Yes
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {r.other ? (
                      <span className="text-foreground">{r.other}</span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-miss">
                        <Minus className="size-4" /> &mdash;
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          The tie row is the point: an all-green matrix is the one nobody believes.
        </p>
      </Section>

      {/* BENCHMARK */}
      <Section
        eyebrow="Real benchmark — every number from a live run"
        title="Where we tie, and where it isn't close"
      >
        <p className="text-subhead max-w-[62ch]">
          Same corpus, same model, same embeddings &mdash; the only difference is memory.
          Measured against LlamaIndex-style plain RAG on a fictional corpus (so no LLM can answer
          from training).
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-xl border border-border bg-card p-6 elev">
            <BenchmarkChart data={panels} />
          </div>
          <div className="flex flex-col justify-center gap-4">
            <Stat label="Standard questions (stable facts)" a="Plain RAG 4/4" b="Cogniflow 4/4" tie />
            <Stat label="As-of questions (past dates)" a="Plain RAG 0/4" b="Cogniflow 4/4" />
            <p className="text-xs leading-relaxed text-muted-foreground">
              On famous real entities a large LLM answers as-of questions from its training
              (measured: it scored 4/4). So the corpus is fictional and dates live only in
              metadata &mdash; the temporal advantage shows on data the model has never seen:
              your private data.
            </p>
            <Link
              href="/benchmark"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            >
              Full benchmark &amp; methodology <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </Section>

      {/* BOUNDARIES */}
      <Section eyebrow="Honesty is the marketing" title="What we are — and what we're not">
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {boundaries.map((b) => (
            <div key={b.t} className="rounded-xl border border-border bg-card p-6 elev">
              <h3 className="text-headline mb-2">{b.t}</h3>
              <p className="text-sm text-muted-foreground">{b.d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA BAND */}
      <section className="border-t border-border">
        <div className="mesh-panel">
          <div className="mx-auto max-w-6xl px-5 py-20 text-center">
            <h2 className="text-section mx-auto max-w-[22ch]">
              Run it in your own environment. Read the code that produces the audit trail.
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LinkButton href={site.repo} external size="lg" className="h-12 px-6 font-semibold">
                <Code className="size-4" /> Read the code
              </LinkButton>
              <LinkButton href="/playground" size="lg" variant="outline" className="h-12 px-6">
                Open the playground
              </LinkButton>
            </div>
            <div className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <Feature icon={<Clock className="size-4 text-brand" />} t="As-of replay" />
              <Feature icon={<ShieldCheck className="size-4 text-brand" />} t="Auditable provenance" />
              <Feature icon={<Server className="size-4 text-brand" />} t="Self-hostable / in-VPC" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Section({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto max-w-6xl px-5 py-8">
      <div className="section-box p-7 sm:p-10">
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="text-section max-w-[24ch]">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function Row({ k, v, good, bad }: { k: string; v: string; good?: boolean; bad?: boolean }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-4">
      <dt className="w-40 shrink-0 text-xs text-muted-foreground">{k}</dt>
      <dd className={bad ? "text-danger" : good ? "text-brand" : "text-foreground"}>{v}</dd>
    </div>
  );
}

function Stat({ label, a, b, tie }: { label: string; a: string; b: string; tie?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4 elev">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-center gap-3 text-sm">
        <span className={tie ? "text-warn" : "text-danger"}>{a}</span>
        <span className="text-muted-foreground">·</span>
        <span className="font-semibold text-brand">{b}</span>
        {tie && (
          <Badge variant="outline" className="ml-auto border-warn/40 text-warn">
            tie
          </Badge>
        )}
      </div>
    </div>
  );
}

function Feature({ icon, t }: { icon: React.ReactNode; t: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      {icon} {t}
    </span>
  );
}
