---
title: "Day 8: The N+1 Query Problem, and How I Fell Into It"
pubDate: 2025-06-10
tags: ["FastAPI", "SQLAlchemy", "Database", "CircleShare", "Performance"]
---
I was query the database to get the data I want. For example, I want to display all circles with their member counts. 
```
Alice's circle: 10 members
Bob's circle: 50 members 
Charlie's circle: 1 member
```
Naively, I will get all circles first, and then loop through each circle and find the member count.

It sounds logical, but it triggers the N+1 Query Problem if we go down with that logic.

## What is the N+1 Query Problem?  

The N+1 query problem happens when you:  
1. Fetch a list of items (**1 query**), then  
2. For each item, you fetch related data (**N queries**)  

That means you end up with **1 + N queries** instead of just 1 or 2. It’s easy to miss at first, but it kills performance as your data grows.  

## Visual Example: CircleShare  

Imagine I want to display all circles with their member counts.  

### BAD: The N+1 Problem  

```python
@app.get("/all-circles-bad")
async def get_all_circles_bad(db: Session = Depends(get_db)):
    # Query 1: Get all circles
    circles = db.query(Circle).all()
    
    result = []
    for circle in circles:  # If you have 100 circles...
        # Query 2-101: Runs for EACH circle
        member_count = db.query(CircleMember)\
            .filter(CircleMember.circle_id == circle.id)\
            .count()
        
        result.append({
            "name": circle.name,
            "member_count": member_count
        })
    
    return result
# Total = 1 + 100 = 101 queries 
```

### GOOD: Eager Loading  

```python
from sqlalchemy.orm import joinedload

@app.get("/all-circles-good")
async def get_all_circles_good(db: Session = Depends(get_db)):
    circles = db.query(Circle)\
        .options(joinedload(Circle.members))\
        .all()  # Just 1 query with JOIN
    
    return [
        {"name": c.name, "member_count": len(c.members)}
        for c in circles
    ]
# Total = 1 query 
```

## Real-World Example: Posts and Comments  

When I first built the timeline in CircleShare, I did this:  

### BAD: Timeline with N+1  

```python
@app.get("/timeline-bad")
async def get_timeline_bad(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    posts = db.query(Post).filter(Post.circle_id == current_user.circle_id).all()
    
    timeline = []
    for post in posts:  # Say 50 posts
        # Query for author
        author = db.query(User).filter(User.id == post.author_id).first()
        # Query for likes
        likes = db.query(Like).filter(Like.post_id == post.id).count()
        
        timeline.append({
            "content": post.content,
            "author_name": author.name,
            "likes": likes
        })
    
    return timeline
# Total = 1 + 50 + 50 = 101 queries 
```

### GOOD: Using Joins  

```python
from sqlalchemy import func

@app.get("/timeline-good")
async def get_timeline_good(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    posts_with_data = db.query(
        Post,
        User.name,
        func.count(Like.id).label('like_count')
    )\
    .join(User, User.id == Post.author_id)\
    .outerjoin(Like, Like.post_id == Post.id)\
    .filter(Post.circle_id == current_user.circle_id)\
    .group_by(Post.id, User.name)\
    .all()
    
    return [
        {"content": post.content, "author_name": author_name, "likes": like_count or 0}
        for post, author_name, like_count in posts_with_data
    ]
# Total = 1 query 
```

## My Original Pitfall  

I made this mistake in my own code:  

### Potential N+1  

```python
@app.get("/my-circle/members")
async def get_my_circle_members(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    circle = db.query(Circle).filter(Circle.creator_id == current_user.id).first()
    res = []
    for m in circle.members:  # If lazy loading, each loop may hit DB
        res.append(m)
    return res
```

### Better Version  

```python
@app.get("/my-circle/members")
async def get_my_circle_members(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    circle = db.query(Circle)\
        .options(joinedload(Circle.members))\
        .filter(Circle.creator_id == current_user.id)\
        .first()
    
    if not circle:
        raise HTTPException(status_code=404, detail="Circle not found")
    
    return circle.members  # Already loaded, no extra queries
```

## How to Detect N+1 Problems  

- **Enable SQL logging** in SQLAlchemy:  

```python
engine = create_engine("sqlite:///your.db", echo=True)
```  

- **Look for repeating queries** in logs:  

```sql
SELECT * FROM circles;
SELECT * FROM users WHERE circle_id = 1;
SELECT * FROM users WHERE circle_id = 2;
SELECT * FROM users WHERE circle_id = 3;
-- ↑ This pattern = N+1 problem!
```

- **Performance feels off**: if loading a simple list takes seconds, check your queries.  

## Prevention Strategies  

- **Eager loading**: use `joinedload()` or `selectinload()`  
- **Explicit joins**: fetch related data in one query  
- **Batch loading**: load IDs first, then fetch related records in bulk  
- **Caching**: cache frequently accessed relationships  

## Rule of Thumb  

**If you’re querying inside a loop, you probably have an N+1 problem.**  

Load everything you need up front, then work with the data in memory.  

## What I Learned  

- The N+1 query problem is easy to fall into — I did it in CircleShare.  
- It’s not just about speed; it’s about scaling.  
- SQLAlchemy gives you tools (`joinedload`, `selectinload`, joins) to fix it.  
- Once I spotted the pattern, the fix was straightforward: **don’t query inside loops**.  
