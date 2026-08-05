<<<<<<< HEAD
# ais_v1
=======
# Aarya Raakh - Recruitment Agency Website

A modern, high-performance, iOS-inspired recruitment agency website built with **Next.js 14/15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Supabase**.

![Aarya Raakh Recruitment](public/hero-banner.jpg)

## 🌟 Key Features

* **iOS-Inspired Premium Design**: Glassmorphism, sleek blurred backdrops (`backdrop-blur-xl`), smooth curves (`rounded-2xl` & `rounded-3xl`), dynamic micro-interactions, dark mode, and ultra-fluid layout.
* **🎨 Live 10+ Color Palette Switcher (Dev & Admin Mode)**:
  * 1. **Sapphire Corporate** (Default Blue + Slate)
  * 2. **iOS Indigo & Lavender**
  * 3. **Emerald Executive**
  * 4. **Violet Luxe**
  * 5. **Midnight Obsidian**
  * 6. **Rose Quartz & Wine**
  * 7. **Sunset Amber & Coral**
  * 8. **Ocean Teal**
  * 9. **Monochromatic Slate**
  * 10. **Cyber Electric Blue**
* **Dynamic Job Board (`/jobs`)**: Real-time keyword search, multi-faceted filtering (Title, Location, Experience level, Employment type), pagination, empty state fallback.
* **Job Details & Application Form (`/jobs/[id]`)**: Full description, responsibilities, skill badges, salary range, floating "Apply Now" CTA with drag-and-drop file upload to Supabase Storage.
* **General Candidate Resume Bank Portal (`/resume-upload`)**: Direct registration form for job seekers wanting to enter the candidate database.
* **Protected Admin Dashboard (`/admin`)**:
  * Supabase Auth Login (`/admin/login`).
  * Dynamic counter cards: Total Jobs, Active Openings, Job Applications, Candidate Resume Bank Pool.
  * **Manage Jobs**: Add Job modal, Edit Job modal, Deactivate / Activate toggle switches, Delete confirmation dialog.
  * **Applications Manager**: View candidate applications per job, filter by title/name, direct resume file download.
  * **Resume Bank Search Engine**: Multi-field search (Skill, Experience, Preferred Role, Preferred Location), candidate profiles, direct download link.
* **Hybrid Data Service**: Works out-of-the-box in **Demo Mode** with seed data and transitions seamlessly to live **Supabase PostgreSQL & Storage**.

---

## 🔑 Login & Access Credentials

### Admin Portal Credentials (Demo Mode)

* **Admin Login URL**: `/admin/login` or `/admin`
* **Email**: `admin@aaryaraakh.com`
* **Password**: `Admin@12345`

---

## 🛠️ Tech Stack

* **Framework**: Next.js (App Router, Server & Client Components)
* **Language**: TypeScript
* **Styling**: Tailwind CSS + Custom CSS Variables
* **Icons**: Lucide React
* **Animations**: Framer Motion
* **Forms & Validation**: React Hook Form + Zod
* **Database & Auth & Storage**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
* **Notifications**: Sonner Toast Notifications

---

## 🚀 Setup & Installation

### 1. Prerequisites
Ensure Node.js 18+ is installed on your machine.

### 2. Clone & Install Dependencies
```bash
cd aarya-raakh-recruitment
npm install
```

### 3. Run Locally
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Supabase Backend Setup (Production Deployment)

1. Create a free project at [https://supabase.com](https://supabase.com).
2. Go to **SQL Editor** in your Supabase Dashboard.
3. Copy and run the entire contents of [`supabase/schema.sql`](supabase/schema.sql).
4. Go to **Project Settings -> API** and copy:
   * Project URL -> `NEXT_PUBLIC_SUPABASE_URL`
   * Anon Public Key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Paste these values into `.env.local` or environment variables in Netlify.
6. Create an Admin User in Supabase Auth (**Authentication -> Users**):
   * Email: `admin@aaryaraakh.com`
   * Password: `YourSecurePassword`

---

## 🌐 Netlify Deployment Guide

1. Push your code repository to GitHub/GitLab.
2. Sign in to Netlify -> **Add new site** -> **Import an existing project**.
3. Select your repository.
4. Build Settings:
   * **Build command**: `npm run build`
   * **Publish directory**: `.next`
5. Add Environment Variables in Netlify (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
6. Click **Deploy Site**.

---

## 📜 License

Copyright © 2026 **Aarya Raakh Recruitment Agency**. All rights reserved.
>>>>>>> 2e9461e (Initial commit: Aarya Raakh Recruitment Agency Website)
