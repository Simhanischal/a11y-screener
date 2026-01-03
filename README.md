# A11y Screener 🔍

A web app to screen your site for accessibility violations and generate AI powered code fixes.

* Front-end – Next 16 + Shadcn + Lucide Icons
* Syntax Highlighter - react-syntax-highlighter
* Code Diff - react-diff-viewer
* Accessibility Audit - axe-core
* Authentication - Auth0
* API – Next Route Handlers
* DB/ORM - Prisma ORM with Prisma Postgres
* LLM Model - Gemini 2.5 Flash (Free tier)
* LLM Integration - AI SDK from Vercel
* Deployment - Vercel

---

## Table of Contents
1. Features
2. Repository Layout
3. High-Level Architecture
4. Development Guide
5. Deployment Guide
6. Contributing & Coding Standards
7. License

---

## 1  Features
1. Fetch accessibility violations for a website 
2. Holistic view of violations details
3. AI-generated code fixes for violations (Gemini 2.5 Flash)
4. Store violations for a site in a DB for persistance (only for logged in users)
5. Track a site's progresss with history table (only for logged in users)
6. Secure authentication and authorization

---

## 2  Repository Layout
```
a11y-screener/
├─__tests__/                     # Unit tests
├─ app/                          # Next.js 16 source (app-router)
│  ├─ api/                       # Route handlers
│  ├─ components/                # Custom UI components
│  ├─ <page_name>/               # Page/Specific route folder
│  ├─ models/                    # Interfaces
│  └─ constants/                 # Constants and Enums
├─ public/                       # Public assets (Images)
├─ components/                   # Shadcn UI components
├─ lib/                          # Third party library (Auth0, Prisma and Tailwind) config files
├─ prisma/                       # Prisma schema and migrations
└─ .env                          # Environment file
```

---

## 3  High-Level Architecture (Todo)

<img width="598" height="249" alt="image" src="https://github.com/user-attachments/assets/b18064f9-83ca-4f15-83f0-8ba3db35f396" />

<img width="617" height="385" alt="image" src="https://github.com/user-attachments/assets/f4197405-4043-4049-9be1-052359d625f9" />

---

## 4  Development Guide

### 4.1 Prerequisites
• Node ≥ 20  
• Next = 16.1.0  
• React = 19.2.3 

### 4.2 Environment Variables
For local development,
```
NEXT_PUBLIC_BASE_URL=http://127.0.0.1:3000
APP_BASE_URLhttp://localhost:3000
GOOGLE_GENERATIVE_AI_API_KEY=<Create your own GEMINI API key at https://aistudio.google.com/api-keys>
AUTH0_DOMAIN=<Create your own Auth0 application at https://manage.auth0.com/dashboard>
AUTH0_CLIENT_ID=<Create your own Auth0 application at https://manage.auth0.com/dashboard>
AUTH0_CLIENT_SECRET=<Create your own Auth0 application at https://manage.auth0.com/dashboard>
AUTH0_SECRET=<Create your own Auth0 application at https://manage.auth0.com/dashboard>
DATABASE_URL=<Create your own Prisma DB at https://console.prisma.io/>
```

### 4.3 Running Local Dev server
```bash
yarn install
yarn dev          # http://localhost:3000
```

### 4.4 Tests
`yarn test`

---

## 5  Deployment Guide

### 5.1 CI/CD Overview
1. Pushing to feature branches triggers Vercel Preview Deployment
2. Pushing to `main` triggers Vercel Prod Deployment

### 5.2 Hosting
Vercel (`NEXT_PUBLIC_BASE_URL` and `APP_BASE_URL` to Vercel's/custom domain for the application)

---

## 7  Contributing & Coding Standards
1. Write suitable unit tests for the code changes
2. 🍃  Use conventional commits `feat:`, `fix:`, `docs:` to unlock auto-changelog.  
3. Contributions are welcome! Feel free to open an issue or submit a pull request if you have a way to improve this project. 
4. Make sure your request is meaningful and you have tested the app locally before submitting a pull request.

---

## 8  License
MIT © 2026 – A11y Screener Contributors

---

Happy screening ❤️
