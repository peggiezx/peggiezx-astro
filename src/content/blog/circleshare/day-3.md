---
title: "Day 3: JWT Authentication & Protected Routes"
pubDate: 2025-06-03
tags: ["FastAPI", "Private-social", "CircleShare", "JWT", "Authentication", "Authorization"]
---

Yesterday, I wired up my first database. CircleShare could finally *remember* who its users were. But then it hit me... right now, **anyone** can call `/users` and see everyone’s info.  

That’s not great for a private app meant to hold personal updates.  

Time to add **security basics**.  


## Authentication vs Authorization  

These are the two concepts that people casually use interchangeably. However, if you know their meaning, they should never be mixed up. They serve very distinct purposes:  
- **Authentication (AuthN)** answers the question:
 *“Are you who you say you are?”*  
  → Think of showing your ID at the door.  

- **Authorization (AuthZ)** answers the question: *“Now that I know who you are, what are you allowed to do?”*  
  → Think of the bouncer checking if you’re on the VIP list.  

For CircleShare:  
- Authentication = logging in with your email/password and getting back a token that proves it’s you.  
- Authorization = using that token to access only the routes you’re allowed (like your profile, your circle’s timeline, not someone else’s).  


## How I Solved It  

### Step 1: Hash Passwords  
I switched from storing plain passwords to **hashed** ones (Argon2). Plain passwords are like writing your ATM PIN on a sticky note. Hashing makes it unreadable gibberish.  

### Step 2: JWT Tokens for Authentication  
When you log in, the API checks your password and then issues a **JWT (JSON Web Token)**.  

A JWT is like a digital boarding pass: it says *“this person is who they claim to be”* and has an expiration time. You send it back with every request as proof.  

Minimal example:  

```python
@app.post("/login")
def login(user_credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == user_credentials.email).first()
    if not user or not verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer"}
```

### Step 3: Protected Routes for Authorization  
Once you have a token, you can access protected routes. Without it? You get `401 Unauthorized`.  

Example:  

```python
@app.get("/profile")
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user
```

That one `Depends(get_current_user)` does all the heavy lifting:  
- Reads the token from the header  
- Validates it  
- Loads the user from the database  
- Passes it into your function  

Magic.  

## Seeing It in Action  

1. Register a new user → `POST /register`  
2. Log in → `POST /login` → get back a JWT  
3. Click “Authorize” in the FastAPI docs, paste in your token  
4. Now you can call `/profile` or `/users` successfully  
5. Without a token? You’re locked out  

That was the first time CircleShare *felt* secure.  


## Learning Resources  

If you want to dive deeper into JWTs and FastAPI security:  

- [FastAPI Security Tutorial](https://fastapi.tiangolo.com/tutorial/security/)  
- [JWT.io Debugger](https://jwt.io) → paste in a token and see what’s inside  
- [RealPython: JWT Authentication with FastAPI](https://realpython.com/token-based-authentication-with-fastapi/)  
## Full Code  

I skipped a lot of the plumbing code in this post to keep it focused. If you want to see my full working implementation (with password hashing, token creation, and protected routes), check out my GitHub repo here:  

👉 **[CircleShare on GitHub](https://github.com/yourusername/circleshare)**  

