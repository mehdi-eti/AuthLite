# AuthLite

![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Node.js%20%7C%20Express%20%7C%20React-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)

**AuthLite** یک الگوی ساده، مدرن و ماژولار برای راه‌اندازی سریع سیستم احراز هویت در اپلیکیشن‌های فول‌استک است. این پروژه با استفاده از React در سمت کاربر و ExpressJS + TypeScript در سمت سرور طراحی شده و چندین روش ورود را پشتیبانی می‌کند:

- ورود با ایمیل و رمز عبور  
- ورود با شماره موبایل و کد تأیید (OTP)  
- ورود با Google OAuth2

---

## 📁 ساختار پروژه

```
AuthLite/
├── ui/                  # رابط کاربری (React + Vite)
├── api/                 # بک‌اند (Express + TypeScript)
├── .env.example         # فایل نمونه متغیرهای محیطی
└── README.md
```

---

## 🚀 ویژگی‌ها

- ✅ احراز هویت با شماره موبایل و کد تأیید (OTP)
- ✅ احراز هویت با ایمیل و کلمه عبور
- ✅ ورود با Google (OAuth2)
- ✅ نگهداری session با JWT
- ✅ ساختار ماژولار و مقیاس‌پذیر
- ✅ رابط کاربری با طراحی تمیز و TailwindCSS
- ✅ توسعه‌یافته با TypeScript (در سرور)

---

## ⚙️ نحوه راه‌اندازی

### 1. کلون کردن مخزن

```bash
git clone https://github.com/mehdi-eti/AuthLite.git
cd AuthLite
```

### 2. نصب وابستگی‌ها

#### 🔧 سرور (Express API):

```bash
cd api
npm install
```

#### 💻 کلاینت (React UI):

```bash
cd ../ui
npm install
```

### 3. تنظیم متغیرهای محیطی

در هر دو دایرکتوری `ui/` و `api/`، فایل `.env.example` را کپی کرده و به `.env` تغییر نام دهید:

```bash
cp .env.example .env
```

سپس مقادیر لازم را برای موارد زیر وارد کنید:

- Google OAuth Client ID و Secret  
- JWT_SECRET  
- اطلاعات درگاه ارسال پیامک یا ایمیل

---

## ▶️ اجرای پروژه

### اجرای سرور:

```bash
cd api
npm run dev
```

### اجرای کلاینت:

```bash
cd ../ui
npm run dev
```

---

## 🧰 وابستگی‌های کلیدی

### Backend:

- [Express.js](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [JWT](https://jwt.io/)
- [Google OAuth2](https://developers.google.com/identity)
- [Zod](https://zod.dev/) – اعتبارسنجی داده‌ها
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js)

### Frontend:

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [React Hook Form](https://react-hook-form.com/)
- [Axios](https://axios-http.com/)

---

## 🔒 امنیت

AuthLite با رعایت استانداردهای روز امنیتی طراحی شده است:

- رمزنگاری کلمات عبور با `bcrypt`
- مدیریت session ایمن با JWT
- محدودیت ارسال OTP برای جلوگیری از اسپم
- ساختار دفاعی در برابر حملات Brute Force

---

## 📌 TODO

- [ ] افزودن پنل مدیریت کاربران
- [ ] اتصال ایمیل با nodemailer
- [ ] اتصال به درگاه پیامک (مثل Kavenegar یا SMS.ir)
- [ ] افزودن تست‌های واحد و یکپارچه
- [ ] بهبود طراحی UI و سازگاری با موبایل

---

## 👨‍💻 توسعه‌دهنده

- [Mehdi Eti](https://github.com/mehdi-eti)

---

## 📄 لایسنس

این پروژه تحت [MIT License](LICENSE) منتشر شده است.
