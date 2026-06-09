// ════════════════ MAIN APP ════════════════
const APP = {
    currentRank: 'all',
    initialized: false,

    init() {
        if (this.initialized) return;
        this.updateDate();
        this.animateCounters();
        setTimeout(() => this.animateBars(), 300);
        this.initialized = true;
    },

    updateDate() {
        const now = new Date();
        const formatted = now.toLocaleDateString('ar-SA', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        document.getElementById('last-update').textContent = formatted;
    },

    // ════════════════ NAVIGATION ════════════════
    goto(pageId, element) {
        // Remove active state from all pages and nav items
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        // Add active state to selected page and nav item
        const page = document.getElementById('page-' + pageId);
        if (!page) return;

        page.classList.add('active');
        element.classList.add('active');

        // Trigger animations
        if (pageId === 'dashboard') {
            this.animateBars();
        }
    },

    // ════════════════ ANIMATIONS ════════════════
    animateCounters() {
        document.querySelectorAll('.stat-number[data-target]').forEach(el => {
            const target = parseInt(el.dataset.target);
            let current = 0;
            const step = Math.ceil(target / 40);
            const interval = setInterval(() => {
                current = Math.min(current + step, target);
                el.textContent = current;
                if (current >= target) {
                    clearInterval(interval);
                }
            }, 30);
        });
    },

    animateBars() {
        document.querySelectorAll('.rank-bar-fill').forEach(bar => {
            const width = bar.dataset.w;
            setTimeout(() => {
                bar.style.width = width + '%';
            }, 100);
        });
    },

    // ════════════════ MEMBERS FILTERING ════════════════
    filterRank(rank, element) {
        this.currentRank = rank;
        document.querySelectorAll('.rank-badge').forEach(badge => {
            badge.classList.remove('active');
        });
        element.classList.add('active');
        this.filterMembers();
    },

    filterMembers() {
        const searchValue = document.getElementById('member-search').value.trim().toLowerCase();
        const rows = document.querySelectorAll('#members-tbody tr');

        rows.forEach(row => {
            const rank = row.dataset.rank;
            const name = (row.dataset.name || '').toLowerCase();

            const matchRank = this.currentRank === 'all' || rank === this.currentRank;
            const matchName = name.includes(searchValue);

            row.classList.toggle('hidden', !(matchRank && matchName));
        });
    },

    // ════════════════ ACCORDION ════════════════
    toggleAcc(element) {
        element.classList.toggle('open');
    }
};

// Make functions available globally
function goto(pageId, el) { APP.goto(pageId, el); }
function filterRank(rank, el) { APP.filterRank(rank, el); }
function filterMembers() { APP.filterMembers(); }
function toggleAcc(el) { APP.toggleAcc(el); }

// ════════════════ EVENT LISTENERS ════════════════
document.addEventListener('DOMContentLoaded', () => APP.init());
window.addEventListener('load', () => APP.init());
