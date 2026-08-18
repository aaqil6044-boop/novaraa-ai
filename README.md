# Novaraa AI

An AI-powered productivity platform designed to bring multiple AI-assisted tools and conversational features into a single web application.

## Overview

Novaraa AI is a full-stack web application built to explore the development of AI-powered software using modern web technologies and Google's Gemini API.

The platform includes an AI chat interface along with a collection of AI-assisted tools for productivity, coding, studying, writing, and document processing.

## Features

* AI-powered chat
* Multiple AI-assisted productivity tools
* File upload and management
* AI-powered document processing
* Resume and ATS analysis
* Code review and code explanation
* SQL generation
* Study assistance
* Notes and flashcard generation
* MCQ generation
* Text translation
* OCR and image analysis
* User authentication
* Chat history
* Dashboard and usage information

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Node.js

### Database

* PostgreSQL
* Prisma ORM

### Authentication

* NextAuth

### AI

* Google Gemini API

### Development Tools

* Git
* GitHub
* VS Code

## Project Structure

```text
novaraa-ai/
├── app/
│   ├── api/
│   ├── chat/
│   ├── dashboard/
│   ├── files/
│   ├── login/
│   ├── profile/
│   ├── settings/
│   └── tools/
├── components/
├── hooks/
├── lib/
├── prisma/
├── public/
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have:

* Node.js
* npm
* PostgreSQL
* A Google Gemini API key

### Installation

Clone the repository:

```bash
git clone https://github.com/aaqil6044-boop/novaraa-ai.git
```

Enter the project directory:

```bash
cd novaraa-ai
```

Install dependencies:

```bash
npm install
```

Create a `.env.local` file and add the required environment variables.

Then start the development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:3000
```

## Environment Variables

The application requires environment variables for services such as:

* Database connection
* Google Gemini API
* Authentication

**Do not commit `.env` or `.env.local` files to the repository.**

## Current Status

Novaraa AI is an ongoing personal development project. Features and functionality are continuously being improved and expanded.

## Learning Goals

This project is being developed to gain practical experience in:

* Full-stack web development
* AI API integration
* Database-driven applications
* Authentication
* API development
* Cloud and AI technologies
* Building and organizing larger software projects

## Author

**K A Muhammad Aaqil**

Computer Science & Engineering Student
Bengaluru, India

* Email: [aaqil6044@gmail.com](mailto:aaqil6044@gmail.com)
* LinkedIn: Add your LinkedIn profile
