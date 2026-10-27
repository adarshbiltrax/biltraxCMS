<script setup>
import Swal from 'sweetalert2';
import { ref, reactive, watch, onMounted, onBeforeUnmount, computed } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import {
    LayoutDashboard,
    Mail,
    BriefcaseBusiness, Sun, Moon, RefreshCw, LogOut, X
} from 'lucide-vue-next';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const theme = ref(localStorage.getItem('biltrax-theme') || 'light');
watch(theme, v => localStorage.setItem('biltrax-theme', v));

const user = ref(null), credentials = reactive({ email: '', password: '' }), view = ref('dashboard'), summary = ref({}), rows = ref([]), selected = ref(null), search = ref(''), status = ref(''), page = ref(1), last = ref(1), loading = ref(false), saving = ref(false), error = ref(''), notice = ref('');
const periods = reactive({ contact: 'daily', careers: 'daily' });
const labels = { dashboard: 'Overview', contact: 'Contact enquiries', careers: 'Career applications' };
// const navItems=[['dashboard','⌂','Overview'],['contact','✉','Contact enquiries'],['careers','▤','Career applications']];
const navItems = [
    ['dashboard', LayoutDashboard, 'Overview'],
    ['contact', Mail, 'Contact Enquiries'],
    ['careers', BriefcaseBusiness, 'Career Applications']
];
const statusLabels = { new: 'New', in_progress: 'In progress', resolved: 'Resolved' };
const hiddenFields = ['internal_notes', 'status', 'resume_path', 'resume_original_name', 'resume_mime', 'resume_size'];
const visibleDetails = computed(() => selected.value ? Object.entries(selected.value).filter(([k]) => !hiddenFields.includes(k)) : []);
const totals = computed(() => ({ contact: Number(summary.value.contact || 0), careers: Number(summary.value.careers || 0) }));

