
# 🛠 Complaint Management System

## 📌 Features

### 🧑‍💼 Users
- Submit complaints
- View status of complaints 
- Delete/Update their complaints

### 👨‍💻 Admin
- View all user complaints
- Mark complaints as reviewed
- Simple login (name and ID based)

### 🛡️ Future Enhancements
- Role-based authentication using **JWT**
- Improved complaint filtering, sorting, and search

---

## 🧱 Tech Stack

| Tech           | Role                |
|----------------|---------------------|
| React          | Frontend (UI)       |
| Express.js     | Backend API         |
| SQL Server     | Database            |
| Axios          | API communication   |
| CSS            | Styling             |

---

## 🚀 Getting Started


#### 🔽 1. Clone the Repository

```bash
git clone https://github.com/Ali-Khan04/complaint-management-system.git
cd complaint-management-system
```

#### 🔧 2. Backend Setup (Express + SQL Server)

```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `backend/` directory and add your SQL Server configuration:
```env
DB_USER=your_sql_username
DB_PASSWORD=your_sql_password
DB_SERVER=localhost
DB_DATABASE=ComplaintDB
```
⚠️ **Important:** Make sure your **database name**, **table names**, and **column names** exactly match those used in the backend code. Otherwise, queries will fail.


Start the backend server:
```bash
npm run dev
```

The backend server will run on: **http://localhost:3000**

#### 💻 3. Frontend Setup (React)

```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Start the frontend server:
```bash
npm run dev
```

The frontend app will run on: **http://localhost:5173**

---


## 🎯 Usage

1. **Start both servers** (backend and frontend)
2. **Access the application** at `http://localhost:5173`
3. **Users** can register complaints and track their status
4. **Admins** can log in to review and manage complaints

---

