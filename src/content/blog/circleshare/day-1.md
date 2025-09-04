---
title: "Day 1: FastAPI Foundations & API Design"
pubDate: 2025-06-01
tags: ["FastAPI", "Private-social", "CircleShare"]
---

Today I started coding CircleShare with FastAPI. But before I dove in, I had to clear up something that confused me for *way* too long: **what are APIs really?**  

I’d read the definitions: *“Application Programming Interface…blah blah…”* but it always felt abstract.  

Then it hit me one morning while watching YouTube (as I often do):  

- `https://www.youtube.com/` → the homepage with video recommendations. That’s an **endpoint**.  
- `https://www.youtube.com/@MasterChefWorld` → my favorite channel. Another **endpoint**, this time returning content for a specific resource (MasterChef, a show that you'll definitely enjoy :P).  
- `https://www.youtube.com/results?search_query=pokemon` → when I search “pokemon,” that search term gets sent to YouTube’s backend as part of the request. The server replies with a page full of Pokémon videos.  

That’s when it clicked: **APIs are just breakdowns of tasks that define how you interact with an app.**   

You want it to do something (sending request). It finishes the task and let you know the results (returning response).

So in **CircleShare**, when I want to “talk to” my app, I need to think of those conversations as API endpoints.  

## Mapping Out CircleShare’s Conversations  

Before writing a single line of FastAPI code, I listed out the *actual conversations* I want CircleShare to handle. For an MVP (minimum viable product), here’s what I need:  

- **Posts**:  
  - *“I want to create a new post”* → `POST /posts/create`  
  - *“Show me all my posts so far”* → `GET /posts/my-days`  
  - *“Show me the timeline for my circle”* → `GET /my-circle/timeline`  

- **Circles & Members**:  
  - *“I want to see who’s in my circle”* → `GET /my-circle/members`  
  - *“I want to invite someone”* → `POST /my-circle/invite`  
  - *“I want to remove someone”* → `DELETE /my-circle/members/{user_id}`  
  - *“I want to leave a circle”* → `POST /circles/{circle_id}/leave`  

- **Interactions**:  
  - *“I like this post”* → `POST /posts/{post_id}/likes`  
  - *“I want to comment”* → `POST /posts/{post_id}/comments`  
  - *“Show me the comments”* → `GET /posts/{post_id}/comments`  

It’s basically taking the way we’d naturally talk (“show me my timeline,” “add my friend to the circle”) and turning them into RESTful verbs:  
- **GET** = look at something  
- **POST** = create something  
- **DELETE** = remove something  

This little exercise made the whole API design way less overwhelming. Instead of thinking *“I need to build a backend”*, I thought: *“I’m just teaching my app how to have these conversations.”*  

## First Step: My Very First Endpoint  

Now with that mindset, I bootstrapped a FastAPI project. In the backend folder:  

```
circle-share/
├── backend/
│   ├── main.py          # FastAPI app with endpoints
│   ├── schemas.py       # Data validation models
│   ├── venv/           # Virtual environment
```

Then I wrote my very first endpoint:  

```python
from fastapi import FastAPI

app = FastAPI(title="CircleShare API")

@app.get("/")
async def health_check():
    return {"message": "Hey! CircleShare is alive and kicking!"}
```

When I ran `uvicorn main:app --reload` and hit `http://localhost:8000`, seeing that JSON `{"message": "Hey! CircleShare is alive and kicking!"}` pop up in my browser gave me the biggest grin.  

I wasn’t just writing Python anymore. I was building a *real* API.  

## Adding Real Data: My First Journal Entry  

Next, I wanted to try sending actual data to my API. I made a schema with Pydantic:  

```python
from pydantic import BaseModel
import datetime

class JournalEntry(BaseModel):
    title: str
    content: str
    date: datetime.date
```

Then I added a POST endpoint to create a journal entry:  

```python
from fastapi import FastAPI
from schemas import JournalEntry

app = FastAPI(title="CircleShare API")

@app.post("/create-entry")
async def create_journal_entry(entry: JournalEntry):
    return {
        "message": "Got your journal entry!",
        "title": entry.title,
        "preview": entry.content[:50] + "..." if len(entry.content) > 50 else entry.content,
        "date": str(entry.date)
    }
```

Now, when I went to `http://localhost:8000/docs`, FastAPI had auto-generated an interactive API tester. I could paste in a JSON like:  

```json
{
  "title": "Moved to Colorado!",
  "content": "Unpacked the last box today. It feels real now.",
  "date": "2025-06-01"
}
```

And boom — FastAPI validated it, sent back a clean response, and for the first time I felt like CircleShare had a pulse.  

## What I Learned Today  

- APIs aren’t abstract magic. They’re just conversations between you and your app, like YouTube URLs.  
- REST makes organizing these conversations logical: GET to read, POST to create, DELETE to remove.  
- Starting with a “health check” endpoint builds confidence.  
- Pydantic schemas are lifesavers for validation.  

## What’s Next  

Right now, my app forgets everything when I restart the server (entries live only in memory). Tomorrow, I’ll hook up a real database so CircleShare can *remember* — and the timelines will finally start to feel real.  
