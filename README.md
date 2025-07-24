

```markdown
# AuthLite

![License](https://img.shields.io/badge/license-MIT-green)
![Platform](https://img.shields.io/badge/platform-Node.js%20%7C%20Express%20%7C%20React-blue)
![Status](https://img.shields.io/badge/status-active-brightgreen)

**AuthLite** یک الگوی ساده و مدرن برای ساخت اپلیکیشن‌هایی است که نیاز به سیستم احراز هویت دارند. این پروژه به صورت فول‌استک طراحی شده (Front-end: React + Vite | Back-end: Express.js + TypeScript) و چندین روش ورود کاربر را پشتیبانی می‌کند:  
- ورود با ایمیل  
- ورود با شماره موبایل  
- ورود با Google OAuth

---

## 📁 ساختار پروژه

```

AuthLite/
├── ui  /                # رابط کاربری (React + Vite)
├── api /               # بک‌اند (Express + TypeScript)
├── .env.example            # فایل نمونه متغیرهای محیطی
└── README.md

````

---

## 🚀 ویژگی‌ها

- ✅ احراز هویت با شماره موبایل و کد تأیید (OTP)
- ✅ احراز هویت با ایمیل و کلمه عبور
- ✅ ورود با Google (OAuth2)
- ✅ نگهداری Session با JWT
- ✅ ساختار ماژولار و توسعه‌پذیر
- ✅ پشتیبانی از TypeScript در سرور
- ✅ رابط کاربری ساده و قابل توسعه با TailwindCSS

---

## ⚙️ نحوه راه‌اندازی

### 1. کلون کردن پروژه

```bash
git clone https://github.com/mehdi-eti/AuthLite.git
cd AuthLite
````

### 2. نصب وابستگی‌ها

#### 📦 برای سرور:

```bash
cd api
npm install
```

#### 💻 برای کلاینت:

```bash
cd ../ui
npm install
```

### 3. تنظیم فایل‌های محیطی

* در هر دو پوشه‌ی `ui/` و `api/` فایل `.env.example` را کپی کرده و به `.env` تغییر نام دهید.
* مقادیر مناسب برای Google OAuth، JWT\_SECRET، SMS/Email providers و ... را وارد کنید.

---

## ▶️ اجرای پروژه

### سرور:

```bash
cd server
npm run dev
```

### کلاینت:

```bash
cd client
npm run dev
```

---

## 🛡️ وابستگی‌های مهم

### Backend:

* [Express.js](https://expressjs.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [JWT](https://jwt.io/)
* [Google OAuth2](https://developers.google.com/identity)
* [Zod](https://zod.dev/) (برای اعتبارسنجی داده‌ها)

### Frontend:

* [React](https://reactjs.org/)
* [Vite](https://vitejs.dev/)
* [TailwindCSS](https://tailwindcss.com/)
* [React Hook Form](https://react-hook-form.com/)

---

## 🔒 امنیت

AuthLite از بهترین روش‌های روز برای احراز هویت ایمن بهره می‌برد:

* رمزنگاری کلمات عبور با bcrypt
* استفاده از JWT برای مدیریت session
* محدودیت تعداد درخواست OTP
* محافظت در برابر حملات Brute Force

---

## 📌 TODOs

* [ ] پنل مدیریت کاربران
* [ ] ارسال ایمیل با nodemailer
* [ ] اتصال به درگاه پیامک (Kavenegar, SMS.ir, ...)
* [ ] ریسپانسیو کردن رابط کاربری
* [ ] اضافه کردن تست‌های واحد

---

## 👨‍💻 توسعه‌دهنده

* [Mehdi Eti](https://github.com/mehdi-eti).
