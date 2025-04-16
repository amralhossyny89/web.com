const express = require('express');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const app = express();

// إعداد الجلسات (Session) - تحتاج لتكوين مناسب لتطبيقك
app.use(session({
  secret: 'your-secret-key', // مفتاح سري لتشفير ملفات تعريف الارتباط للجلسة
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // اجعلها true إذا كنت تستخدم HTTPS فقط
}));

// دالة للتحقق من المستخدم إذا كان مصادقًا
const isAuthenticated = (req, res, next) => {
  if (req.session.user) {
    return next();
  }
  res.redirect('/login'); // أو أي مسار تسجيل دخول آخر
};

app.use(express.json()); // لتمكين تحليل أجسام الطلبات JSON
app.use(express.urlencoded({ extended: true })); // لتمكين تحليل أجسام الطلبات URL-encoded

// إنشاء أو فتح قاعدة البيانات
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) {
    console.error("Database connection error:", err);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// إنشاء جدول المستخدمين إذا لم يكن موجودًا
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

app.post('/api/chat', isAuthenticated, async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await fetch("https://se7eneyes.org/api/hackergpt.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: userMessage
      })
    });

    const data = await response.json();

    // تأكد أن الـ API يرجع الرد في خاصية اسمها "reply" أو ما يعادلها
    res.json({ reply: data.reply || "No response from API." });

  } catch (error) {
    console.error("Error from external API:", error);
    res.status(500).json({ reply: "Error contacting external GPT API." });
  }
});

app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send("All fields are required.");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
      [username, email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(400).send("Email already registered.");
        }

        req.session.user = { id: this.lastID, username };
        res.redirect('/chat'); // تأكد أن هذا المسار موجود في تطبيقك
      }
    );
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).send("Server error during signup.");
  }
});

// مثال بسيط لصفحة تتطلب تسجيل الدخول
app.get('chat.html', isAuthenticated, (req, res) => {
  res.send(`مرحباً بك ${req.session.user.username} في صفحة الشات!`);
});

// مثال بسيط لصفحة تسجيل الدخول (تحتاج لإنشائها)
app.get('longin.html', (req, res) => {
  res.send('صفحة تسجيل الدخول هنا');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});