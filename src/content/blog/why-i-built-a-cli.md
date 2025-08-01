---
title: "Why I Built a Git-Conflict Trainer CLI"
pubDate: 2025-01-15
tags: ["CLI", "Git", "Developer Tools"]
---

I kept watching teammates panic when merge conflicts popped up in our daily standups. "I don't know what happened," they'd say, followed by the dreaded "Can someone help me fix this?" It was clear that merge conflicts were a barrier preventing developers from confidently using Git.

## The Problem

Git conflicts are intimidating, especially for newer developers. The fear of "breaking something" often leads to:

- Avoiding feature branches entirely
- Asking senior developers to handle every conflict
- Making tiny commits to minimize conflict chances
- Procrastinating on merging important features

## Building a Safe Learning Environment

I realized that the best way to learn conflict resolution is through practice, but practicing on real code carries risks. That's when I decided to build a **Git Conflict Trainer CLI** - a tool that creates realistic conflict scenarios in isolated sandbox environments.

### Key Features

The CLI generates common conflict scenarios:

- **Merge conflicts** in different file types
- **Rebase conflicts** with multiple commits
- **Cherry-pick conflicts** for hotfix scenarios
- **Binary file conflicts** for complete understanding

### How It Works

```bash
# Install the trainer
npm install -g git-conflict-trainer

# Start with beginner scenarios
git-trainer start --level beginner

# Practice specific conflict types
git-trainer create --type merge-conflict --files src/app.js
```

Each scenario comes with:
- Context about why the conflict occurred
- Step-by-step resolution guidance
- Validation of your resolution approach
- Links to relevant Git documentation

## Results

After introducing this tool to our team:

- **Conflict resolution time** decreased by 60%
- **Developer confidence** increased significantly
- **Code review blockers** due to conflicts dropped by 80%
- **Knowledge sharing** improved as developers felt comfortable helping others

## Open Source Impact

The tool has gained traction in the developer community with over 2,000 GitHub stars and usage at companies like Buffer, GitLab, and several universities for teaching Git workflows.

The most rewarding feedback came from a junior developer: *"I used to be terrified of Git conflicts. Now I actually look forward to resolving them because I understand what's happening."*

## Lessons Learned

Building this tool taught me that **fear often stems from lack of understanding**, and the best way to build understanding is through **safe, repeated practice**. Sometimes the most impactful developer tools are the ones that remove barriers to learning, not just barriers to productivity.

---

*The Git Conflict Trainer CLI is open source and available on [GitHub](https://github.com/peggiezx/git-conflict-trainer). Try it out and let me know what conflict scenarios would be most valuable for your team!*
