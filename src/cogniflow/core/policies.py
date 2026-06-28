"""The four policy interfaces — the pluggable decision points of the substrate.

Each maps to one seam from the design analysis:

  RetrievalPolicy     -> read seam        (resolve as-of, rank candidates)
  ValidityPolicy      -> invalidate seam  (is a belief valid at time t?)
  FalsificationPolicy -> falsify seam     (is a belief superseded, and by what?)
  WritebackPolicy     -> write-back seam  (should an outcome become a new belief?)

Phase 0 ships the *interfaces* plus trivial default implementations so a backend can
be wired end to end. Real policies (LLM-driven contradiction, temporal decay ranking,
selective write-back) are deferred. Standard library only.
"""

from __future__ import annotations

from collections.abc import Sequence
from datetime import datetime
from typing import Protocol, runtime_checkable

from .types import Belief, FalsificationVerdict, RetrievalQuery, RetrievalResult, ScoredBelief


@runtime_checkable
class RetrievalPolicy(Protocol):
    """How a query is turned into ranked candidates."""

    def resolve_as_of(self, query: RetrievalQuery) -> datetime | None: ...

    def rank(self, query: RetrievalQuery, beliefs: Sequence[Belief]) -> Sequence[ScoredBelief]: ...


@runtime_checkable
class ValidityPolicy(Protocol):
    """Whether a belief counts as valid at a given point in time."""

    def is_valid(self, belief: Belief, as_of: datetime | None) -> bool: ...


@runtime_checkable
class FalsificationPolicy(Protocol):
    """Whether a target belief is superseded by any candidate."""

    def assess(self, target: Belief, candidates: Sequence[Belief]) -> FalsificationVerdict: ...


@runtime_checkable
class WritebackPolicy(Protocol):
    """Whether a retrieval outcome should be persisted back as a new belief."""

    def should_persist(self, result: RetrievalResult) -> bool: ...


# --- trivial default implementations (deliberately dumb) ---------------------


class DefaultRetrievalPolicy:
    """Passes as-of through; assigns no scores (preserves input order)."""

    def resolve_as_of(self, query: RetrievalQuery) -> datetime | None:
        return query.as_of

    def rank(self, query: RetrievalQuery, beliefs: Sequence[Belief]) -> Sequence[ScoredBelief]:
        return [ScoredBelief(belief=b, score=None) for b in beliefs]


class DefaultValidityPolicy:
    """Live beliefs are valid; if ``as_of`` is given, also enforce event-time."""

    def is_valid(self, belief: Belief, as_of: datetime | None) -> bool:
        if not belief.is_live:
            return False
        if as_of is None:
            return True
        return belief.is_valid_at(as_of)


class NoFalsificationPolicy:
    """Never supersedes anything (Phase-0 placeholder)."""

    def assess(self, target: Belief, candidates: Sequence[Belief]) -> FalsificationVerdict:
        return FalsificationVerdict(
            target_id=target.id,
            superseded=False,
            rationale="NoFalsificationPolicy: falsification deferred",
        )


class NeverWritebackPolicy:
    """Never persists retrieval outcomes (Phase-0 placeholder)."""

    def should_persist(self, result: RetrievalResult) -> bool:
        return False