function trendData(type) { const data = summary.value.trends?.[periods[type]] || []; return { labels: data.map(x => x.label), datasets: [{ label: type === 'contact' ? 'Enquiries' : 'Applications', data: data.map(x => Number(x[type] || 0)), backgroundColor: type === 'contact' ? '#6258df' : '#089db5', hoverBackgroundColor: type === 'contact' ? '#493ed1' : '#087d91', borderRadius: 5, maxBarThickness: 35 }] }; }
function donutData(type) { const s = summary.value.status_breakdown?.[type] || {}; return { labels: ['New', 'In progress', 'Resolved'], datasets: [{ data: [s.new || 0, s.in_progress || 0, s.resolved || 0], backgroundColor: ['#7469ec', '#eeb04c', '#27b48a'], borderWidth: 0, hoverOffset: 5 }] }; }
const barOptions = { responsive: true, maintainAspectRatio: false, animation: { duration: 550 }, plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.parsed.y} submissions` } } }, scales: { x: { grid: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8, color: '#8290a5' } }, y: { beginAtZero: true, grid: { color: 'rgba(130,144,165,.18)' }, ticks: { precision: 0, color: '#8290a5' } } } };
const donutOptions = { responsive: true, maintainAspectRatio: false, cutout: '76%', plugins: { legend: { display: false } } };

async function api(path, options = {}) { const r = await fetch('/cms-api' + path, { credentials: 'same-origin', headers: { Accept: 'application/json', 'Content-Type': 'application/json', 'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '' }, ...options }); const text = await r.text(); let d = null; if (text) { try { d = JSON.parse(text); } catch { return r.ok ? text : Promise.reject(new Error('Request failed')); } } if (!r.ok) { if (r.status === 401 || r.status === 403) return null; const message = d && typeof d === 'object' ? (d.message || d.error || 'Request failed') : 'Request failed'; throw new Error(message); } return d; }
// async function login() { error.value = ''; try { const d = await api('/login', { method: 'POST', body: JSON.stringify(credentials) }); if (!d?.user) { throw new Error('Invalid credentials'); } user.value = d.user; await load(); } catch (e) { error.value = e.message; } }
async function login(){
    error.value = '';
    try{
       const csrfToken = await refreshCsrfToken();
        // const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
       const response = await fetch('/cms-api/login',{
        method:'POST',
       headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        body:JSON.stringify(credentials)
       }) ;
        const data = await response.json();

       if(!response.ok){
         throw new Error( data.message ||"Invalid credentails");
       }
        user.value = data.user;
        await load();
    //    console.log("Response Value",data);

    }catch(e){
        error.value = e.message;
        // console.log("Login error",e);
    }
}
// async function logout() { try { await api('/logout', { method: 'POST' }); user.value = null; selected.value = null; rows.value = []; summary.value = {}; notice.value = ''; error.value = ''; } catch (e) { error.value = e.message; } }
// logout function ;
async function logout(){
    try{
        const csrfToken = await refreshCsrfToken();
        // const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        // console.log("CSRF Token",csrfToken);
        const response = await api('/logout',{
            method:'POST',
            headers:{
             'Content-Type':'application/json',
             'Accept':'application/json',
             'X-CSRF-TOKEN': csrfToken
            },
            body:JSON.stringify()
        });
        
        //  console.log("CSRF Token",csrfToken);
        // console.log("Response LogOut",response);
        user.value = null;
        selected.value = null;
        rows.value = [];
        summary.value = {};
        notice.value = '';
        error.value = '';
        
    }catch(e){
         error.value  = e.message;
        //  console.log("Logout error",e);
    }
}

// refresh Token genrate:

async function refreshCsrfToken() {
    const response = await fetch('/csrf-token', {
        method: 'GET',
        credentials: 'same-origin',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error('Unable to refresh CSRF token');
    }

    const data = await response.json();

    const meta = document.querySelector('meta[name="csrf-token"]');

    if (meta && data.token) {
        meta.setAttribute('content', data.token);
    }

    return data.token;
}

async function load() { loading.value = true; error.value = ''; try { const nextSummary = await api('/summary'); summary.value = nextSummary || {}; if (view.value !== 'dashboard') { const q = new URLSearchParams({ page: String(page.value) }); if (search.value) q.set('search', search.value); if (status.value) q.set('status', status.value); const d = await api('/records/' + view.value + '?' + q); rows.value = d?.data || []; last.value = d?.last_page || 1; } } catch (e) { error.value = e.message; } finally { loading.value = false; } }
function navigate(v) { view.value = v; page.value = 1; search.value = ''; status.value = ''; selected.value = null; notice.value = ''; load(); }
async function detail(id) { error.value = ''; try { const d = await api('/records/' + view.value + '/' + id); selected.value = d || null; } catch (e) { error.value = e.message; } }
// async function save() {
//     if (!selected.value) return; saving.value = true; error.value = '';
//     try { const d = await api('/records/' + view.value + '/' + selected.value.id, { method: 'PATCH', body: JSON.stringify({ status: selected.value.status, internal_notes: selected.value.internal_notes }) }); selected.value = d || selected.value; await load(); selected.value = null; notice.value = 'Changes saved successfully'; } catch (e) { error.value = e.message; } finally { saving.value = false; }
// }
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

function onKey(e) { if (e.key === 'Escape') selected.value = null; }
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
            <aside class="sidebar">
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
                <div class="sidebar-bottom">
                    <button class="btn theme-toggle" type="button" @click="theme = theme === 'dark' ? 'light' : 'dark'">
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
            </aside>
            <!-- MAIN -->
            <div class="main">
                <header class="topbar">
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
                                        : 'Review applications and candidate progress.'
                            }}
                        </p>
                    </div>
                    <div class="top-actions">
                        <button class="btn" :disabled="loading" @click="load">
                            <RefreshCw :size="18" :stroke-width="1.8" />Refresh
                        </button>
                        <!-- <button class="btn" @click="theme=theme==='dark'?'light':'dark'">{{theme==='dark'?'☀ Light mode':'☾ Dark mode'}}</button> -->
                    </div>
                </header>

                <main class="content">
                    <p v-if="error" class="banner error-banner" role="alert">{{ error }}</p>
                    <!-- <p v-if="notice" class="banner success-banner">✓ {{ notice }}</p> -->

                    <!-- DASHBOARD -->
                    <template v-if="view === 'dashboard'">
                        <div class="stats">
                            <div v-for="s in [['Contact enquiries', summary.contact, '✉', 'violet'], ['Career applications', summary.careers, '▣', 'teal'], ['New Career', summary.new_careers, '●', 'indigo'],['New Contact', summary.new_contact, '●', 'indigo'], ['In progress', summary.in_progress, '◷', 'gold'], ['Resolved', summary.resolved, '✓', 'mint']]"
                                :key="s[0]" class="stat card">
                                <div :class="['stat-icon', s[3]]">{{ s[2] }}</div>
                                <p>{{ s[0] }}</p>
                                <strong>{{ s[1] ?? 0 }}</strong>
                                <small>All-time submissions</small>
                            </div>
                        </div>

                        <div class="grid-2">
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

                        <div class="grid-2">
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

                    <!-- RECORDS TABLE -->
                    <section v-else class="card records">
                        <div class="records-head">
                            <div>
                                <h2>{{ labels[view] }}</h2>
                                <p class="muted">Search, review and update submitted records.</p>
                            </div>
                            <span class="count">{{ rows.length }} on this page</span>
                        </div>
                        <div class="toolbar">
                            <input v-model="search" placeholder="Search by name, email or company"
                                @keyup.enter="page = 1; load()" />
                            <select v-model="status" @change="page = 1; load()">
                                <option value="">All statuses</option>
                                <option value="new">New</option>
                                <option value="in_progress">In progress</option>
                                <option value="resolved">Resolved</option>
                            </select>
                            <button class="btn primary" @click="page = 1; load()">Search</button>
                            <button class="btn" @click="search = ''; status = ''; page = 1; load()">Reset</button>
                        </div>
                        <div class="overflow">
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