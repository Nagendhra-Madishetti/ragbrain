"""HTTP/REST serving surface for the context API (A.3 T4) - for non-MCP consumers.

A single read-only ``POST /context`` endpoint returning the G1 context contract as JSON.
Behind the ``[serve]`` extra (fastapi + uvicorn). Self-hostable: ``run(substrate)`` binds
to localhost by default so it runs in the caller's environment.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any

from ..context import serve_context
from ..core.contracts import AsyncSubstrate

try:
    from fastapi import FastAPI
    from pydantic import BaseModel, Field
except ImportError as e:  # pragma: no cover
    raise RuntimeError(
        "The HTTP serving surface needs the 'serve' extra: pip install 'cogniflow-rag[serve]'"
    ) from e


class ContextRequest(BaseModel):
    query: str
    as_of: datetime | None = None  # first-class temporal axis (T2)
    top_k: int = Field(default=5, ge=1, le=100)
    include_expired: bool = False
    filters: dict[str, Any] = Field(default_factory=dict)


def create_app(substrate: AsyncSubstrate) -> FastAPI:
    """Build the read-only context API over ``substrate``. The app never writes."""
    app = FastAPI(title="Cogniflow Context API", version="0.1.0")

    @app.get("/healthz")
    async def healthz() -> dict[str, str]:
        return {"status": "ok"}

    @app.post("/context")
    async def context(req: ContextRequest) -> dict[str, Any]:
        response = await serve_context(
            substrate,
            req.query,
            as_of=req.as_of,
            top_k=req.top_k,
            include_expired=req.include_expired,
            filters=req.filters,
        )
        return response.to_dict()

    return app


def run(substrate: AsyncSubstrate, *, host: str = "127.0.0.1", port: int = 8077) -> None:
    """Serve locally (in the caller's environment). Defaults to loopback - data never leaves."""
    import uvicorn

    uvicorn.run(create_app(substrate), host=host, port=port)
