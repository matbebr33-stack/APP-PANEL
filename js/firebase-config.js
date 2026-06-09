// ════════════════ FIREBASE CONFIGURATION ════════════════

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDPiKLcmWCseDMPkYeCFzj0a7ykpxlyfPQ",
  authDomain: "app-panel-f3795.firebaseapp.com",
  projectId: "app-panel-f3795",
  storageBucket: "app-panel-f3795.firebasestorage.app",
  messagingSenderId: "418229680198",
  appId: "1:418229680198:web:dcc9355218855c1de7b247",
  measurementId: "G-YEBYQCH7D2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// ════════════════ FIREBASE UTILITY FUNCTIONS ════════════════

/**
 * تسجيل دخول المستخدم
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة السر
 */
export async function loginUser(email, password) {
  try {
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("خطأ في تسجيل الدخول:", error);
    throw error;
  }
}

/**
 * تسجيل مستخدم جديد
 * @param {string} email - البريد الإلكتروني
 * @param {string} password - كلمة السر
 */
export async function registerUser(email, password) {
  try {
    const { createUserWithEmailAndPassword } = await import("firebase/auth");
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("خطأ في التسجيل:", error);
    throw error;
  }
}

/**
 * تسجيل الخروج
 */
export async function logoutUser() {
  try {
    await auth.signOut();
    return true;
  } catch (error) {
    console.error("خطأ في تسجيل الخروج:", error);
    throw error;
  }
}

/**
 * إضافة بيانات إلى Firestore
 * @param {string} collection - اسم المجموعة
 * @param {object} data - البيانات
 */
export async function addData(collection, data) {
  try {
    const { addDoc, collection: firestoreCollection } = await import("firebase/firestore");
    const docRef = await addDoc(firestoreCollection(db, collection), data);
    return docRef.id;
  } catch (error) {
    console.error("خطأ في إضافة البيانات:", error);
    throw error;
  }
}

/**
 * الحصول على البيانات من Firestore
 * @param {string} collection - اسم المجموعة
 */
export async function getData(collection) {
  try {
    const { getDocs, collection: firestoreCollection } = await import("firebase/firestore");
    const querySnapshot = await getDocs(firestoreCollection(db, collection));
    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({
        id: doc.id,
        ...doc.data()
      });
    });
    return data;
  } catch (error) {
    console.error("خطأ في الحصول على البيانات:", error);
    throw error;
  }
}

/**
 * تحديث بيانات في Firestore
 * @param {string} collection - اسم المجموعة
 * @param {string} docId - معرف المستند
 * @param {object} data - البيانات الجديدة
 */
export async function updateData(collection, docId, data) {
  try {
    const { doc, updateDoc } = await import("firebase/firestore");
    await updateDoc(doc(db, collection, docId), data);
    return true;
  } catch (error) {
    console.error("خطأ في تحديث البيانات:", error);
    throw error;
  }
}

/**
 * حذف بيانات من Firestore
 * @param {string} collection - اسم المجموعة
 * @param {string} docId - معرف المستند
 */
export async function deleteData(collection, docId) {
  try {
    const { doc, deleteDoc } = await import("firebase/firestore");
    await deleteDoc(doc(db, collection, docId));
    return true;
  } catch (error) {
    console.error("خطأ في حذف البيانات:", error);
    throw error;
  }
}

/**
 * الاستماع إلى تغييرات البيانات في الوقت الفعلي
 * @param {string} collection - اسم المجموعة
 * @param {function} callback - الدالة المراد تنفيذها عند تغيير البيانات
 */
export function listenToData(collection, callback) {
  try {
    const { onSnapshot, collection: firestoreCollection } = require("firebase/firestore");
    return onSnapshot(firestoreCollection(db, collection), (querySnapshot) => {
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(data);
    });
  } catch (error) {
    console.error("خطأ في الاستماع إلى البيانات:", error);
  }
}

// Export Firebase instances
export { app, auth, db, analytics };
