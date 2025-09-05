---
title: "Git Conflict Trainer CLI"
description: "Sandboxed CLI that teaches safe merge-conflict resolution with hands-on practice scenarios."
image: "../../assets/projects/git-trainer.png"
stack: ["Go", "CLI", "Git", "Docker"]
github: "https://github.com/peggiezx/git-conflict-trainer"
featured: false
---

# Git Conflict Trainer CLI

A command-line tool designed to help developers master merge conflict resolution through hands-on practice in a safe, sandboxed environment.

## Overview

Git conflicts can be intimidating for developers at any level. This CLI tool creates realistic conflict scenarios where you can practice resolution techniques without fear of breaking anything important.

## Key Features

- **Safe Practice Environment**: All conflicts are generated in isolated sandbox repositories
- **Progressive Difficulty**: Start with simple conflicts and work up to complex multi-file scenarios  
- **Real-World Scenarios**: Practice conflicts that mirror actual development situations
- **Instant Feedback**: Get immediate validation on your resolution techniques
- **Docker Integration**: Completely isolated environment using containerization

## Technical Implementation

Built with Go for cross-platform compatibility and performance. The tool uses Docker to create completely isolated Git repositories where conflicts are artificially generated based on common patterns found in real development workflows.

## Getting Started

```bash
# Install the CLI
go install github.com/peggiezx/git-conflict-trainer@latest

# Start with beginner scenarios
git-trainer start --level beginner

# Generate a specific type of conflict
git-trainer create --type merge-conflict --files 2
```

## Learning Outcomes

After working through the training scenarios, developers will be comfortable with:
- Understanding the anatomy of merge conflicts
- Using Git tools to visualize and resolve conflicts
- Implementing best practices for conflict resolution
- Collaborating effectively in team environments where conflicts are common