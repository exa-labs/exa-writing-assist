# Exa-powered Writing and Citation Assistant

This project demonstrates an advanced writing and citation assistant powered by Exa's prompt-engineered queries and Claude 3.5 Sonnet's generative capabilities. The assistant is designed to help users continue and expand their writing based on initial input.

![Conceptual block diagram of how the writing assistant works](https://files.readme.io/77dd3c1-image.png)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)

## Overview

The Exa-powered Writing and Citation Assistant combines the power of Exa's sophisticated query capabilities with Claude 3.5 Sonnet's advanced language model to create a tool that assists writers in generating content and managing citations seamlessly.

## Features

- Continuation of user-initiated writing
- Context-aware content generation
- Input debouncing to stop generating when a user pauses typing and kick off generation
- Automatic citation suggestions and management
- Integration of Exa's search capabilities for accurate and up-to-date information
- Powered by Claude 3.5 Sonnet for high-quality text generation

## How It Works

1. The user begins writing a piece of text.
2. The assistant analyzes the input using Exa's prompt-engineered queries to understand the context and gather relevant information.
3. Claude 3.5 Sonnet uses this context to generate continuation suggestions for the writing.
4. Exa's search capabilities are utilized to find and suggest relevant citations.
5. The generated content and citations are presented to the user for review and incorporation.

## Getting Started

To set up the project, follow these steps:

1. Clone the repository to your local machine.
2. Open a terminal and navigate to the project directory.
3. Run the command `npm install` to install the project dependencies.
4. Configure any necessary API keys for Exa and Claude.
5. Run the command `npm run dev` to start the project locally.

Now you're ready to use the writing and citation assistant!

If deploying to vercel or similar, ensure to remove our bespoke domain setup in next.config.mjs

---

For more information about Exa and Claude, please visit their respective websites:
- [Exa](https://exa.ai)
- [Anthropic (creators of Claude)](https://www.anthropic.com)


---

For more information about Exa and Claude, please visit their respective websites:
- [Exa](https://exa.ai)
- [Anthropic (creators of Claude)](https://www.anthropic.com)