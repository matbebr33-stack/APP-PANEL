// ════════════════ ADMIN APP WITH FIREBASE ════════════════
const ADMIN = {
    isAuthenticated: false,
    adminPassword: 'admin123', // كلمة السر الافتراضية - يمكن تغييرها
    currentUser: null,
    useFirebase: typeof FirebaseAuth !== 'undefined', // التحقق من توفر Firebase

    init() {
        // تحقق من حالة المصادقة
        if (this.useFirebase) {
            // استخدام Firebase
            FirebaseAuth.onAuthStateChanged(user => {
                if (user) {
                    this.isAuthenticated = true;
                    this.currentUser = user.email;
                    this.showDashboard();
                } else {
                    this.showLogin();
                }
            });
        } else {
            // استخدام localStorage كبديل
            this.checkAuth();
        }
        this.setupEventListeners();
    },

    // ════════════════ AUTHENTICATION ════════════════
    checkAuth() {
        const auth = localStorage.getItem('adminAuth');
        if (auth === 'true') {
            this.isAuthenticated = true;
            this.currentUser = localStorage.getItem('adminUser') || 'Admin';
            this.showDashboard();
        } else {
            this.showLogin();
        }
    },

    async login(password) {
        if (!this.useFirebase) {
            // تسجيل دخول محلي
            if (password === this.adminPassword) {
                this.isAuthenticated = true;
                const username = document.getElementById('admin-username').value || 'Admin';
                this.currentUser = username;
                
                localStorage.setItem('adminAuth', 'true');
                localStorage.setItem('adminUser', username);
                
                this.showMessage('تم تسجيل الدخول بنجاح', 'success');
                setTimeout(() => this.showDashboard(), 500);
            } else {
                this.showMessage('كلمة السر غير صحيحة', 'error');
            }
            return;
        }

        // تسجيل دخول عبر Firebase
        const email = document.getElementById('admin-username').value;
        const passwordField = document.getElementById('admin-password').value;
        
        if (!email || !passwordField) {
            this.showMessage('يرجى ملء جميع الحقول', 'error');
            return;
        }

        try {
            const result = await FirebaseAuth.login(email, passwordField);
            if (result.success) {
                this.isAuthenticated = true;
                this.currentUser = result.user.email;
                this.showMessage('تم تسجيل الدخول بنجاح', 'success');
                setTimeout(() => this.showDashboard(), 500);
            } else {
                this.showMessage('خطأ في تسجيل الدخول: ' + result.error, 'error');
            }
        } catch (error) {
            this.showMessage('خطأ: ' + error.message, 'error');
        }
    },

    async logout() {
        if (confirm('هل تريد تسجيل الخروج؟')) {
            if (this.useFirebase) {
                const result = await FirebaseAuth.logout();
                if (result.success) {
                    this.isAuthenticated = false;
                    this.currentUser = null;
                    this.showMessage('تم تسجيل الخروج', 'success');
                    setTimeout(() => this.showLogin(), 500);
                }
            } else {
                this.isAuthenticated = false;
                this.currentUser = null;
                localStorage.removeItem('adminAuth');
                localStorage.removeItem('adminUser');
                this.showMessage('تم تسجيل الخروج', 'success');
                this.showLogin();
            }
        }
    },

    // ════════════════ UI MANAGEMENT ════════════════
    showLogin() {
        const container = document.body;
        container.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-icon">🔐</div>
                        <div class="login-title">لوحة الأدمن</div>
                        <div class="login-subtitle">أدخل بيانات تسجيل الدخول</div>
                    </div>
                    <form id="login-form" onsubmit="ADMIN.handleLogin(event)">
                        <div class="form-group">
                            <label class="form-label">البريد الإلكتروني / اسم المستخدم</label>
                            <input 
                                type="text" 
                                id="admin-username"
                                class="form-input" 
                                placeholder="admin@example.com"
                                value="admin"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">كلمة السر</label>
                            <input 
                                type="password" 
                                id="admin-password"
                                class="form-input" 
                                placeholder="ادخل كلمة السر"
                                autocomplete="off"
                            >
                        </div>
                        <button type="submit" class="form-button">
                            دخول 🔓
                        </button>
                    </form>
                    <div class="login-footer">
                        <p style="margin-bottom: 10px;">البيانات الافتراضية:</p>
                        <p style="font-size: 12px; color: var(--muted);">المستخدم: admin</p>
                        <p style="font-size: 12px; color: var(--muted);">كلمة السر: admin123</p>
                        <p style="font-size: 11px; color: var(--muted); margin-top: 10px;">💡 أو استخدم Firebase Auth إذا كان متاحاً</p>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            const password = document.getElementById('admin-password').value;
            this.login(password);
        });
    },

    showDashboard() {
        const container = document.body;
        container.innerHTML = `
            <div class="admin-header">
                <div class="admin-title">🛡️ لوحة الأدمن</div>
                <div class="admin-actions">
                    <span style="font-size: 13px; color: var(--muted);">
                        مرحباً: <strong>${this.currentUser}</strong>
                    </span>
                    <button class="btn-logout" onclick="ADMIN.logout()">تسجيل خروج 🚪</button>
                </div>
            </div>
            <div class="edit-container">
                <div id="message-container"></div>
                
                <div class="form-grid">
                    <!-- بطاقة إدارة البيانات الأساسية -->
                    <div class="form-card">
                        <div class="form-card-title">
                            📋 البيانات الأساسية للنظام
                        </div>
                        <div class="form-group">
                            <label class="form-label">اسم النظام</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                id="system-name"
                                value="نظام المعتمدين"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">الإصدار</label>
                            <input 
                                type="text" 
                                class="form-input" 
                                id="system-version"
                                value="v2.1.0"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">آخر تحديث</label>
                            <input 
                                type="date" 
                                class="form-input" 
                                id="system-date"
                                value="${new Date().toISOString().split('T')[0]}"
                            >
                        </div>
                    </div>

                    <!-- بطاقة إدارة عدد الأعضاء -->
                    <div class="form-card">
                        <div class="form-card-title">
                            👥 إحصائيات الأعضاء
                        </div>
                        <div class="form-group">
                            <label class="form-label">إجمالي المعتمدين</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                id="total-members"
                                value="128"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">رتبة CA</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                id="ca-members"
                                value="12"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">رتبة CB</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                id="cb-members"
                                value="54"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">رتبة CD</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                id="cd-members"
                                value="62"
                            >
                        </div>
                    </div>

                    <!-- بطاقة إدارة المخالفات -->
                    <div class="form-card">
                        <div class="form-card-title">
                            ⚠️ إدارة المخالفات
                        </div>
                        <div class="form-group">
                            <label class="form-label">عدد المخالفات المسجلة</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                id="violations-count"
                                value="4"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">المخالفات المعلقة</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                id="pending-violations"
                                value="2"
                            >
                        </div>
                        <div class="form-group">
                            <label class="form-label">المخالفات المحلولة</label>
                            <input 
                                type="number" 
                                class="form-input" 
                                id="resolved-violations"
                                value="2"
                            >
                        </div>
                    </div>
                </div>

                <!-- أزرار الإجراء -->
                <div class="form-actions">
                    <button class="btn-save" onclick="ADMIN.saveData()">
                        💾 حفظ التغييرات
                    </button>
                    <button class="btn-cancel" onclick="ADMIN.resetData()">
                        🔄 إعادة تعيين
                    </button>
                </div>

                <!-- قسم المعلومات الإضافية -->
                <div style="margin-top: 40px; padding: 24px; background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 14px; direction: rtl;">
                    <h3 style="color: var(--gold); margin-bottom: 16px; font-size: 16px;">💡 معلومات إضافية</h3>
                    <ul style="list-style: none; font-size: 13px; color: var(--muted); line-height: 2;">
                        <li style="color: var(--white); margin-bottom: 8px;">✓ جميع التعديلات تُحفظ ${this.useFirebase ? 'في Firebase' : 'محلياً'}</li>
                        <li style="color: var(--white); margin-bottom: 8px;">✓ يمكنك تعديل جميع البيانات الإحصائية</li>
                        <li style="color: var(--white); margin-bottom: 8px;">✓ ${this.useFirebase ? 'تم تفعيل Firebase' : 'الوضع المحلي نشط'}</li>
                        <li style="color: var(--white);">✓ تسجيل الخروج يمسح جلستك</li>
                    </ul>
                </div>
            </div>
        `;
        this.loadData();
    },

    // ════════════════ DATA MANAGEMENT ════════════════
    async saveData() {
        const data = {
            systemName: document.getElementById('system-name').value,
            systemVersion: document.getElementById('system-version').value,
            systemDate: document.getElementById('system-date').value,
            totalMembers: document.getElementById('total-members').value,
            caMembers: document.getElementById('ca-members').value,
            cbMembers: document.getElementById('cb-members').value,
            cdMembers: document.getElementById('cd-members').value,
            violationsCount: document.getElementById('violations-count').value,
            pendingViolations: document.getElementById('pending-violations').value,
            resolvedViolations: document.getElementById('resolved-violations').value,
            updatedAt: new Date().toISOString()
        };

        if (this.useFirebase) {
            // حفظ في Firebase
            const result = await FirestoreDB.updateData('system_data', 'admin_settings', data);
            if (result.success) {
                this.showMessage('✓ تم حفظ البيانات في Firebase بنجاح', 'success');
            } else {
                this.showMessage('✗ خطأ في حفظ البيانات: ' + result.error, 'error');
            }
        } else {
            // حفظ محلي
            localStorage.setItem('adminData', JSON.stringify(data));
            this.showMessage('✓ تم حفظ البيانات محلياً بنجاح', 'success');
        }
    },

    async loadData() {
        if (this.useFirebase) {
            // تحميل من Firebase
            const result = await FirestoreDB.getDocById('system_data', 'admin_settings');
            if (result.success) {
                const data = result.data;
                document.getElementById('system-name').value = data.systemName || 'نظام المعتمدين';
                document.getElementById('system-version').value = data.systemVersion || 'v2.1.0';
                document.getElementById('total-members').value = data.totalMembers || 128;
                document.getElementById('ca-members').value = data.caMembers || 12;
                document.getElementById('cb-members').value = data.cbMembers || 54;
                document.getElementById('cd-members').value = data.cdMembers || 62;
                document.getElementById('violations-count').value = data.violationsCount || 4;
                document.getElementById('pending-violations').value = data.pendingViolations || 2;
                document.getElementById('resolved-violations').value = data.resolvedViolations || 2;
            }
        } else {
            // تحميل محلي
            const localData = localStorage.getItem('adminData');
            if (localData) {
                const data = JSON.parse(localData);
                document.getElementById('system-name').value = data.systemName;
                document.getElementById('system-version').value = data.systemVersion;
                document.getElementById('system-date').value = data.systemDate;
                document.getElementById('total-members').value = data.totalMembers;
                document.getElementById('ca-members').value = data.caMembers;
                document.getElementById('cb-members').value = data.cbMembers;
                document.getElementById('cd-members').value = data.cdMembers;
                document.getElementById('violations-count').value = data.violationsCount;
                document.getElementById('pending-violations').value = data.pendingViolations;
                document.getElementById('resolved-violations').value = data.resolvedViolations;
            }
        }
    },

    async resetData() {
        if (confirm('هل تريد إعادة تعيين جميع البيانات إلى القيم الافتراضية؟')) {
            if (this.useFirebase) {
                const result = await FirestoreDB.deleteData('system_data', 'admin_settings');
                if (result.success) {
                    this.showMessage('✓ تم إعادة تعيين البيانات', 'success');
                    setTimeout(() => location.reload(), 500);
                }
            } else {
                localStorage.removeItem('adminData');
                this.showMessage('✓ تم إعادة تعيين البيانات', 'success');
                setTimeout(() => location.reload(), 500);
            }
        }
    },

    // ════════════════ MESSAGES ════════════════
    showMessage(text, type) {
        const container = document.getElementById('message-container');
        if (!container) return;

        container.innerHTML = `
            <div class="message ${type}">
                <span>${text}</span>
            </div>
        `;

        setTimeout(() => {
            container.innerHTML = '';
        }, 3000);
    },

    // ════════════════ EVENT HANDLERS ════════════════
    handleLogin(event) {
        event.preventDefault();
        const password = document.getElementById('admin-password').value;
        this.login(password);
    },

    setupEventListeners() {
        // يمكن إضافة مستمعي الأحداث هنا إذا لزم الأمر
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => ADMIN.init());

