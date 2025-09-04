---
title: "Day 5 1/2: Authorization Logic in Oso Pattern"
pubDate: 2025-06-06
tags: ["FastAPI", "Private-social", "CircleShare", "Authorization"]
---

Today I took a bit of detour to revisit the Authorization logic. There are a lot of lines of code!

Is there a simpler way to define the role or the relationship between users, so we know who has access to what more clear and easily.

It was such a beautiful moment that when I was struggling about simplifying the auth logic, I got approached by Oso's recruiter. (The interview didn't go well sadly). But that got me interested in learning about what Oso is.

## What is Oso and Why Use Authorization Patterns?

**Oso** is a batteries-included framework for building authorization in your application. Instead of scattering permission checks throughout your code, Oso lets you define authorization policies in one place and query them consistently.

In this tutorial, I'll show you how I built authorization for **CircleShare**, a private social app where users create circles and share posts with close friends and family.

## The Authorization Challenge

In CircleShare, we needed these permissions:

- Only circle creators can invite new members
- Only circle creators can remove members
- Circle creators can delete their circle (which removes all members)
- Members can leave circles (but not delete them)
- Only circle members can create posts in that circle
- Post authors and circle owners can delete posts

Traditional approach would scatter `if` statements everywhere:

```python
# Authorization logic scattered everywhere
if circle.creator_id != current_user.id:
    raise HTTPException(403, "Only circle creator can invite")

if post.author_id != current_user.id and circle.creator_id != current_user.id:
    raise HTTPException(403, "Cannot delete this post")
```

## Step 1: Project Structure

Here's how I organized the Oso authorization pattern:

```
app/
├── auth/
│   ├── oso_patterns/
│   │   ├── __init__.py
│   │   ├── policy_engine.py          # Main policy engine
│   │   ├── models/
│   │   │   └── policy_rule.py        # Policy rule definitions
│   │   ├── policies/
│   │   │   └── circle_policies.py    # Circle-specific policies
│   │   └── conditions/
│   │       └── relationship_conditions.py  # Reusable conditions
│   └── custom_auth.py                # JWT authentication
├── models.py                         # Database models
└── main.py                          # FastAPI endpoints
```

## Step 2: Define Policy Rules

First, I created a `PolicyRule` class to represent authorization rules:

```python
# app/auth/oso_patterns/models/policy_rule.py
from typing import Any, Dict, Callable
from dataclasses import dataclass

@dataclass
class PolicyRule:
    """Represents a single authorization rule"""
    resource_type: str
    action: str
    condition: Callable[[Any, Any], bool]
    description: str = ""

    def applies_to(self, resource_type: str, action: str) -> bool:
        """Check if this rule applies to the given resource and action"""
        return (self.resource_type == resource_type and
                self.action == action)

    def evaluate(self, user: Any, resource: Any) -> bool:
        """Evaluate if the user can perform the action on the resource"""
        try:
            return self.condition(user, resource)
        except Exception:
            return False
```

## Step 3: Create Reusable Conditions

Instead of writing the same permission logic repeatedly, I created reusable condition functions:

```python
# app/auth/oso_patterns/conditions/relationship_conditions.py
from typing import Any

def is_circle_creator(user: Any, circle: Any) -> bool:
    """Check if user is the creator of the circle"""
    return circle.creator_id == user.id

def is_circle_member(user: Any, circle: Any) -> bool:
    """Check if user is a member of the circle"""
    return user in circle.members

def is_post_author(user: Any, post: Any) -> bool:
    """Check if user is the author of the post"""
    return post.author_id == user.id

def is_post_circle_creator(user: Any, post: Any) -> bool:
    """Check if user is the creator of the circle where the post was made"""
    return post.circle.creator_id == user.id

def can_delete_post(user: Any, post: Any) -> bool:
    """Check if user can delete the post (author OR circle owner)"""
    return is_post_author(user, post) or is_post_circle_creator(user, post)
```

## Step 4: Define Circle Policies

Now I could compose these conditions into clear, readable policies:

```python
# app/auth/oso_patterns/policies/circle_policies.py
from ..models.policy_rule import PolicyRule
from ..conditions.relationship_conditions import (
    is_circle_creator, is_circle_member, can_delete_post
)

# Circle management policies
CIRCLE_POLICIES = [
    PolicyRule(
        resource_type="Circle",
        action="invite_members",
        condition=is_circle_creator,
        description="Only circle creators can invite new members"
    ),

    PolicyRule(
        resource_type="Circle",
        action="remove_members",
        condition=is_circle_creator,
        description="Only circle creators can remove members"
    ),

    PolicyRule(
        resource_type="Circle",
        action="leave_circle",
        condition=lambda user, circle: (
            is_circle_creator(user, circle) or is_circle_member(user, circle)
        ),
        description="Creators can delete circle, members can leave"
    ),

    PolicyRule(
        resource_type="Post",
        action="delete",
        condition=can_delete_post,
        description="Post authors and circle owners can delete posts"
    ),

    PolicyRule(
        resource_type="Circle",
        action="create_post",
        condition=is_circle_member,
        description="Only circle members can create posts"
    )
]
```

## Step 5: Build the Policy Engine

The policy engine ties everything together and provides a clean API:

