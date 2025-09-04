---
title: "Day 7: Enabling CORS: Connecting Frontend & Backend Locally"
pubDate: 2025-06-09
tags: ["FastAPI", "CORS", "Frontend", "Backend", "CircleShare"]
---

I decided to use React + TypeScript for the frontend. I followed through some tutorials to connect the backend to the front end.

The first time I connected my new frontend to the FastAPI backend, the browser yelled at me:

```
Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy
```
**What is CORS?**

CORS (Cross-Origin Resource Sharing) is a browser security feature. By default, your browser blocks JavaScript running on one domain (like `localhost:5173`) from calling APIs on another (like `localhost:8000`).

That’s good for security, but it breaks local dev, unless you tell FastAPI which frontends are allowed.

## The Fix: FastAPI Middleware

FastAPI makes this easy with the `CORSMiddleware`. I just added:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

This says:

- Allow requests from `http://localhost:5173` (where Vite serves my frontend)
- Support cookies/credentials if I add them later
- Allow all HTTP methods and headers (simplifies early dev)



## Why Not Just `*`?

You’ll often see tutorials use `allow_origins=["*"]`. That works, but it means **any site** could make requests to your API. For CircleShare, I want to keep things private. Limiting to `http://localhost:5173` is safer during dev, and later I can switch to my real domain.



## Seeing It Work

After enabling CORS:

- My frontend could log in and fetch JWT tokens.
- I could create posts and immediately see them rendered in the web UI.
- The dreaded “CORS policy” errors disappeared.

The backend and frontend were finally talking like old friends.


## What I Learned Today

- CORS is a browser guardrail, not a bug.
- You have to explicitly allow your frontend’s origin in the backend.
- FastAPI’s middleware makes it a one-liner.
- Limiting origins (instead of `*`) is good practice, especially for private apps.

With CORS in place, CircleShare now feels like a _real app_ — frontend and backend working hand-in-hand.

👉 **[CircleShare on GitHub](https://github.com/yourusername/circleshare)**  
