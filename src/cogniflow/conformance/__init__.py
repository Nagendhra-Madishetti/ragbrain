"""The plugin conformance-test harness.

Any backend claiming to be an cogniflow ``Substrate`` must pass this suite. Phase 0
ships a *stub*: it checks structural protocol conformance and that each operation
returns a well-typed result. Behavioral conformance (bi-temporal correctness,
falsification semantics) is added in later phases.
"""

from __future__ import annotations

from .suite import CheckResult, assert_conforms, run_conformance

__all__ = ["CheckResult", "run_conformance", "assert_conforms"]
