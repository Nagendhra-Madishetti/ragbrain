"""cogniflow — temporal, self-falsifying belief substrate for agentic RAG.

Phase 0 exposes only the stable contracts and core types. Backends and bridges
are imported explicitly from their submodules so that the top-level import stays
dependency-free.
"""

from __future__ import annotations

from .core.contracts import AsyncSubstrate, Substrate
from .core.types import (
    Belief,
    Episode,
    FalsificationVerdict,
    RetrievalQuery,
    RetrievalResult,
    ScoredBelief,
    WriteReceipt,
    utc_now,
)

__version__ = "0.0.0"

__all__ = [
    "Substrate",
    "AsyncSubstrate",
    "Belief",
    "Episode",
    "RetrievalQuery",
    "ScoredBelief",
    "RetrievalResult",
    "FalsificationVerdict",
    "WriteReceipt",
    "utc_now",
    "__version__",
]
