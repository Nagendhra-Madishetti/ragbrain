# The demo + the reranker (Slice C)

The product's face to a stranger: plain RAG vs Cogniflow on a deliberately confusable corpus,
leading with the one thing plain RAG cannot do, showing the full cited answer with confidence,
and settling the reranker question on measured evidence.

## The static demo (real captured run, zero setup)

`demo/static_demo/index.html` is **self-contained** (the real captured run is inlined - open
it directly, no server). It is regenerated from a real run, never hand-authored numbers:

```
python demo/capture_demo.py                 # live: writes demo/static_demo/demo_data.json
python demo/static_demo/build_page.py       # inlines that JSON into index.html (no network)
```

It leads with the **as-of axis** (framing A): plain RAG sometimes gets *now* right, so the
honest, undefeatable headline is the past - "Where is Tesla headquartered *as of 2015*?" ->
Cogniflow answers **Palo Alto** (the fact true then), plain RAG cannot answer it at all (it has
no temporal dimension). It then shows the **cited answer with `valid_at_source` confidence**
(framing B) - a prose-derived fact is not dressed up as a deterministic structured one.

**Human-verification note (honest):** the "fifteen-second stranger" check (acceptance #10) and
the in-browser visual confirmation of the replay scrubber (acceptance #4, deferred from Slice
B) require a human at a browser - they are not automatable here and are marked as such. The
page is built from verified real data and the scrubber renders the audit API's values verbatim
(no client recompute), which is the property that prevents visual re-leak; the final visual/
comprehension pass is a human step before launch.

## The confusable corpus

`demo/confusable_corpus.py` - many similar entities sharing the `HEADQUARTERED_IN` predicate,
overlapping cities (**two companies both moved to Austin**), and two entities whose HQ changed
over time (Tesla, Oracle). It does double duty: real as-of contrast, and genuine ranking
stress (the collision + indirect queries are where a cross-encoder can earn its place).

## The reranker - measured, not assumed

The reranker is a config-selected retrieval-stage plug (the existing `retrieval` policy family;
`retrieval_policy="reranker"`, `retrieval_params={"reranker": "nvidia-rerank"}`). Same
fail-loud discipline as the embedder/generator plugs. **Off by default** - the GPU-free
minimal path uses the passthrough `default` policy; reranking is the opt-in quality tier.

**Measured lift on the confusable corpus** (`demo/capture_demo.py`, golden n=8):

| configuration | top-1 | MRR |
|---|---|---|
| retrieval only (BGE-M3, reranker off) | 7/8 | 0.900 |
| + reranker on (`nvidia-rerank`) | 8/8 | 1.000 |

**The evidence, honestly:** on **entity-named** queries BGE-M3 already scores top-1 (the
reranker adds nothing - the retriever sets the ceiling). On **hard indirect** queries ("Which
enterprise database company relocated to Texas?" -> Oracle/Austin, with no entity name) the
reranker fixed the one case retrieval ranked wrong at #1 (+1 top-1, +0.10 MRR). So the reranker
**earns its place as an opt-in tier for hard/indirect retrieval**, and stays off by default
where it adds nothing. This is the decision *on evidence*, not spec.

**The models.** Default target is `bge-reranker-v2-m3` (BAAI, Apache-2.0, ~278M, self-hostable,
coherent with the BGE-M3 embedder) via the `[reranker]` extra - the VPC-wedge path, not
exercised in this build env (torch/weights), a documented seam. The lift above was measured
with the API-reachable `nvidia-rerank` (a real cross-encoder) through the same plug interface.
Heavier tiers (gemma / Qwen3 / hosted) slot in via one config change. Size does not determine
quality - re-measure on your corpus.

**The ceiling.** A reranker sharpens ranking; it does not fix recall - it cannot surface what
retrieval never returned. Position it that way.

## Run it yourself (reproducible, not marketing)
`python demo/capture_demo.py` reproduces the captured run on your own FalkorDB; the live audit
dashboard (`cogniflow.serving.audit.run(backend)`) is the interactive replay scrubber. A
skeptic can reproduce every number on the page.

## Read-only, no core change
The demo is read-only over the existing surfaces; the reranker is a retrieval policy; `core/`
is untouched.
