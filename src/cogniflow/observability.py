"""Thin observability for the read/agent path.

Structured logging is always on; an optional Langfuse trace is emitted when
``LANGFUSE_PUBLIC_KEY`` is configured (a no-op otherwise). Wired from Phase 1b so
observability is a first-class seam, not a Phase-6 afterthought. Langfuse is an
optional dependency; nothing here imports it unless a key is present.
"""

from __future__ import annotations

import logging
import os
from typing import Any

logger = logging.getLogger("cogniflow")

_LANGFUSE: Any = None
_LANGFUSE_TRIED = False


def _langfuse() -> Any:
    global _LANGFUSE, _LANGFUSE_TRIED
    if _LANGFUSE_TRIED:
        return _LANGFUSE
    _LANGFUSE_TRIED = True
    if not os.getenv("LANGFUSE_PUBLIC_KEY"):
        return None
    try:
        from langfuse import Langfuse

        _LANGFUSE = Langfuse()
    except Exception:
        _LANGFUSE = None
    return _LANGFUSE


def log_read(text: str, as_of: Any, n_candidates: int, n_kept: int) -> None:
    """Record a substrate read: query, as_of, candidate count, kept count."""
    logger.info(
        "read query=%r as_of=%s candidates=%d kept=%d", text, as_of, n_candidates, n_kept
    )
    client = _langfuse()
    if client is not None:
        try:
            client.event(
                name="cogniflow.read",
                metadata={"as_of": str(as_of), "candidates": n_candidates, "kept": n_kept},
            )
        except Exception:
            pass
