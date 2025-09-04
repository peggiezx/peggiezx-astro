---
title: "Day 5: Testing Auth in FastAPI Docs"
pubDate: 2025-06-05
tags: ["FastAPI", "Private-social", "CircleShare", "Testing", "Authentication"]
---

With authentication and authorization in place, I was excited to test everything in FastAPI’s auto-generated docs (`/docs`). That UI is one of FastAPI’s superpowers — you can hit endpoints, pass JSON, and even test secure routes without writing a single frontend.  

But I immediately hit a snag.  

My login endpoint was:  

```python
@app.post("/login")
async def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    ...
```

This expected `email` and `password`.  

FastAPI’s built-in **Authorize** button in `/docs`, though, expects **username** and **password** (because it’s wired for `OAuth2PasswordBearer`).  

Result: I couldn’t test login or protected routes directly in the docs. Frustrating.  



## Why the Mismatch?  

By default, FastAPI assumes you’ll log in with a `username`. That’s the OAuth2 spec’s wording. But in CircleShare, I only have:  
- `name` (for display, not login)  
- `email` (for login identity)  

So I needed to “rewire” the docs so that when FastAPI asks for `username`, it actually means `email`.  



## The Fix  

I kept my regular `/login` endpoint for CircleShare, but added a second endpoint `/token` specifically for FastAPI docs.  

```python
@app.post("/token")
async def token_for_docs(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user_info = db.query(User).filter(User.email == form_data.username).first()
    
    if not user_info:
        raise UserNotFound()
    
    if verify_password(form_data.password, user_info.hashed_password):
        data = {
            "sub": user_info.email, 
            "name": user_info.name, 
            "id": user_info.id
        }
        
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_MINUTES)
        access_token = create_user_token(data, access_token_expires)

        return {
            "access_token": access_token,
            "token_type": "bearer"
        }

    raise InvalidCredentials()
```

And in my auth setup:  

```python
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
```

Now, when I click “Authorize” in `/docs`, FastAPI sends my email (as `username`) + password to `/token`, and I get a valid JWT back.  

From then on, testing protected routes in the docs works like a charm.  



## Why This Matters  

This little wiring exercise taught me two things:  

1. **Specs vs Reality** — OAuth2 spec uses “username,” but in practice we often log in with email. FastAPI is spec-first, so you just need to adapt.  
2. **The Docs Are Worth It** — being able to test everything interactively (without Postman or a frontend) is a huge productivity boost.  



## Debugging Notes  

I also added some `print` statements while I was figuring this out:  

```python
print(f"Login attempt for {credentials.email}")
print(f"User found: {user_info is not None}")
```

Sometimes a couple of debug lines tell you more than staring at stack traces for an hour.  



## What I Learned Today  

- FastAPI’s `/docs` is a killer feature — but it expects OAuth2’s `username/password` by default.  
- If your app uses `email` instead of `username`, add a `/token` endpoint for the docs.  
- Update `OAuth2PasswordBearer(tokenUrl="token")` so FastAPI knows where to send the form.  
- A little adaptation lets you use the docs’ **Authorize** button for fully testing secure endpoints.  

👉 **[CircleShare on GitHub](https://github.com/yourusername/circleshare)**  
