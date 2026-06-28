"""Core contracts and types — standard library only, no third-party imports."""

from __future__ import annotations

from .contracts import AsyncSubstrate, Substrate
from .policies import (
    DefaultRetrievalPolicy,
    DefaultValidityPolicy,
    FalsificationPolicy,
    NeverWritebackPolicy,
    NoFalsificationPolicy,
    RetrievalPolicy,
    ValidityPolicy,
    WritebackPolicy,
)
from .types import (
    Belief,
    Episode,
    FalsificationVerdict,
    RetrievalQuery,
    RetrievalResult,
    ScoredBelief,
    WriteReceipt,
    utc_now,
)

__all__ = [
    # contracts
    "Substrate",
    "AsyncSubstrate",
    # policies (interfaces)
    "RetrievalPolicy",
    "ValidityPolicy",
    "FalsificationPolicy",
    "WritebackPolicy",
    # policies (trivial defaults)
    "DefaultRetrievalPolicy",
    "DefaultValidityPolicy",
    "NoFalsificationPolicy",
    "NeverWritebackPolicy",
    # types
    "Belief",
    "Episode",
    "RetrievalQuery",
    "ScoredBelief",
    "RetrievalResult",
    "FalsificationVerdict",
    "WriteReceipt",
    "utc_now",
]
