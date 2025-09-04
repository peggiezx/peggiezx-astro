---
title: "Day 9: How the Frontend Works Together: Components, Services, Types, and App.tsx"
pubDate: 2025-06-11
tags: ["Frontend", "React", "TypeScript", "Architecture", "CircleShare"]
---

FastAPI’s Docs is great for testing endpoints, but a frontend is where CircleShare feels real. I want to spend some time talking about **how the frontend pieces coordinate**:  
- **services** (API calls),  
- **types** (what data looks like),  
- **components** (UI + behavior),  
- **`App.tsx`** (the conductor),  
- and a dash of **`App.css`** to make it usable.

We’ll use **Login** as a concrete example, because it shows the full path: **UI → POST API → handle success/error → update app state**.

## The mental model

- **Services:** tiny, testable functions that talk to the backend. No UI code here.  
- **Types:** shared contracts (`LoginRequest`, `LoginResponse`) so components + services agree.  
- **Components:** render inputs, call services, show loading/errors.  
- **`App.tsx`:** orchestrates *what to show when* (auth state, tabs, routing-light).  
- **`App.css`:** simple, shared styles (layout, spacing, states).

```
circleshare-web/
├─ src/
│  ├─ services/
│  │  └─ api.ts          # fetch wrappers (POST/GET/DELETE)
│  ├─ types/
│  │  └─ auth.ts         # LoginRequest, LoginResponse, ApiError
│  ├─ components/
│  │  ├─ Login.tsx       # UI + logic to call login()
│  │  ├─ PostCreationForm.tsx
│  │  ├─ Timeline.tsx
│  │  └─ MyCircle.tsx
│  ├─ App.tsx            # the conductor
│  └─ App.css            # global layout + state styles
└─ index.html
```

## Step 1 — **Services**: POST vs GET vs DELETE

**POST** sends a JSON body; **GET** usually doesn’t; **DELETE** may or may not include a body (we don’t here). Each should return a *parsed* result or throw a typed error.

```ts
// services/api.ts
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export type ApiError = { status: number; message: string };

async function handle(res: Response) {
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw { status: res.status, message: detail || res.statusText } as ApiError;
  }
  return res.status === 204 ? null : res.json();
}

export async function login(email: string, password: string) {
  const res = await fetch(`${BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handle(res) as Promise<{ access_token: string; token_type: string }>;
}

export async function myPosts(token: string) {
  const res = await fetch(`${BASE}/my-circle/posts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function deletePost(token: string, postId: number) {
  const res = await fetch(`${BASE}/posts/${postId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res); // 204 => null
}
```

**Why separate functions?**  
- You keep HTTP details *out* of components.  
- Easier to test and mock.  
- Consistent error handling (ties into Day 4 status-code discipline).

## Step 2 — **Types**: shared contracts

```ts
// types/auth.ts
export type LoginRequest = { email: string; password: string };
export type LoginResponse = { access_token: string; token_type: "bearer" };

export type FieldError = { field?: "email" | "password"; message: string };
```

Types keep your components honest and catch integration bugs early.

## Step 3 — **Component**: `Login.tsx`

This is where UI meets behavior: collect email/password, call `login()`, handle outcomes.  
Key states: **email**, **password**, **loading**, **error**.

```tsx
// components/Login.tsx
import { useState } from "react";
import { login } from "../services/api";

type Props = {
  onSuccess: (token: string) => void;
  onNotFound?: () => void;    // optional: navigate to register
};

export function Login({ onSuccess, onNotFound }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { access_token } = await login(email, password);
      onSuccess(access_token);
    } catch (e: any) {
      // Map backend status → friendly UX (Day 4)
      if (e.status === 404 && onNotFound) onNotFound();
      else if (e.status === 401) setErr("Wrong password. Try again.");
      else setErr("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="card" onSubmit={handleSubmit}>
      <h2>Sign in</h2>
      <label>Email</label>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="email"
        required
      />
      <label>Password</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        required
      />
      <button disabled={loading}>
        {loading ? "Signing in..." : "Sign in"}
      </button>
      {err && <p className="error">{err}</p>}
    </form>
  );
}
```

**Notable bits**  
- *POST* API call with JSON body.  
- Maps **401** (bad password) vs **404** (user not found → invite to register).  
- Shows a loading state and disables the button to prevent double submits.

## Step 4 — **`App.tsx`**: the conductor

`App.tsx` decides what to render: **auth state**, **current view/tab**, and passes callbacks down.

**Pseudo-logic (not full code):**

```
state:
  token | null
  currentView = "timeline" | "my-circle" | "login" | "register"

onLoginSuccess(token):
  save token
  set token state
  set currentView = "timeline"

render:
  if token:
    render tabs + routes:
      if currentView == "timeline":
        render PostCreationForm + Timeline
      if currentView == "my-circle":
        render MyCircle
  else:
    if currentView == "login":
      render <Login onSuccess={onLoginSuccess} onNotFound={() => set currentView = "register"} />
    else:
      render <Register onSuccess={() => set currentView = "login"} />
```

This keeps **components focused** (they don’t decide app navigation), and `App.tsx` stays readable.

## Step 5 — **`App.css`**: minimal, reusable styles

```css
/* App.css */
.app-container { max-width: 800px; margin: 0 auto; padding: 16px; }
.tabbar { display: flex; gap: 8px; align-items: center; margin-bottom: 12px; }
.tab { padding: 6px 10px; border: 1px solid #ccc; border-radius: 6px; background:#fff; }
.tab.active { border-color:#333; font-weight:600; }
.card { display: grid; gap: 8px; padding: 16px; border:1px solid #e5e5e5; border-radius: 8px; background:#fff; }
.error { color: #c00; margin-top: 6px; }
```

Simple classes keep JSX clean and make it obvious where to tweak layout.

## End-to-end flow (Login)

1) **User types** email/password in `Login.tsx`.  
2) Component calls **`login()`** (service).  
3) Service **POSTs** to `/login`, parses JSON, or throws a typed error.  
4) On **success**, `Login` calls `onSuccess(token)`.  
5) `App.tsx` stores the token and **switches view** to *My Days* (PostCreationForm + Timeline).  
6) On **401**, show “Wrong password.”  
7) On **404**, optionally **redirect to Register**.

That’s the loop: **component ↔ service ↔ backend**, with types and error mapping smoothing the edges.

## Patterns that make this scale

- **“Thin components, slim services”:** move fetch + error mapping into services; keep components declarative.  
- **Typed models everywhere:** the same shapes your backend returns (Pydantic) → TypeScript interfaces.  
- **Central status → message mapping:** a helper that converts `status` to friendly strings (reused in Login, InviteModal, etc.).  
- **Test each layer:** services with mocked `fetch`, components with mocked services.  
- **Consistent states:** `loading`, `error`, `success` visuals across forms.
