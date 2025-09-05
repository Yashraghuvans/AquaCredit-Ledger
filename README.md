# AquaCredit Ledger: A Blockchain-Based Blue Carbon Registry

![AquaCredit Ledger Banner](https://placehold.co/1200x300/1e293b/94a3b8?text=AquaCredit%20Ledger&font=inter)

AquaCredit Ledger is a decentralized platform designed to bring transparency, efficiency, and trust to blue carbon projects in India. By leveraging blockchain technology, we create an immutable and verifiable record of restoration efforts, from planting a mangrove to issuing carbon credits.

---

## 🚀 Tech Stack

- **Blockchain & Smart Contracts:**
  - ![Solidity](https://img.shields.io/badge/Solidity-E6E6E6?style=for-the-badge&logo=solidity&logoColor=black)
  - ![Polygon](https://img.shields.io/badge/Polygon-8247E5?style=for-the-badge&logo=polygon&logoColor=white)
  - ![Hardhat](https://img.shields.io/badge/Hardhat-2A2A2A?style=for-the-badge&logo=hardhat&logoColor=white)

- **Backend:**
  - ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
  - ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

- **Database & Storage:**
  - ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
  - ![IPFS](https://img.shields.io/badge/IPFS-65C2CB?style=for-the-badge&logo=ipfs&logoColor=white)

- **Frontend & Mobile:**
  - ![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
  - ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  - ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

---

## 📋 Getting Started

Follow these instructions to set up and run the entire project on your local machine for development and testing.

### 1. Prerequisites

Ensure you have the following software installed on your system:

- **Git:** [Installation Guide](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)  
- **Node.js & npm:** (v18 or higher recommended) [Installation Guide](https://nodejs.org/en/)  
- **React Native Environment:** Follow the official *React Native CLI Quickstart* for your OS.  
  [React Native Environment Setup Guide](https://reactnative.dev/docs/environment-setup)  
- **A Code Editor:** [Visual Studio Code](https://code.visualstudio.com/)  
- **(Optional) Docker:** [Installation Guide](https://www.docker.com/get-started/)

### 2. Clone the Repository

```bash
git clone https://github.com/Yashraghuvans/AquaCredit-Ledger.git
cd AquaCredit-Ledger
````

### 3. Setup Environment Variables

Each part of the monorepo requires its own environment variables.

* Copy `.env.example` → `.env` in `/contracts`, `/backend`, `/frontend-admin`, `/MobileApp`.
* Fill in required values (private keys, DB URLs, API keys, etc.).
* **Never commit `.env` files.**

### 4. Install Dependencies

```bash
# Smart Contracts
cd contracts && npm install && cd ..

# Backend
cd backend && npm install && cd ..

# Frontend Admin
cd frontend-admin && npm install && cd ..

# Mobile App
cd MobileApp && npm install && cd ..
```

---

## ▶️ Running the Project Locally

Run all four services (Blockchain, Backend, Frontend, Mobile) concurrently.

### Terminal 1: Local Blockchain

```bash
cd contracts
npx hardhat node
```

### Terminal 2: Deploy Smart Contracts

```bash
cd contracts
npx hardhat run --network localhost scripts/deploy.js
```

> Make sure `hardhat.config.js` is configured for `localhost`.

### Terminal 3: Backend Server

```bash
cd backend
npm run dev
```

### Terminal 4: Frontend Admin Dashboard

```bash
cd frontend-admin
npm start
```

Visit: [http://localhost:3000](http://localhost:3000)

### Terminal 5: Mobile App

```bash
cd MobileApp

# Android
npm run android

# iOS (macOS only)
npm run ios
```

---

## 📂 Project Structure

```
/aquacredit-ledger/
|
|--- /contracts/        # Solidity smart contracts
|--- /backend/          # Node.js/Express API Server
|--- /frontend-admin/   # React Admin Dashboard
|--- /MobileApp/        # React Native application
|--- /scripts/          # Deployment and utility scripts
|--- README.md          # Project README
```

---


## 📄 License

This project is licensed under the **MIT License**.
See the `LICENSE` file for details.