```python
# app/auth/oso_patterns/policy_engine.py
from typing import List, Any
from .models.policy_rule import PolicyRule
from .policies.circle_policies import CIRCLE_POLICIES
from ..custom_auth import AccessDenied

class PolicyEngine:
    """Main policy engine for authorization decisions"""

    def __init__(self):
        self.rules: List[PolicyRule] = []
        self._load_policies()

    def _load_policies(self):
        """Load all policy rules"""
        self.rules.extend(CIRCLE_POLICIES)

    def is_authorized(self, user: Any, action: str, resource: Any) -> bool:
        """Check if user is authorized to perform action on resource"""
        resource_type = resource.__class__.__name__

        # Find applicable rules
        applicable_rules = [
            rule for rule in self.rules
            if rule.applies_to(resource_type, action)
        ]

        if not applicable_rules:
            # No rules defined = deny by default
            return False

        # Evaluate all applicable rules (any rule can grant access)
        return any(rule.evaluate(user, resource) for rule in applicable_rules)

    def require_authorization(self, user: Any, action: str, resource: Any):
        """Require authorization or raise AccessDenied exception"""
        if not self.is_authorized(user, action, resource):
            raise AccessDenied()

    def get_rules_for_resource(self, resource_type: str) -> List[PolicyRule]:
        """Get all rules for a specific resource type"""
        return [rule for rule in self.rules if rule.resource_type == resource_type]

# Global policy engine instance
policy_engine = PolicyEngine()
```

## Step 6: Using Authorization in Endpoints

Now I could use clean, readable authorization in my FastAPI endpoints:

```python
# app/main.py
from .auth.oso_patterns.policy_engine import policy_engine

@app.post("/circles/{circle_id}/invite")
async def invite_user_to_circle(
    circle_id: int,
    invitee_data: Invitee,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    circle = db.get(Circle, circle_id)
    if not circle:
        raise CircleNotFound()

    # Clean authorization check
    policy_engine.require_authorization(current_user, "invite_members", circle)

    # Business logic continues...
    invitee = db.query(User).filter(User.email == invitee_data.email).first()
    if not invitee:
        raise UserNotFound()

    circle.members.append(invitee)
    db.commit()

    return {"message": f"Added {invitee.name} to {circle.name}"}

@app.delete("/posts/{post_id}")
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    post = db.query(Post).filter(Post.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Authorization with clear intent
    policy_engine.require_authorization(current_user, "delete", post)

    db.delete(post)
    db.commit()

    return {"message": "Post deleted successfully"}
```

## Benefits of This Approach

### 1. **Centralized Authorization Logic**

All permission rules live in one place, making them easy to audit and modify.

### 2. **Reusable Conditions**

Common patterns like "is_creator" can be reused across different resources.

### 3. **Clear Intent**

`policy_engine.require_authorization(user, "invite_members", circle)` clearly expresses what's being checked.

### 4. **Easy Testing**

You can unit test authorization logic independently from business logic.

### 5. **Flexible Policies**

Adding new permissions is as simple as adding new `PolicyRule` objects.

## Testing Your Authorization

Here's how you can test your policies:

```python
# test_authorization.py
import pytest
from app.auth.oso_patterns.policy_engine import policy_engine

def test_circle_creator_can_invite():
    # Setup test data
    creator = User(id=1, name="Alice")
    member = User(id=2, name="Bob")
    circle = Circle(id=1, creator_id=1, name="Test Circle")

    # Test authorization
    assert policy_engine.is_authorized(creator, "invite_members", circle) == True
    assert policy_engine.is_authorized(member, "invite_members", circle) == False

def test_post_deletion_permissions():
    author = User(id=1, name="Alice")
    circle_owner = User(id=2, name="Bob")
    random_user = User(id=3, name="Carol")

    circle = Circle(id=1, creator_id=2, name="Bob's Circle")
    post = Post(post_id=1, author_id=1, circle=circle)

    # Author can delete their own post
    assert policy_engine.is_authorized(author, "delete", post) == True

    # Circle owner can delete posts in their circle
    assert policy_engine.is_authorized(circle_owner, "delete", post) == True

    # Random users cannot delete posts
    assert policy_engine.is_authorized(random_user, "delete", post) == False
```

## Advanced: Custom Exception Handling

You can create custom exceptions for better error messages:

```python
# app/exceptions.py
class AccessDenied(Exception):
    def __init__(self, message: str = "Access denied"):
        self.message = message
        super().__init__(self.message)

# app/error_handlers.py
from fastapi import Request
from fastapi.responses import JSONResponse

async def access_denied_handler(request: Request, exc: AccessDenied):
    return JSONResponse(
        status_code=403,
        content={
            "type": "access_denied",
            "message": exc.message,
            "timestamp": datetime.now().isoformat()
        }
    )
```

## Conclusion

This Oso-inspired pattern gave me:

- **Clean separation** between authorization and business logic
- **Reusable permission components** across different features
- **Easy-to-read policies** that non-programmers can understand
- **Centralized security** that's easy to audit and modify
- **Testable authorization** independent of database calls

The key insight is treating authorization as **data** (policy rules) rather than **code** (scattered if statements). This makes your security model much more maintainable and flexible as your application grows.

Whether you're building a social app, SaaS platform, or any application with complex permissions, this pattern scales beautifully from simple "owner-only" rules to sophisticated role-based access control.

👉 **[CircleShare on GitHub](https://github.com/yourusername/circleshare)**  
