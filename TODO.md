<!-- @format -->

# 🔐 Clerk-style Auth System (React + ExpressJS + Prisma)

---

## ✅ فاز اول – طراحی اولیه و پایگاه داده

-    [x] طراحی ساختار جداول اولیه (User, Session, OAuthAccount, OTP, VerificationToken)
-    [x] تعریف role (USER, ADMIN, MODERATOR)
-    [x] اتصال Prisma به SQLite (با برنامه برای مهاجرت به PostgreSQL)
-    [x] ایجاد فایل‌های اولیه پروژه (`app.ts`, `routes`, `controllers`, `middlewares`)

---

## ✅ فاز دوم – پیاده‌سازی API پایه

### 🎯 Auth Routes

-    [x] `/auth/register` – ثبت‌نام با ایمیل/رمز عبور
-    [x] `/auth/login` – ورود و صدور access/refresh token
-    [x] `/auth/sessions` – ورود و صدور access/refresh token
-    [x] `/auth/sessions/:sessionId"` – حذف نشست
-    [x] `/auth/logout` – حذف نشست و کوکی ها
-    [x] `/auth/me` – دریافت اطلاعات کاربر
-    [x] `/auth/refresh` – صدور توکن جدید با refresh token

### 🔐 Email Verification

-    [x] تولید و ذخیره توکن تأیید ایمیل
-    [x] ارسال ایمیل تأیید (با لینک حاوی توکن)
-    [x] `/auth/verify-email` – تأیید ایمیل با توکن و کد
-    [x] جلوگیری از ورود قبل از تأیید ایمیل

---

## ✅ امنیت – پیاده‌سازی‌شده تا این لحظه

| ویژگی                                          | وضعیت | توضیحات                                 |
| ---------------------------------------------- | ------- | --------------------------------------- |
| ✅ JWT با امضای امن                            |  ✔️   | access/refresh با زمان انقضا جداگانه    |
| ✅ ذخیره refresh token در جدول Session         |  ✔️   | بررسی معتبر بودن توکن                   |
| ✅ HTTP-only Cookies                           |   ✔️  | ذخیره توکن‌ها با امنیت بالا             |
| ✅ حذف refresh token در logout                 | ✔️    | session-based logout                    |
| ✅ Rate Limiting                               | ✔️    | حداکثر ۵ بار درخواست resend در ۱۰ دقیقه |
| ✅ CAPTCHA (Google reCAPTCHA)                  |  ❌   | بررسی درخواست کاربر قبل از ارسال ایمیل  |
| ✅ محدودیت روزانه ارسال تأییدیه ایمیل          | ❌ | حداکثر ۵ بار در روز                     |
| ✅ پاسخ امن به کاربر (even if user not exists) | ✔️    | جلوگیری از email enumeration            |
| ✅ Token Rotation for Verification             | ✔️    | باطل‌سازی توکن‌های قبلی                 |
| ✅ حذف VerificationToken بعد از استفاده        | ✔️    | جلوگیری از reuse                        |
| ✅ ذخیره لاگ امنیتی (اختیاری)                  | ⏳    | تعریف جدول `AuditLog` در حال انجام      |

---

## 🔜 فاز سوم – پیاده‌سازی فرانت‌اند React

### 🔧 Auth Context

-    [ ] ایجاد `AuthProvider`, `useAuth()`
-    [ ] بررسی وضعیت کاربر با `/auth/me`
-    [ ] مدیریت ورود/خروج/توکن در فرانت

### 🧾 فرم‌ها

-    [ ] فرم `Login`, `Register`, `Verify Email`
-    [ ] ارسال `captchaToken` در درخواست‌ها
-    [ ] ProtectedRoute برای صفحات محافظت‌شده

---

## 🔜 فاز چهارم – امکانات پیشرفته

| ویژگی                                 | وضعیت | توضیح                                           |
| ------------------------------------- | ----- | ----------------------------------------------- |
| [ ] Google OAuth                      | ❌    | ورود با حساب Google (با Passport یا OAuth2 API) |
| [ ] Magic Link Login                  | ❌    | ورود فقط با کلیک روی لینک ایمیل                 |
| [ ] OTP Email Login                   | ❌    | ورود با کد ۶ رقمی ارسال‌شده به ایمیل            |
| [ ] Password Reset                    | ❌    | ارسال لینک/کد بازنشانی رمز عبور                 |
| [ ] تغییر رمز از داخل حساب            | ❌    | همراه با re-authentication                      |
| [ ] پنل مدیریت کاربران                | ❌    | لیست کاربران، نقش‌ها، حذف و بلاک                |
| [ ] حذف حساب کاربری                   | ❌    | حذف دستی یا زمان‌دار توسط کاربر                 |
| [ ] Token Rotation برای Refresh Token | ⏳    | جلوگیری از سرقت توکن در حملات XSS               |
| [ ] Multi-device Sessions             | ⏳    | مشاهده و حذف سشن‌های فعال از سایر دستگاه‌ها     |
