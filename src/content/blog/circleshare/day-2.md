---
title: "Day 2: Database Design & Persistence"
pubDate: 2025-06-02
tags: ["FastAPI", "Private-social", "CircleShare", "SQLAlchemy", "ORM", "Model", "Schemas"]
---

Yesterday I had my first endpoints running, and FastAPI’s auto-generated docs made it feel like magic. But then I hit restart on the server… and everything was gone.  

Every journal entry I’d “created” in the docs Vanished. My API was basically a sketchpad. Fun to doodle on, but one press of the reset button and you’re back to a blank canvas.  

That’s when it hit me: an API without a database is like a chat app that forgets the conversation as soon as you close the window. Nice demo, but useless for real life.  

## Why We Need Databases  

Here’s how I think of it:  

- **API** = the waiter at a restaurant. You tell them what you want (a GET, a POST, etc.), and they bring something back.  
- **Database** = the kitchen. It’s where the actual work happens and where the recipes (data) live.  

If the waiter takes your order but the kitchen throws away every recipe at the end of the night, you’d show up tomorrow and nothing would be remembered. That was my API on Day 1.  

For CircleShare, that’s unacceptable. If I post “Jamie’s first day of school” to my timeline, that post has to be there tomorrow, next week, next year. The whole point is to build a living timeline for my inner circle.  

## Enter SQLAlchemy  

Now, I could write raw SQL statements (the “language” of databases). But I’m still learning, and SQLAlchemy makes the whole process much friendlier.  

Think of SQLAlchemy as a translator: I write Python classes, and SQLAlchemy turns them into SQL commands behind the scenes. Instead of juggling strings of SQL code, I’m just working with objects in Python.  

That means I can:  
- Define what my data *looks like* in one place (users, posts, comments).  
- Let SQLAlchemy handle creating tables, validating data types, and running queries.  
- Save data in a way that actually persists after server restarts.  

## Setting Up the Database  

I started simple: SQLite. No setup, no servers, just a single file on my computer that acts like a mini database. Perfect for learning.  

In `database.py`:  

```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite database URL - creates a file called circle_share.db
DATABASE_URL = "sqlite:///./circle_share.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

That little `circle_share.db` file is the difference between a forgetful sketchpad and a real journal.  

## Defining My First Model  

Here’s the first real “thing” I wanted CircleShare to remember: **users**.  

In `models.py`:  

```python
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.sql import func
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
```

## The Mental Model: Classes = Tables  

This is where it really clicked for me.  

When you define a model in SQLAlchemy, you’re basically designing a **table** in your database. Each attribute becomes a **column**.  

So the `User` model above translates into a table like this:  
```
| id | name  | email             | hashed_password | created_at           |
|----|-------|-------------------|-----------------|----------------------|
| 1  | Sarah | sarah@example.com | a9fbc123...     | 2025-06-02 12:30:00  |
| 2  | Alex  | alex@example.com  | b7e8d456...     | 2025-06-02 12:45:00  |  
```

- **`id`**: A unique number for every user (primary key).  
- **`name`**: Their display name (can’t be empty).  
- **`email`**: Must be unique — no duplicate accounts.  
- **`hashed_password`**: The password, but safely stored as a hash.  
- **`created_at`**: A timestamp of when the user was created.  

That simple mindset — *“I’m just creating a table with columns”* — made the whole ORM thing way less intimidating.  

## Seeing It in Action  

After wiring everything up in `main.py`, I tested creating a user:  

```json
POST /users/
{
  "name": "Sarah",
  "email": "sarah@example.com",
  "password": "temporary123"
}
```

The response came back with an ID and timestamp. Then I restarted my server (bracing myself for disappointment) and called `GET /users/`.  

And there it was. Still there. Persisted.  

That was the moment I realized: *I just gave CircleShare a memory.*  

<!-- ## What I Learned Today  

- An API without a database is like a restaurant that throws away the recipes every night.  
- Databases give your app memory; SQLAlchemy makes them feel like regular Python objects.  
- Defining a model = designing a table, with each class attribute mapping to a column.  
- SQLite is a perfect starter, no setup, just a file that quietly does its job.  
- With just a few models, CircleShare now remembers who its users are.  

## What’s Next  

Right now, I’ve only set up user accounts. Tomorrow, I’ll connect authentication so people can actually log in securely. That means hashing passwords properly and building a login flow.  

For the first time, CircleShare doesn’t feel like a toy anymore. It remembers.   -->
