"""Conformance stub: the minimum any synchronous ``Substrate`` must satisfy.

Reusable so future backends (and the test suite) call the same checks. Phase 0
checks are structural/type-level only — behavioral guarantees are deferred.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from ..core.contracts import Substrate
from ..core.types import (
    Episode,
    FalsificationVerdict,
    RetrievalQuery,
    RetrievalResult,
    WriteReceipt,
    utc_now,
)


@dataclass
class CheckResult:
    """Outcome of a single conformance check."""

    name: str
    passed: bool
    detail: str = ""


def run_conformance(substrate: Any) -> list[CheckResult]:
    """Run the Phase-0 conformance stub against a synchronous substrate."""
    results: list[CheckResult] = []

    def check(name: str, cond: bool, detail: str = "") -> None:
        results.append(CheckResult(name=name, passed=bool(cond), detail=detail))

    check(
        "implements Substrate protocol",
        isinstance(substrate, Substrate),
        "object is missing write/read/falsify",
    )

    now = utc_now()

    episode = Episode(id="conformance-ep", content="placeholder", reference_time=now)
    receipt = substrate.write(episode)
    check("write -> WriteReceipt", isinstance(receipt, WriteReceipt))
    check(
        "write echoes episode id",
        getattr(receipt, "episode_id", None) == "conformance-ep",
    )

    query = RetrievalQuery(text="placeholder", as_of=now, top_k=3)
    result = substrate.read(query)
    check("read -> RetrievalResult", isinstance(result, RetrievalResult))
    check("read echoes query", result.query == query)

    verdict = substrate.falsify("conformance-belief")
    check("falsify -> FalsificationVerdict", isinstance(verdict, FalsificationVerdict))
    check(
        "falsify echoes target id",
        verdict.target_id == "conformance-belief",
    )

    return results


def assert_conforms(substrate: Any) -> None:
    """Raise ``AssertionError`` listing any failed conformance checks."""
    failures = [r for r in run_conformance(substrate) if not r.passed]
    if failures:
        lines = "\n".join(f"  - {r.name}: {r.detail}" for r in failures)
        raise AssertionError(f"Substrate failed conformance:\n{lines}")
