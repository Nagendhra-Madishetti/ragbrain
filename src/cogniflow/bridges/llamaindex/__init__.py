"""LlamaIndex bridge — DEFERRED.

Phase 0 ships only the framework-neutral bridge contracts in
``cogniflow.bridges.contracts``. The concrete adapters land once the contracts are
frozen (Phase 2):

  - ``TemporalGraphRetriever``     (subclasses ``llama_index.core ... BaseRetriever``)
  - ``TemporalValidityPostprocessor`` (subclasses ``BaseNodePostprocessor``)
  - ``verify_fact`` / ``record_observation`` (``FunctionTool``)

Importing this module is intentionally inert; it pulls in no llama-index dependency.
"""

from __future__ import annotations

__all__: list[str] = []
