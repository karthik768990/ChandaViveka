# 🕉️ Chanda Viveka

**Chanda Viveka** is an intelligent Sanskrit *Chandas* (meter) identification platform that analyzes verses, detects their metrical structure, and classifies them accurately using syllable analysis and pattern recognition.

---

## ✨ Features

- 🔤 **Automatic Chandas Detection** — Analyzes Sanskrit verses and identifies their poetic meter  
- 🧩 **Syllable & Pada Segmentation** — Breaks down verses into syllables and padas for detailed analysis  
- ⚙️ **Pattern Matching Engine** — Matches syllabic patterns against a structured database of Chandas  
- 📊 **Confidence-Based Identification** — Provides probable matches with confidence scores  
- 💫 **Modern Frontend** — Built using Vite + React + Tailwind CSS + Chakra UI  
- 🔐 **Secure Authentication** — Integrated with Supabase OAuth (Google login)  
- 🧠 **Fast & Accurate Backend** — Node.js + Express backend with Supabase as database  

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React (Vite), Tailwind CSS, Chakra UI, Framer Motion |
| **Backend** | Node.js, Express.js |
| **Database & Auth** | Supabase (PostgreSQL + OAuth) |
| **Other Tools** | ESLint, Prettier, Git, Vercel/Render for deployment |

---

## 📁 Project Structure


chanda-viveka/
├── backend/
│ ├── index.js
│ ├── routes/
│ ├── controllers/
│ └── utils/
├── frontend/
│ ├── src/
│ │ ├── pages/
│ │ ├── components/
│ │ ├── context/
│ │ └── App.jsx
│ └── vite.config.js
└── README.md


---

## 🚀 Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/karthik768990/ChandaViveka.git
cd ChandaViveka

```
## BackEnd setup
```bash
cd backend
npm install
npm run dev

```
The backend runs by default on http://localhost:3000

## FrontEnd setup

```bash
cd frontend
npm install
npm run dev

```


The frontend runs by default on http://localhost:5173


## Environment variables

Create a .env file in both backend and frontend folders.

### Backend .env
```bash

SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_api_key
PORT=3000

```

### Frontend .env
```bash

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```


## 🧠 How It Works

User logs in with Google via Supabase OAuth

The verse (śloka) is sent to the backend for analysis

The backend breaks it into syllables and generates a metrical pattern

The pattern is compared against stored Chandas in the database

The result is returned with a confidence score and detailed explanation

### Example :

### Input : 
```bash
    वसन्तिलीकालकुसुमप्रभे

```

```bash
Meter Identified: वसन्तिलिका (Vasantatilika)
Pattern: LLGGLGLLGGLGGLG
Confidence: 98%
Analysis:
- 4 Padas of equal length
- Each pada has 14 syllables
- Matches with Vasantatilika structure


```


## Author 

Karthik Tamarapalli — Project Lead & Developer





## 📁 Project Structure

