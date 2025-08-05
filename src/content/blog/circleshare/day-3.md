---
title: "Day 3: JWT Authentication & Protected Routes"
pubDate: 2025-06-03
tags: ["FastAPI", "Private-social", "CircleShare", "JWT", "Authentication", "Authorization","fastapi.security"]
---

## Today's Mission: JWT Authentication & Protected Routes

After successfully building a FastAPI backend with user registration and database integration, today's challenge was implementing a complete authentication system. This involved JWT tokens, password verification, and protected routes - essentially building the security layer that keeps family data safe.

## What I Built

### 🔐 **Complete JWT Authentication System**
- **Token Generation**: Created secure JWT tokens upon successful login
- **Token Validation**: Built middleware to verify tokens on protected routes  
- **Password Security**: Implemented Argon2 hashing for bulletproof password storage
- **Protected Endpoints**: Family-only routes that require valid authentication

### 🛠 **Technical Implementation**

**Authentication Flow:**
1. User logs in with email/password
2. API verifies credentials against hashed passwords in database
3. If valid, generates JWT token with user info and expiration
4. User sends token with subsequent requests to protected routes
5. API validates token and extracts user information

**Key Technologies:**
- **python-jose**: JWT token creation and validation
- **passlib with Argon2**: Modern password hashing
- **FastAPI Dependencies**: Clean dependency injection for authentication
- **HTTPBearer**: Professional token-based authentication

### 🧩 **Code Architecture**

**Separation of Concerns:**
```python
# auth.py - Authentication logic
def create_access_token(data: dict, expires_delta: timedelta)
def verify_password(plain_password: str, hashed_password: str)  
async def get_current_user(credentials: HTTPAuthorizationCredentials)

# main.py - API endpoints
@app.post("/login", response_model=Token)
@app.get("/profile", dependencies=[Depends(get_current_user)])
```

**Clean dependency injection** for protected routes using FastAPI's `Depends()` system.

## Challenges Overcome

### 🐛 **Password Hash Compatibility**
**Problem**: `passlib.exc.UnknownHashError` when trying to verify passwords  
**Root Cause**: Database contained old password hashes incompatible with current Argon2 setup  
**Solution**: Started fresh with clean database and consistent hashing scheme  
**Learning**: Importance of schema migrations and hash compatibility in production systems

### 🔧 **Authentication UI Design Choice**  
**Problem**: OAuth2PasswordBearer created username/password form instead of simple token field  
**Decision**: Switched to HTTPBearer for cleaner token-based authentication  
**Result**: More professional API design and easier frontend integration  
**Learning**: Understanding different OAuth2 flows and choosing the right approach

### ⚠️ **Modern Python Deprecations**
**Issue**: `datetime.utcnow()` deprecated in Python 3.13  
**Solution**: Updated to `datetime.now(timezone.utc)` for timezone-aware timestamps  
**Learning**: Staying current with Python best practices and explicit timezone handling

## Key Insights

### 🎯 **Authentication vs Authorization**
Solidified understanding of the critical distinction:
- **Authentication**: "Who are you?" (Login verification)  
- **Authorization**: "What can you access?" (Permission checking)

### 🔒 **Security First Mindset**
- Never store plain text passwords
- Use secure, modern hashing algorithms (Argon2 > bcrypt)
- Implement proper token expiration (20 minutes for this project)
- Validate tokens on server-side for every protected request

### 🏗 **Dependency Injection Power**
FastAPI's `Depends()` system creates clean, reusable authentication:
```python
# Automatic authentication for any endpoint
async def protected_endpoint(current_user: User = Depends(get_current_user)):
    # Function only runs if user is authenticated
    # current_user object automatically available
```

## Portfolio Metrics

**Lines of Code**: ~150 lines of authentication logic  
**Endpoints Created**: 4 (register, login, profile, family-members)  
**Security Features**: JWT tokens, password hashing, protected routes  
**Testing Method**: FastAPI interactive docs with manual token verification

## Tomorrow's Focus

**Backend Polishing Session**: Input validation and professional error handling
- Pydantic field validation for robust data quality
- HTTP status codes and user-friendly error messages  
- Additional family-focused endpoints

## Reflection

Building authentication from scratch gave me deep appreciation for security complexity. Every login system I use daily involves these same patterns - token generation, validation, protected resources. 

**Confidence Level**: Jumped from 4/10 to 7/10 in building secure APIs. Successfully debugging the hash compatibility issue and choosing the right OAuth2 approach felt like real developer problem-solving.

**Next Milestone**: Once backend validation is solid, I'll connect a React frontend to this API and see the complete authentication flow in action.

---

*This learning journal is part of my 6-month journey to become a full-stack developer, building a private family journal application from scratch.*