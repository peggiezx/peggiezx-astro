---
title: "Day 4: Professional Error Handling in CircleShare"
pubDate: 2025-06-04
tags: ["FastAPI", "Private-social", "CircleShare", "Error Handling", "HTTP Status Codes"]
---

By now, CircleShare can:  
- Store users in a database  
- Authenticate with JWT tokens  
- Protect private routes  

Pretty solid, right? But then I hit my first *real* wall: **errors.**  

When something went wrong, FastAPI would spit back generic messages like:  

```json
{
  "detail": "Incorrect email or password"
}
```  

Or worse — I’d only see what happened by digging through server logs. That’s fine for debugging as a developer, but completely useless if you’re the person using the app.  

## The “Login Failure” Example  

Take logging in.  

When it fails, there are at least **two very different reasons**:  
1. The email doesn’t exist → the user never registered.  
2. The email exists but the password is wrong.  

From the server’s perspective, both are just “login failed.” But for the user (and for you as a developer), those mean *very different solutions*:  
- Case 1 → Suggest registration.  
- Case 2 → Suggest resetting the password.  

If all you return is `"Invalid credentials"`, you force yourself to check logs or guess. That slows down development and frustrates users.  

## Why Clear Errors Matter  

Professional apps don’t just say *“something broke”*. They:  
- **Tell you what happened** (invalid password vs no account).  
- **Do it consistently** (same format everywhere).  
- **Give enough context** that frontend developers (and users) know what to do next.  

Without that, you’re left with inconsistent details scattered across your code, and error handling feels like an afterthought.  

## The Solution: Custom Exceptions  

I solved this by creating **custom exception classes** in CircleShare. Instead of raising a generic `HTTPException` everywhere, I defined my own:  

- `UserNotFound`  
- `InvalidPassword`  
- `EmailAlreadyExists`  
- `TokenExpired`  

Now, when login fails, I don’t just throw a vague error. I raise a **specific exception**.  

Example (simplified):  

```python
if not user:
    raise UserNotFound()

if not verify_password(password, user.hashed_password):
    raise InvalidPassword()
```  

And thanks to a global exception handler, these get converted into **clean, consistent JSON responses** like:  

```json
{
  "error_type": "user_not_found",
  "message": "No account found with this email. Please register first.",
  "timestamp": "2025-06-04T10:30:45Z"
}
```  

or  

```json
{
  "error_type": "invalid_password",
  "message": "Password is incorrect. Try again or reset your password.",
  "timestamp": "2025-06-04T10:31:12Z"
}
```  

Suddenly, both users *and* developers know exactly what went wrong — without hunting through logs.  

## Why Status Codes Matter  

Error handling isn’t just about messages — it’s also about **using the right HTTP status codes** so clients can react properly.  

Here’s my cheat sheet:  

### Success Codes  
- **200 OK** → Generic success (fetch timeline).  
- **201 Created** → New resource created (user, post).  
- **204 No Content** → Action succeeded, no response body (delete).  

### Client Error Codes (4xx)  
- **400 Bad Request** → Bad input (malformed JSON, missing fields).  
- **401 Unauthorized** → No/invalid token.  
- **403 Forbidden** → Authenticated but not allowed (member trying to delete someone else’s post).  
- **404 Not Found** → Resource doesn’t exist (post ID invalid).  
- **409 Conflict** → Duplicate data (email already exists).  
- **422 Unprocessable Entity** → Validation failed (invalid email format).  

### Server Error Codes (5xx)  
- **500 Internal Server Error** → Generic bug or crash.  
- **503 Service Unavailable** → Database or service down.  


## Quick CircleShare Examples  

- **POST /users**  
  - `201 Created` → Success  
  - `409 Conflict` → Email already exists  

- **POST /login**  
  - `200 OK` → Token issued  
  - `401 Unauthorized` → Wrong password  
  - `404 Not Found` → User not registered  

- **DELETE /posts/{id}**  
  - `204 No Content` → Post deleted  
  - `403 Forbidden` → Not author or circle owner  
  - `404 Not Found` → Post doesn’t exist  

👉 **[CircleShare on GitHub](https://github.com/yourusername/circleshare)**  
