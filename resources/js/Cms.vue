<script setup>
import Swal from 'sweetalert2';
import { ref, reactive, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import {
    LayoutDashboard,
    Mail,
    BriefcaseBusiness, Sun, Moon, RefreshCw, LogOut, X, Settings, UserCog, Menu
} from 'lucide-vue-next';
import Teams from './Teams.vue';
const showModal = ref(false); 
const mobileNavOpen = ref(false);

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const theme = ref(localStorage.getItem('biltrax-theme') || 'light');
watch(theme, v => localStorage.setItem('biltrax-theme', v));

const user = ref(null), credentials = reactive({ email: '', password: '' }), view = ref('dashboard'), summary = ref({}), rows = ref([]), selected = ref(null), search = ref(''), status = ref(''), page = ref(1), last = ref(1), loading = ref(false), saving = ref(false), error = ref(''), notice = ref('');
const periods = reactive({ contact: 'daily', careers: 'daily' });
const labels = { dashboard: 'Overview', contact: 'Contact enquiries', careers: 'Career applications', mailconfig: 'Email Configuration',teamconfig:'Team Manage' };
// const navItems=[['dashboard','⌂','Overview'],['contact','✉','Contact enquiries'],['careers','▤','Career applications']];
const navItems = [
    ['dashboard', LayoutDashboard, 'Overview'],
    ['contact', Mail, 'Contact Enquiries'],
    ['careers', BriefcaseBusiness, 'Career Applications'],
    ['mailconfig',Settings,'Email Configuration'],
    ['teamconfig',UserCog,'Team Manage']
];
const statusLabels = { new: 'New', in_progress: 'In progress', resolved: 'Resolved' };
const hiddenFields = ['internal_notes', 'status', 'resume_path', 'resume_original_name', 'resume_mime', 'resume_size'];
const visibleDetails = computed(() => selected.value ? Object.entries(selected.value).filter(([k]) => !hiddenFields.includes(k)) : []);
const totals = computed(() => ({ contact: Number(summary.value.contact || 0), careers: Number(summary.value.careers || 0) }));

function trendData(type) { const data = summary.value.trends?.[periods[type]] || []; return { labels: data.map(x => x.label), datasets: [{ label: type === 'contact' ? 'Enquiries' : 'Applications', data: data.map(x => Number(x[type] || 0)), backgroundColor: type === 'contact' ? '#6258df' : '#089db5', hoverBackgroundColor: type === 'contact' ? '#493ed1' : '#087d91', borderRadius: 5, maxBarThickness: 35 }] }; }
function donutData(type) { const s = summary.value.status_breakdown?.[type] || {}; return { labels: ['New', 'In progress', 'Resolved'], datasets: [{ data: [s.new || 0, s.in_progress || 0, s.resolved || 0], backgroundColor: ['#7469ec', '#eeb04c', '#27b48a'], borderWidth: 0, hoverOffset: 5 }] }; }
const barOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 550 }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.parsed.y} submissions` } } }, scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8, color: '#8290a5' } }, y: { beginAtZero: true, grid: { color: 'rgba(130,144,165,.18)' }, ticks: { precision: 0, color: '#8290a5' } } } };
const donutOptions = { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { display: false } } };

async function api(path, options = {}) { const r = await fetch('/cms-api' + path, { credentials: 'same-origin', headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '' }, ...options }); const text = await r.text(); let d = null; if (text) { try { d = JSON.parse(text); } catch { return r.ok ? text : Promise.reject(new Error('Request failed')); } } if (!r.ok) { if (r.status === 401 || r.status === 403) return null; const validationMessage = d?.errors ? Object.values(d.errors).flat()[0] : null; const message = d && typeof d === 'object' ? (validationMessage || d.message || d.error || 'Request failed') : 'Request failed'; throw new Error(message); } return d; }
async function login() { error.value = ''; try { const d = await api('/login', { method: 'POST', body: JSON.stringify(credentials) }); if (!d?.user) { throw new Error('Invalid credentials'); } user.value = d.user; await load(); } catch (e) { error.value = e.message; } }
async function logout() { try { await api('/logout', { method: 'POST' }); user.value = null; selected.value = null; rows.value = []; summary.value = {}; notice.value = ''; error.value = ''; } catch (e) { error.value = e.message; } }
async function load() { loading.value = true; error.value = '';
 try { const nextSummary = await api('/summary'); summary.value = nextSummary || {};
  if (['contact','careers'].includes(view.value)) {
    const q = new URLSearchParams({ page: String(page.value) });
    if (search.value) q.set('search', search.value);
    if (status.value) q.set('status', status.value);
     const d = await api('/records/' + view.value + '?' + q);
    rows.value = d?.data || []; last.value = d?.last_page || 1;
    } else{
        rows.value = [];
        last.value = 1;
    }
} catch (e) {
    error.value = e.message;
} finally { loading.value = false; } }

function navigate(v) { view.value = v; mobileNavOpen.value = false; page.value = 1; search.value = ''; status.value = ''; selected.value = null; notice.value = '';
if (v === 'mailconfig') {
    loadEmailRecipients();
}
load();
 }
async function detail(id) { error.value = ''; try { const d = await api('/records/' + view.value + '/' + id); selected.value = d || null; } catch (e) { error.value = e.message; } }
// async function save() {
//     if (!selected.value) return; saving.value = true; error.value = '';
//     try { const d = await api('/records/' + view.value + '/' + selected.value.id, { method: 'PATCH', body: JSON.stringify({ status: selected.value.status, internal_notes: selected.value.internal_notes }) }); selected.value = d || selected.value; await load(); selected.value = null; notice.value = 'Changes saved successfully'; } catch (e) { error.value = e.message; } finally { saving.value = false; }
// }
const emailConfig = ref(null);
const emailDraft = ref([]);
const emailInput = ref('');
const emailModalLoading = ref(false);
const emailSettingsSaving = ref(false);
const emailSettingsError = ref('');
const emailSettingsNotice = ref('');
const totalMembercount = ref(0);
const emailConfigInfo = {
    enquiry: {
        title: 'Enquiry Email Configuration',
        description: 'Manage recipient email addresses for enquiry/contact form submissions.',
        button: 'Configure Enquiry Emails',
    },
    careers: {
        title: 'Careers Email Configuration',
        description: 'Manage recipient email addresses for career application submissions.',
        button: 'Configure Career Emails',
    },
};
const emailAddressPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function openEmailConfig(type) {
    emailConfig.value = type;
    emailDraft.value = [];
    emailInput.value = '';
    emailSettingsError.value = '';
    emailSettingsNotice.value = '';
    emailModalLoading.value = true;
    try {
        const data = await api('/email-recipients/' + type);
        if (!data) throw new Error('Unable to load email settings. Please log in again.');
        emailDraft.value = Array.isArray(data.recipients) ? [...data.recipients] : [];
    } catch (e) {
        emailSettingsError.value = e.message;
    } finally {
        emailModalLoading.value = false;
    }
}

function closeEmailConfig() {
    if (emailSettingsSaving.value) return;
    emailConfig.value = null;
    emailDraft.value = [];
    emailInput.value = '';
    emailSettingsError.value = '';
    emailSettingsNotice.value = '';
}

function addEmailRecipient() {
    emailSettingsError.value = '';
    emailSettingsNotice.value = '';
    const email = emailInput.value.trim();
    if (!emailAddressPattern.test(email)) {
        emailSettingsError.value = 'Enter a valid email address.';
        return;
    }
    if (emailDraft.value.some(item => item.toLowerCase() === email.toLowerCase())) {
        emailSettingsError.value = 'That email address has already been added.';
        return;
    }
    if (emailDraft.value.length >= 20) {
        emailSettingsError.value = 'You can add up to 20 recipient addresses.';
        return;
    }
    emailDraft.value.push(email);
    emailInput.value = '';
}

function removeEmailRecipient(index) {
    emailDraft.value.splice(index, 1);
    emailSettingsError.value = '';
    emailSettingsNotice.value = '';
}

async function saveEmailRecipients() {
    if (!emailConfig.value || emailSettingsSaving.value) return;
    emailSettingsError.value = '';
    emailSettingsNotice.value = '';
    if (!emailDraft.value.length) {
        emailSettingsError.value = 'Add at least one recipient before saving.';
        return;
    }
    if (emailDraft.value.length > 20) {
        emailSettingsError.value = 'You can add up to 20 recipient addresses.';
        return;
    }
    emailSettingsSaving.value = true;
    try {
        const data = await api('/email-recipients/' + emailConfig.value, {
            method: 'PUT',
            body: JSON.stringify({ recipients: emailDraft.value }),
        });
        if (!data) throw new Error('Unable to save settings. Check your admin login.');
        emailDraft.value = [...data.recipients];
        emailSettingsNotice.value = data.message || 'Email recipients saved successfully.';
    } catch (e) {
        emailSettingsError.value = e.message || 'Unable to save email recipients.';
    } finally {
        emailSettingsSaving.value = false;
    }
}



async function save() {
    if (!selected.value) return;

    saving.value = true;
    error.value = '';

    try {
        const d = await api(
            '/records/' + view.value + '/' + selected.value.id,
            {
                method: 'PATCH',
                body: JSON.stringify({
                    status: selected.value.status,
                    internal_notes: selected.value.internal_notes
                })
            }
        );

        selected.value = d || selected.value;

        await load();

        selected.value = null;
        notice.value = 'Changes saved successfully';

        await Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Changes saved successfully.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#4f46e5',
            customClass: {
                popup: 'swal-theme-popup'
            }
        });

    } catch (e) {
        error.value = e.message;

        await Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: e.message || 'Failed to save changes.',
            confirmButtonText: 'OK',
            confirmButtonColor: '#dc2626'
        });

    } finally {
        saving.value = false;
    }
}

async function resume(id) { try { const d = await api('/resume/' + id); if (!d?.url) { throw new Error('Resume not available'); } window.open(d.url, '_blank', 'noopener,noreferrer'); } catch (e) { error.value = e.message; } }
function niceKey(k) { return k.replaceAll('_', ' ').replace(/\b\w/g, x => x.toUpperCase()); }
function formatValue(v, k) { if (v === null || v === undefined || v === '') return '—'; if (typeof v === 'boolean') return v ? 'Yes' : 'No'; if (Array.isArray(v)) return v.join(', ') || '—'; if (typeof v === 'object') return JSON.stringify(v); if (k.endsWith('_at')) { const d = new Date(v); return isNaN(d) ? String(v) : d.toLocaleString(); } return String(v); }
function dateLabel(v) { if (!v) return '—'; const d = new Date(v); return isNaN(d) ? '—' : d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }); }

function onKey(e) { if (e.key === 'Escape') { if (emailConfig.value) closeEmailConfig(); else if (selected.value) selected.value = null; else mobileNavOpen.value = false; } }
onMounted(async () => { window.addEventListener('keydown', onKey); try { const d = await api('/me'); user.value = d?.user || null; if (user.value) await load(); } catch { user.value = null; } });
onBeforeUnmount(() => window.removeEventListener('keydown', onKey));
</script>

<template>
    <div class="app" :data-theme="theme">

        <!-- LOGIN -->
        <div v-if="!user" class="login-shell">
            <div class="login card">
                <div class="logo">biltrax<span>.</span></div>
                <h1>Welcome back</h1>
                <p class="muted">Sign in to manage website submissions.</p>
                <form class="login-form" @submit.prevent="login">
                    <label class="field"><span>Email</span><input v-model="credentials.email" type="email" required
                            autocomplete="username" /></label>
                    <label class="field"><span>Password</span><input v-model="credentials.password" type="password"
                            required autocomplete="current-password" /></label>
                    <button class="btn primary block" type="submit">Sign in</button>
                </form>
                <p v-if="error" class="error">{{ error }}</p>
            </div>
        </div>

        <template v-else>
            <!-- SIDEBAR -->
            <!-- <aside class="sidebar">
      <div class="sidebar-top">
        <div class="brand"><div class="logo">biltrax<span>.</span></div></div>
        <nav class="nav-list" aria-label="Main navigation">
          <p class="menu-label">Workspace</p>
          <button v-for="n in navItems" :key="n[0]" :class="['nav',{active:view===n[0]}]" :aria-current="view===n[0]?'page':undefined" @click="navigate(n[0])">
            <span class="nav-icon" aria-hidden="true">{{n[1]}}</span>
            <span class="nav-label">{{n[2]}}</span>
          </button>
        </nav>
      </div>
      <div class="sidebar-foot">
        <div class="avatar">{{(user.name||'A').slice(0,1).toUpperCase()}}</div>
        <div class="user-meta"><strong>{{user.name}}</strong><small>Administrator</small></div>
        <button class="icon-btn" title="Sign out" aria-label="Sign out" @click="logout">⏻</button>
      </div>
    </aside> -->
            <button v-if="mobileNavOpen" class="sidebar-backdrop" type="button" aria-label="Close navigation"
                @click="mobileNavOpen = false"></button>
            <aside :class="['sidebar', { 'is-open': mobileNavOpen }]">
                <div class="sidebar-top">
                    <div class="brand">
                        <div class="logo">
                            biltrax<span>.</span>
                        </div>
                    </div>

                    <nav class="nav-list" aria-label="Main navigation">
                        <p class="menu-label">Workspace</p>
                        <button v-for="n in navItems" :key="n[0]" :class="['nav', { active: view === n[0] }]"
                            :aria-current="view === n[0] ? 'page' : undefined" @click="navigate(n[0])">
                            <span class="nav-icon" aria-hidden="true">
                                <component :is="n[1]" :size="20" :stroke-width="1.8" />
                            </span>

                            <span class="nav-label">{{ n[2] }}</span>
                        </button>
                        <!-- <button
        v-for="n in navItems"
        :key="n[0]"
        :class="['nav', { active: view === n[0] }]"
        :aria-current="view === n[0] ? 'page' : undefined"
        @click="navigate(n[0])"
      >
        <span class="nav-icon" aria-hidden="true">
          {{ n[1] }}
        </span>

        <span class="nav-label">
          {{ n[2] }}
        </span>
      </button> -->
                    </nav>
                </div>
                <!-- <div class="top-actions"> -->
                <!-- <button class="btn" :disabled="loading" @click="load">↻ Refresh</button> -->
                <!-- </div> -->
                 <div>
                <div class="sidebar-bottom mb-2">
                    <button class="btn theme-toggle w-60" type="button" @click="theme = theme === 'dark' ? 'light' : 'dark'">
                        <span class="theme-icon">
                            <component :is="theme === 'dark' ? Sun : Moon" :size="16" :stroke-width="1.9" />
                        </span>
                        <span>{{ theme === 'dark' ? 'Light mode' : 'Dark mode' }}</span>
                    </button>
                </div>
                <div class="sidebar-foot">

                    <div class="avatar">
                        {{ (user.name || 'A').slice(0, 1).toUpperCase() }}
                    </div>

                    <div class="user-meta">
                        <strong>{{ user.name }}</strong>
                        <small>Administrator</small>
                    </div>

                    <button class="icon-btn" type="button" title="Sign out" aria-label="Sign out" @click="logout">
                      <LogOut :size="18" :stroke-width="1.8" />
                    </button>
                </div>
                </div>
            </aside>
            <!-- MAIN -->
            <div class="main">
                <header class="topbar">
                    <div class="topbar-heading">
                        <button class="icon-btn mobile-menu-toggle" type="button" :aria-expanded="mobileNavOpen"
                            aria-label="Toggle navigation" @click="mobileNavOpen = !mobileNavOpen">
                            <Menu :size="21" :stroke-width="1.8" />
                        </button>
                        <div class="topbar-title">
                            <p class="breadcrumb">Biltrax <span>/</span> {{ labels[view] }}</p>
                            <h1>{{ labels[view] }}</h1>
                        <!-- <p class="muted subtitle">{{ view === 'dashboard' ? 'Your website operations and submission
                            insights.':view==='contact'?'Review and manage incoming enquiries.':'Review applications and
                            candidate progress.'}}</p> -->
                        <p class="muted subtitle">
                            {{
                                view === 'dashboard'
                                    ? 'Your website operations and submission insights.'
                                    : view === 'contact'
                                        ? 'Review and manage incoming enquiries.'
                                        : view === 'careers' ? 'Review applications and candidate progress.'
                                        :view === 'mailconfig' ?'Manage your website and application email settings'
                                        :view === 'teamconfig' ? 'Manage your team members and access'
                                        :''
                                        
                            }}
                            </p>
                        </div>
                    </div>
                    <div class="top-actions">
                        <button class="btn" :disabled="loading" @click="load">
                            <RefreshCw :size="18" :stroke-width="1.8" /><span class="refresh-label">Refresh</span>
                        </button>
                        <!-- <button class="btn" @click="theme=theme==='dark'?'light':'dark'">{{theme==='dark'?'☀ Light mode':'☾ Dark mode'}}</button> -->
                    </div>
                </header>

                <main class="content">
                    <p v-if="error" class="banner error-banner" role="alert">{{ error }}</p>
                    <!-- <p v-if="notice" class="banner success-banner">✓ {{ notice }}</p> -->

                    <!-- DASHBOARD -->
                    <template v-if="view === 'dashboard'">
                        <div class="stats grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
                            <div v-for="s in [['Contact enquiries', summary.contact, '✉', 'violet'], ['Career applications', summary.careers, '▣', 'teal'], ['New Career', summary.new_careers, '●', 'indigo'],['New Contact', summary.new_contact, '●', 'indigo'], ['In progress', summary.in_progress, '◷', 'gold'], ['Resolved', summary.resolved, '✓', 'mint']]"
                                :key="s[0]" class="stat card">
                                <div :class="['stat-icon', s[3]]">{{ s[2] }}</div>
                                <p>{{ s[0] }}</p>
                                <strong>{{ s[1] ?? 0 }}</strong>
                                <small>All-time submissions</small>
                            </div>
                        </div>

                        <div class="grid-2 grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <section v-for="type in ['contact', 'careers']" :key="type" class="card panel">
                                <div class="panel-head">
                                    <div>
                                        <h2>{{ type === 'contact' ? 'Enquiry activity' : 'Application activity' }}</h2>
                                        <p class="muted">Submissions over time</p>
                                    </div>
                                    <div class="segmented">
                                        <button :class="{ chosen: periods[type] === 'daily' }"
                                            @click="periods[type] = 'daily'">Daily</button>
                                        <button :class="{ chosen: periods[type] === 'monthly' }"
                                            @click="periods[type] = 'monthly'">Monthly</button>
                                    </div>
                                </div>
                                <div class="chart-area">
                                    <Bar :data="trendData(type)" :options="barOptions" />
                                </div>
                                <!-- <div class="panel-foot"><span class="foot-dot"
                                        :class="type"></span>{{ type === 'contact' ? 'Enquiries received' : 'Applications
                                    received'}} <strong>{{ totals[type] }}</strong></div> -->
                                <div class="panel-foot">
                                    <span class="foot-dot" :class="type"></span>
                                    {{ type === 'contact' ? 'Enquiries received' : 'Applications received' }}
                                    <strong>{{ totals[type] }}</strong>
                                </div>
                            </section>
                        </div>

                        <div class="grid-2 grid grid-cols-1 gap-5 lg:grid-cols-2">
                            <section v-for="type in ['contact', 'careers']" :key="type" class="card panel">
                                <div class="panel-head">
                                    <div>
                                        <h2>{{ type === 'contact' ? 'Enquiry status' : 'Application status' }}</h2>
                                        <p class="muted">Current distribution by status</p>
                                    </div>
                                </div>
                                <div class="distribution-content">
                                    <div class="donut-wrap">
                                        <Doughnut :data="donutData(type)" :options="donutOptions" />
                                        <div class="donut-center"><strong>{{ totals[type]
                                                }}</strong><small>Total</small>
                                        </div>
                                    </div>
                                    <div class="status-list">
                                        <div v-for="s in [['new', 'New'], ['in_progress', 'In progress'], ['resolved', 'Resolved']]"
                                            :key="s[0]">
                                            <span><i :class="s[0]"></i>{{ s[1] }}</span>
                                            <strong>{{ summary.status_breakdown?.[type]?.[s[0]] ?? 0 }}</strong>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <section class="card quick">
                            <div>
                                <h2>Quick actions</h2>
                                <p class="muted">Open a workspace to review submissions and update their status.</p>
                            </div>
                            <div class="quick-buttons">
                                <button class="btn primary" @click="navigate('contact')">View enquiries</button>
                                <button class="btn" @click="navigate('careers')">View applicants</button>
                            </div>
                        </section>
                    </template>

                    <!-- Email configuration -->
                    <template v-else-if="view === 'mailconfig'">
                        <div class="email-config-grid">
                            <section v-for="type in ['enquiry', 'careers']" :key="type" class="card panel email-config-card">
                                <div class="email-config-icon" aria-hidden="true">
                                    <Mail :size="21" :stroke-width="1.8" />
                                </div>
                                <div class="email-config-copy">
                                    <h2>{{ emailConfigInfo[type].title }}</h2>
                                    <p class="muted">{{ emailConfigInfo[type].description }}</p>
                                </div>
                                <button class="btn primary" type="button" @click="openEmailConfig(type)">
                                    {{ emailConfigInfo[type].button }}
                                </button>
                            </section>
                        </div>
                    </template>
                    <!-- RECORDS TABLE -->
                    <section v-else class="card records">
                        <div class="records-head">
                            <div>
                                <h2>{{ labels[view] }}</h2>
                                <p class="muted">Search, review and update submitted records.</p>
                            </div>
                            <div>
                                <button v-if="view==='teamconfig'" class="btn m-3" style="background-color:var(--primary);color:white;margin:0.5rem" @click="showModal = true">Add Team Member</button>
                                <span v-if="view === 'teamconfig'" class="count">{{ totalMembercount }} on this page</span>
                                <span class="count" v-if="view !== 'teamconfig'">{{ rows.length }} on this page</span>
                            </div>
                          </div>
                        <div class="toolbar">
                            <input v-model="search" placeholder="Search by name, email or company"
                                @keyup.enter="page = 1; load()" />
                            <select v-model="status" @change="page = 1; load()" v-if="view === 'careers' ||view === 'contact' ">
                                <option value="">All statuses</option>
                                <option value="new">New</option>
                                <option value="in_progress">In progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <button class="btn primary" @click="page = 1; load()">Search</button>
                            <button class="btn" @click="search = ''; status = ''; page = 1; load()">Reset</button>
                        </div>
                        <div class="overflow" v-if="view === 'careers' ||view === 'contact' ">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>{{ view === 'contact' ? 'Company' : 'Interest' }}</th>
                                        <th>Status</th>
                                        <th>Submitted</th>
                                        <th class="th-action">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="r in rows" :key="r.id">
                                        <td>
                                            <div class="person"><span class="person-avatar">{{ (r.full_name ||
                                                    '?').slice(0,
                                                    1).toUpperCase() }}</span><strong>{{ r.full_name }}</strong>
                                            </div>
                                        </td>
                                        <td>{{ r.work_email || r.email }}</td>
                                        <td>{{ r.company || r.area_of_interest || '—' }}</td>
                                        <td><span :class="['pill', r.status]">{{ statusLabels[r.status] || r.status
                                                }}</span>
                                        </td>
                                        <td>{{ dateLabel(r.created_at) }}</td>
                                        <td class="td-action"><button class="btn sm"
                                                @click="detail(r.id)">Review</button></td>
                                    </tr>
                                    <tr v-if="!rows.length">
                                        <td colspan="6" class="no-records">{{ loading ? 'Loading…' : 'No records found'
                                            }}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <!-- team config -->
                         <div v-if="view === 'teamconfig'">
                            <Teams :show-modal="showModal" :search="search" @close="showModal = false" @member-count="totalMembercount = $event"/>
                         </div>
                         <!-- end Team config -->
                        <div class="pager">
                            <span>Page {{ page }} of {{ last }}</span>
                            <div>
                                <button class="btn" :disabled="page <= 1 || loading" @click="page--; load()">←
                                    Previous</button>
                                <button class="btn" :disabled="page >= last || loading" @click="page++; load()">Next
                                    →</button>
                            </div>
                        </div>
                    </section>
                </main>
            </div>

            <!-- CENTERED MODAL -->
            <Transition name="modal">
                <div v-if="emailConfig" class="overlay" @click.self="closeEmailConfig">
                    <section class="review-modal email-recipient-modal" role="dialog" aria-modal="true" aria-labelledby="email-modal-title">
                        <div class="modal-head">
                            <div class="modal-title-group">
                                <p class="modal-kicker">Email Configuration</p>
                                <h2 id="email-modal-title">{{ emailConfigInfo[emailConfig].title }}</h2>
                            </div>
                            <button class="icon-btn modal-close" type="button" aria-label="Close dialog"
                                :disabled="emailSettingsSaving" @click="closeEmailConfig">
                                <X :size="20" :stroke-width="1.8" style="margin-left: -0.3rem;" />
                            </button>
                        </div>

                        <div class="modal-body email-recipient-body">
                            <p class="muted">{{ emailConfigInfo[emailConfig].description }}</p>
                            <div v-if="emailModalLoading" class="email-loading" role="status">Loading saved recipients…</div>
                            <template v-else>
                                <form class="email-add-form" @submit.prevent="addEmailRecipient">
                                    <label for="recipient-email">Email address</label>
                                    <div class="email-input-row">
                                        <input id="recipient-email" v-model="emailInput" type="email" maxlength="150"
                                            autocomplete="email" placeholder="name@example.com" :disabled="emailSettingsSaving"
                                            @keydown.enter.prevent="addEmailRecipient" />
                                        <button class="btn" type="submit" :disabled="emailSettingsSaving || emailDraft.length >= 20">
                                            Add Email
                                        </button>
                                    </div>
                                    <p class="muted email-limit">Up to 20 recipient addresses. Duplicate addresses are not allowed.</p>
                                </form>

                                <div class="email-recipient-list">
                                    <div class="email-recipient-list-head">
                                        <h3>Recipient addresses</h3>
                                        <span class="count">{{ emailDraft.length }} / 20</span>
                                    </div>
                                    <p v-if="!emailDraft.length" class="email-empty-state">No recipients added yet.</p>
                                    <ul v-else>
                                        <li v-for="(email, index) in emailDraft" :key="email.toLowerCase()">
                                            <span>{{ email }}</span>
                                            <button class="icon-btn email-remove" type="button" :aria-label="`Remove ${email}`"
                                                :disabled="emailSettingsSaving" @click="removeEmailRecipient(index)">
                                                <X :size="17" :stroke-width="1.9" />
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                                <p v-if="emailSettingsError" class="banner error-banner" role="alert">{{ emailSettingsError }}</p>
                                <p v-if="emailSettingsNotice" class="banner success-banner" role="status">{{ emailSettingsNotice }}</p>
                            </template>
                        </div>

                        <div class="modal-foot">
                            <span class="muted">Changes apply only to this recipient configuration.</span>
                            <div>
                                <button class="btn" type="button" :disabled="emailSettingsSaving" @click="closeEmailConfig">Cancel</button>
                                <button class="btn primary" type="button"
                                    :disabled="emailModalLoading || emailSettingsSaving || !emailDraft.length"
                                    @click="saveEmailRecipients">
                                    {{ emailSettingsSaving ? 'Saving…' : 'Save Configuration' }}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </Transition>

            <!-- CENTERED MODAL -->
            <Transition name="modal">
                <div v-if="selected" class="overlay" >
                    <section class="review-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
                        <div class="modal-head">
                            <div class="modal-title-group">
                                <p class="modal-kicker">{{ view === 'contact' ? 'Contact enquiry' : 'Career application' }} #{{ selected.id }}</p>
                                <h2 id="modal-title">{{ selected.full_name }}</h2>
                            </div>
                            <span :class="['pill', selected.status]">{{ statusLabels[selected.status] || selected.status }}</span>
                            <button class="icon-btn modal-close" type="button" aria-label="Close dialog"
                                @click="selected = null">
                                <X :size="20" :stroke-width="1.8" style="margin-left: -0.4rem;" />
                            </button>
                        </div>

                        <div class="modal-body">
                            <div class="detail-section">
                                <div class="modal-section-heading">
                                    <h3>Submitted information</h3>
                                    <p class="muted">Details provided through the website form</p>
                                </div>
                                <div class="detail-grid">
                                    <div v-for="entry in visibleDetails" :key="entry[0]" class="detail-item">
                                        <span>{{ niceKey(entry[0]) }}</span>
                                        <p>{{ formatValue(entry[1], entry[0]) }}</p>
                                    </div>
                                </div>
                            </div>

                            <div class="edit-section">
                                <div class="modal-section-heading">
                                    <h3>Update record</h3>
                                    <p class="muted">Change the status or add an internal note.</p>
                                </div>
                                <label>Status
                                    <select v-model="selected.status">
                                        <option value="new">New</option>
                                        <option value="in_progress">In progress</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </label>
                                <label>Internal notes
                                    <textarea v-model="selected.internal_notes" rows="6"
                                        placeholder="Add internal review notes…"></textarea>
                                </label>
                                <button v-if="view === 'careers'" class="btn block" @click="resume(selected.id)">↓
                                    Download
                                    resume</button>
                            </div>
                        </div>

                        <div class="modal-foot">
                            <span class="muted">Last updated: {{ dateLabel(selected.updated_at) }}</span>
                            <div>
                                <button class="btn" @click="selected = null">Cancel</button>
                                <button class="btn primary" :disabled="saving" @click="save">{{ saving ? 'Saving…' :  'Save changes'}}</button>
                            </div>
                        </div>
                    </section>
                </div>
            </Transition>
        </template>
    </div>
</template>

<style src="./cms-redesign.css"></style>