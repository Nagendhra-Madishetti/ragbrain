# Known issues

## G3 - FalkorDriver ignores the date `search_filter` (confirmed)

**Verdict (empirical, 2026-06-28):** Graphiti's FalkorDB driver does **not** apply the
bi-temporal date filters in `SearchFilters` (`valid_at` / `invalid_at` / `created_at` /
`expired_at`). A raw `graphiti.search(..., search_filter=as_of(2020))` over two facts
(Boston valid_at=2019, Denver valid_at=2022) returned **both** edges, including the
future-valid Denver fact that the filter should have excluded.

**Risk:** false negatives. A fact that is valid at T but ranked outside a naive `top_k`
window would never be seen, and a `top_k`-sized in-process filter could not recover it.

**Mitigation (in place):** `GraphitiFalkorDBBackend.read()` over-fetches a wider candidate
set (`max(top_k * 10, 50)`), applies the single shared `ValidityPolicy` in-process
(`cogniflow.core.policies.filter_valid`), then truncates to `top_k`. Point-in-time
correctness therefore does not depend on the DB-side filter.

**Follow-up (deferred):** push the temporal predicate into the FalkorDB Cypher query (or
switch the date filter on at the driver level) so the database does the work and the
over-fetch factor can shrink. Tracked for the backend-hardening phase.
