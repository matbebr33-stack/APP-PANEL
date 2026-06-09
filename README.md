# 🛡️ نظام المعتمدين - لوحة التحكم

نظام متقدم لإدارة المعتمدين مع لوحة تحكم احترافية وبدون خدمة سحابية خارجية.

## 📁 هيكل المشروع

```
APP-PANEL/
├── index.html              # الصفحة الرئيسية
├── admin.html              # صفحة لوحة الأدمن
├── README.md              # هذا الملف
│
├── css/
│   └── style.css          # جميع الأنماط (1472 سطر)
│
├── js/
│   ├── app.js             # تطبيق الصفحة الرئيسية
│   └── admin.js           # تطبيق لوحة الأدمن
```

## ✨ الميزات

### 📊 الصفحة الرئيسية
- ✅ لوحة تحكم احترافية
- ✅ عرض إحصائيات الأعضاء
- ✅ إدارة المعتمدين والمخالفات
- ✅ نظام الرتب (CA, CB, CD)
- ✅ عرض القوانين والأنظمة
- ✅ بحث وتصفية متقدمة

### 🔐 لوحة الأدمن
- ✅ تسجيل دخول آمن
- ✅ تعديل بيانات النظام
- ✅ إدارة الإحصائيات
- ✅ حفظ البيانات (محلي أو Firebase)
- ✅ واجهة سهلة الاستخدام

### � حفظ البيانات
- ✅ حفظ البيانات محلياً باستخدام localStorage
- ✅ دعم إدارة النظام بدون خدمات سحابية خارجية

## 🚀 كيفية الاستخدام

### 1. فتح الصفحة الرئيسية
```
http://localhost:PORT/index.html
```
أو افتح الملف مباشرة في المتصفح:
```
file:///path/to/APP-PANEL/index.html
```

### 2. الدخول إلى لوحة الأدمن
- انقر على **دخول الأدمن 🔐** من الشريط الجانبي
- أو اذهب مباشرة إلى: `admin.html`

### 3. بيانات الدخول الافتراضية
**الوضع المحلي:**
- المستخدم: `admin`
- كلمة السر: `admin123`

**Firebase:**
- استخدم بريدك الإلكتروني وكلمة السر المسجلة

## 📝 تعديل كلمة السر

### الوضع المحلي
ادتح `js/admin.js` وعدل السطر:
```javascript
adminPassword: 'admin123'  // غير هنا
```

### Firebase
تم تكوين Firebase بالفعل. لتغيير كلمة السر:
1. اذهب إلى [Firebase Console](https://console.firebase.google.com)
2. انتقل إلى Authentication
3. أضف مستخدماً جديداً أو عدل الموجود

## 🔗 Firebase التكامل

### استخدام Firebase CDN (الأسهل)
```html
<!-- أضف هذا في admin.html -->
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"></script>
<script src="js/firebase-cdn.js"></script>
```

### الدوال المتاحة

#### Authentication
```javascript
// تسجيل الدخول
const result = await FirebaseAuth.login(email, password);

// إنشاء حساب
const result = await FirebaseAuth.register(email, password);

// تسجيل الخروج
await FirebaseAuth.logout();

// الاستماع إلى تغييرات المستخدم
FirebaseAuth.onAuthStateChanged(user => {
  if (user) console.log('مرحباً:', user.email);
});
```

#### Firestore
```javascript
// إضافة بيانات
const result = await FirestoreDB.addData('members', {
  name: 'أحمد',
  rank: 'CA'
});

// الحصول على البيانات
const result = await FirestoreDB.getData('members');

// تحديث البيانات
await FirestoreDB.updateData('members', 'docId', { rank: 'CB' });

// حذف البيانات
await FirestoreDB.deleteData('members', 'docId');

// الاستماع للتغييرات الحية
FirestoreDB.listenToCollection('members', (data) => {
  console.log('تم التحديث:', data);
});
```

## 🎨 الألوان والثيم

تم استخدام نظام ألوان احترافي:
- 🟡 ذهبي (`#D4AF37`) - الألوان الأساسية
- 🔵 أزرق (`#3B82F6`) - الأزرار والتفاعلات
- 🟢 أخضر (`#22C55E`) - النجاح والموافقة
- 🔴 أحمر (`#EF4444`) - الأخطاء والتحذيرات
- 🟣 بنفسجي (`#A855F7`) - الرتبة CA

## 📱 التوافقية

- ✅ الهواتف الذكية
- ✅ الأجهزة اللوحية
- ✅ أجهزة الكمبيوتر
- ✅ جميع المتصفحات الحديثة

## 🔒 الأمان

### نصائح الأمان
1. غير كلمة السر الافتراضية
2. استخدم HTTPS في الإنتاج
3. قم بتعيين قواعل Firestore بشكل صحيح
4. لا تشارك Firebase credentials

### قواعس Firestore الموصى بها
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## 🛠️ التطوير

### إنشاء صفحة جديدة
1. أنشئ `.html` في الجذر
2. أضف `<link rel="stylesheet" href="css/style.css">`
3. استخدم الفئات المتاحة من CSS

### إضافة دالة جديدة
1. أضفها في `js/firebase-cdn.js` أو `js/firebase-config.js`
2. استدعها من HTML أو ملفات JS أخرى

## 📊 مثال: إضافة عضو جديد

```javascript
// في لوحة الأدمن
const result = await FirestoreDB.addData('members', {
  name: 'محمد احمد',
  code: '003',
  rank: 'CB',
  status: 'نشط',
  joinDate: new Date().toISOString()
});

if (result.success) {
  console.log('تم إضافة العضو برقم:', result.id);
}
```

## 🐛 حل المشاكل الشائعة

| المشكلة | الحل |
|--------|------|
| Firebase is not defined | تأكد من تضمين Firebase SDK قبل firebase-cdn.js |
| CORS error | تحقق من إعدادات CORS في Firebase |
| Permission denied | راجع قواعل Firestore |
| البيانات لا تظهر | تحقق من اسم المجموعة (case-sensitive) |

## 📞 الدعم

للمزيد من المعلومات:
- 📖 [README.md](./README.md)
- 💬 [Stack Overflow](https://stackoverflow.com)

## 📄 الترخيص

هذا المشروع مفتوح المصدر ومتاح للاستخدام الحر.

---

**آخر تحديث:** 09/06/2026
**الإصدار:** v2.1.0
