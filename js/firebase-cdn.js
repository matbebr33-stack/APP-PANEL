// ════════════════ FIREBASE CONFIGURATION (CDN VERSION) ════════════════
// هذا الملف يستخدم Firebase CDN بدلاً من npm modules

// تهيئة Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDPiKLcmWCseDMPkYeCFzj0a7ykpxlyfPQ",
  authDomain: "app-panel-f3795.firebaseapp.com",
  projectId: "app-panel-f3795",
  storageBucket: "app-panel-f3795.firebasestorage.app",
  messagingSenderId: "418229680198",
  appId: "1:418229680198:web:dcc9355218855c1de7b247",
  measurementId: "G-YEBYQCH7D2"
};

// تهيئة Firebase
let firebaseApp;
let firebaseAuth;
let firebaseDb;

try {
  firebaseApp = firebase.initializeApp(firebaseConfig);
  firebaseAuth = firebase.auth();
  firebaseDb = firebase.firestore();
  firebase.analytics();
  console.log("✓ Firebase تم تهيئته بنجاح");
} catch (error) {
  console.error("✗ خطأ في تهيئة Firebase:", error);
}

// ════════════════ AUTHENTICATION FUNCTIONS ════════════════

/**
 * تسجيل دخول المستخدم
 */
const FirebaseAuth = {
  async login(email, password) {
    try {
      const result = await firebaseAuth.signInWithEmailAndPassword(email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async register(email, password) {
    try {
      const result = await firebaseAuth.createUserWithEmailAndPassword(email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async logout() {
    try {
      await firebaseAuth.signOut();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  getCurrentUser() {
    return firebaseAuth.currentUser;
  },

  onAuthStateChanged(callback) {
    return firebaseAuth.onAuthStateChanged(callback);
  }
};

// ════════════════ FIRESTORE FUNCTIONS ════════════════

const FirestoreDB = {
  async addData(collection, data) {
    try {
      const docRef = await firebaseDb.collection(collection).add(data);
      return { success: true, id: docRef.id };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getData(collection) {
    try {
      const snapshot = await firebaseDb.collection(collection).get();
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async getDocById(collection, docId) {
    try {
      const doc = await firebaseDb.collection(collection).doc(docId).get();
      if (doc.exists) {
        return { success: true, data: { id: doc.id, ...doc.data() } };
      }
      return { success: false, error: "المستند غير موجود" };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async updateData(collection, docId, data) {
    try {
      await firebaseDb.collection(collection).doc(docId).update(data);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async deleteData(collection, docId) {
    try {
      await firebaseDb.collection(collection).doc(docId).delete();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  listenToCollection(collection, callback) {
    return firebaseDb.collection(collection).onSnapshot(snapshot => {
      const data = [];
      snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
      });
      callback(data);
    });
  }
};

// ════════════════ EXPORTS ════════════════
// للاستخدام المباشر في الملفات الأخرى
