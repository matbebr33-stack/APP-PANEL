# نظام المعتمدين - دليل Firebase

## نظرة عامة
تم ربط المشروع مع Firebase للحصول على:
- ✅ المصادقة (Authentication)
- ✅ قاعدة بيانات في الوقت الفعلي (Firestore)
- ✅ تحليلات (Analytics)

## ملفات Firebase

### 1. `js/firebase-config.js`
- **النوع**: ES6 Modules
- **الاستخدام**: إذا كنت تستخدم build tools مثل Webpack أو Vite
- **المميزات**: دوال متقدمة وتوافقية كاملة

```javascript
import { loginUser, addData, getData } from './firebase-config.js';

// تسجيل الدخول
const user = await loginUser('email@example.com', 'password');

// إضافة بيانات
const id = await addData('users', { name: 'أحمد' });

// الحصول على البيانات
const data = await getData('users');
```

### 2. `js/firebase-cdn.js`
- **النوع**: Vanilla JavaScript
- **الاستخدام**: للاستخدام المباشر في الـ HTML
- **المميزات**: لا تحتاج إلى build tools

```javascript
// تسجيل الدخول
const result = await FirebaseAuth.login('email@example.com', 'password');
if (result.success) {
  console.log('تم تسجيل الدخول:', result.user);
}

// إضافة بيانات
const addResult = await FirestoreDB.addData('users', { name: 'محمد' });

// الحصول على البيانات
const getResult = await FirestoreDB.getData('users');
```

## الإعداد

### الطريقة 1: استخدام CDN (الأسهل)

أضف هذه الأسطر في `</head>` قبل استخدام Firebase:

```html
<!-- Firebase SDK -->
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-auth.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-firestore.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.7.2/firebase-analytics.js"></script>

<!-- Firebase Config -->
<script src="js/firebase-cdn.js"></script>
```

ثم استخدم `FirebaseAuth` و `FirestoreDB` مباشرة.

### الطريقة 2: استخدام npm (متقدم)

```bash
npm install firebase
```

ثم استورد `firebase-config.js` في ملفاتك:

```javascript
import { loginUser, addData } from './firebase-config.js';
```

## أمثلة الاستخدام

### المصادقة

```javascript
// تسجيل دخول
const loginResult = await FirebaseAuth.login('admin@example.com', 'password123');
if (loginResult.success) {
  console.log('مرحباً:', loginResult.user.email);
}

// إنشاء حساب جديد
const registerResult = await FirebaseAuth.register('newuser@example.com', 'password123');

// تسجيل الخروج
await FirebaseAuth.logout();

// الاستماع إلى تغييرات المستخدم
FirebaseAuth.onAuthStateChanged(user => {
  if (user) {
    console.log('المستخدم متصل:', user.email);
  } else {
    console.log('المستخدم غير متصل');
  }
});
```

### إدارة البيانات

```javascript
// إضافة بيانات جديدة
const addResult = await FirestoreDB.addData('members', {
  name: 'أحمد',
  rank: 'CA',
  code: '001',
  status: 'نشط'
});

if (addResult.success) {
  console.log('تم إضافة العضو برقم:', addResult.id);
}

// الحصول على جميع البيانات
const getResult = await FirestoreDB.getData('members');
if (getResult.success) {
  console.log('الأعضاء:', getResult.data);
}

// الحصول على بيان واحد
const docResult = await FirestoreDB.getDocById('members', 'docId');

// تحديث بيانات
const updateResult = await FirestoreDB.updateData('members', 'docId', {
  rank: 'CB'
});

// حذف بيانات
const deleteResult = await FirestoreDB.deleteData('members', 'docId');

// الاستماع إلى التغييرات في الوقت الفعلي
FirestoreDB.listenToCollection('members', (data) => {
  console.log('تم تحديث البيانات:', data);
  // تحديث الواجهة الآن
});
```

## هيكل البيانات المقترح

### مجموعة `members` (الأعضاء)
```javascript
{
  name: "أحمد",
  code: "001",
  rank: "CA",
  status: "نشط",
  joinDate: timestamp,
  violations: 0
}
```

### مجموعة `violations` (المخالفات)
```javascript
{
  memberId: "docId",
  memberName: "أحمد",
  rank: "CA",
  description: "التصرف غير اللائق",
  date: timestamp,
  status: "قيد المراجعة"
}
```

### مجموعة `system_data` (بيانات النظام)
```javascript
{
  systemName: "نظام المعتمدين",
  version: "v2.1.0",
  lastUpdate: timestamp,
  totalMembers: 128
}
```

## الأخطاء الشائعة

### ❌ خطأ: "firebase is not defined"
**الحل**: تأكد من تضمين Firebase SDK قبل `firebase-cdn.js`

### ❌ خطأ: "CORS error"
**الحل**: تأكد من أن دومين المشروع مسموح في إعدادات Firebase

### ❌ خطأ: "Permission denied"
**الحل**: راجع قواعد Firestore في لوحة Firebase

## قواعس الأمان المقترحة

```javascript
// قواعد Firestore (في لوحة Firebase)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /members/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == request.auth.uid;
    }
    match /violations/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

## المراجع
- [Firebase Docs](https://firebase.google.com/docs)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

---

**ملاحظة**: استبدل بيانات Firebase Config بقيمك الخاصة إذا أنشأت مشروع جديد على Firebase.
