import httpx
from jose import jwt, JWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional, Dict, Any
from app.core.config import settings

bearer_scheme = HTTPBearer()
_jwks_cache: Optional[Dict] = None


async def get_jwks() -> Dict:
    global _jwks_cache
    if _jwks_cache:
        return _jwks_cache
    jwks_url = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
    async with httpx.AsyncClient() as client:
        response = await client.get(jwks_url)
        response.raise_for_status()
        _jwks_cache = response.json()
    return _jwks_cache


async def verify_supabase_token(token: str) -> Dict[str, Any]:
    try:
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        alg = unverified_header.get("alg", "RS256")
        jwks = await get_jwks()
        keys = jwks.get("keys", [])
        rsa_key = next((k for k in keys if k.get("kid") == kid), keys[0] if keys else None)
        if not rsa_key:
            raise HTTPException(status_code=401, detail="No matching JWKS key found")
        payload = jwt.decode(token, rsa_key, algorithms=[alg], options={"verify_aud": False})
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")


async def get_current_user_payload(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> Dict[str, Any]:
    return await verify_supabase_token(credentials.credentials)


async def get_current_supabase_id(
    payload: Dict[str, Any] = Depends(get_current_user_payload),
) -> str:
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(status_code=401, detail="Token missing sub claim")
    return sub