<script setup>

import { ref, reactive, watch, onMounted, computed } from 'vue';

import { Bar, Doughnut } from 'vue-chartjs';

import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const theme = ref(localStorage.getItem('biltrax-theme') || 'light');

watch(theme, v => localStorage.setItem('biltrax-theme', v));

const user=ref(null),credentials=reactive({email:'',password:''}),view=ref('dashboard'),summary=ref({}),rows=ref([]),selected=ref(null),search=ref(''),status=ref(''),page=ref(1),last=ref(1),loading=ref(false),saving=ref(false),error=ref(''),notice=ref('');

const periods=reactive({contact:'daily',careers:'daily'});

const labels={dashboard:'Overview',contact:'Contact enquiries',careers:'Career applications'};

const statusLabels={new:'New',in_progress:'In progress',resolved:'Resolved'};

const hiddenFields=['internal_notes','status','resume_path','resume_original_name','resume_mime','resume_size'];

const visibleDetails=computed(()=>selected.value?Object.entries(selected.value).filter(([k])=>!hiddenFields.includes(k)):[]);

const totals=computed(()=>({contact:Number(summary.value.contact||0),careers:Number(summary.value.careers||0)}));

function trendData(type){const data=summary.value.trends?.[periods[type]]||[];return {labels:data.map(x=>x.label),datasets:[{label:type==='contact'?'Enquiries':'Applications',data:data.map(x=>Number(x[type]||0)),backgroundColor:type==='contact'?'#6258df':'#089db5',hoverBackgroundColor:type==='contact'?'#493ed1':'#087d91',borderRadius:5,maxBarThickness:35}]};}

function donutData(type){const s=summary.value.status_breakdown?.[type]||{};return {labels:['New','In progress','Resolved'],datasets:[{data:[s.new||0,s.in_progress||0,s.resolved||0],backgroundColor:['#7469ec','#eeb04c','#27b48a'],borderWidth:0,hoverOffset:5}]};}

const barOptions={responsive:true,maintainAspectRatio:false,animation:{duration:550},plugins:{legend:{display:false},tooltip:{callbacks:{label:c=>`${c.parsed.y} submissions`}}},scales:{x:{grid:{display:false},ticks:{maxRotation:0,autoSkip:true,maxTicksLimit:8,color:'#8290a5'}},y:{beginAtZero:true,grid:{color:'#edf0f6'},ticks:{precision:0,color:'#8290a5'}}}};

const donutOptions={responsive:true,maintainAspectRatio:false,cutout:'76%',plugins:{legend:{display:false}}};

async function api(path,options={}){const r=await fetch('/cms-api'+path,{credentials:'same-origin',headers:{Accept:'application/json','Content-Type':'application/json','X-CSRF-TOKEN':document.querySelector('meta[name="csrf-token"]')?.content||''},...options});const d=await r.json();if(!r.ok)throw new Error(d.message||'Request failed');return d;}

async function login(){error.value='';try{const d=await api('/login',{method:'POST',body:JSON.stringify(credentials)});user.value=d.user;await load();}catch(e){error.value=e.message;}}

async function logout(){try{await api('/logout',{method:'POST'});user.value=null;selected.value=null;rows.value=[];}catch(e){error.value=e.message;}}

async function load(){loading.value=true;error.value='';try{summary.value=await api('/summary');if(view.value!=='dashboard'){const q=new URLSearchParams({page:String(page.value)});if(search.value)q.set('search',search.value);if(status.value)q.set('status',status.value);const d=await api('/records/'+view.value+'?'+q);rows.value=d.data;last.value=d.last_page||1;}}catch(e){error.value=e.message;}finally{loading.value=false;}}

function navigate(v){view.value=v;page.value=1;search.value='';status.value='';selected.value=null;notice.value='';load();}

async function detail(id){error.value='';try{selected.value=await api('/records/'+view.value+'/'+id);}catch(e){error.value=e.message;}}

async function save(){if(!selected.value)return;saving.value=true;error.value='';try{selected.value=await api('/records/'+view.value+'/'+selected.value.id,{method:'PATCH',body:JSON.stringify({status:selected.value.status,internal_notes:selected.value.internal_notes})});await load();selected.value=null;notice.value='Changes saved successfully';}catch(e){error.value=e.message;}finally{saving.value=false;}}

async function resume(id){try{const d=await api('/resume/'+id);window.open(d.url,'_blank','noopener,noreferrer');}catch(e){error.value=e.message;}}

function niceKey(k){return k.replaceAll('_',' ').replace(/\b\w/g,x=>x.toUpperCase());}

function formatValue(v,k){if(v===null||v===undefined||v==='')return '—';if(typeof v==='boolean')return v?'Yes':'No';if(Array.isArray(v))return v.join(', ')||'—';if(typeof v==='object')return JSON.stringify(v);if(k.endsWith('_at')){const d=new Date(v);return isNaN(d)?String(v):d.toLocaleString();}return String(v);}

function dateLabel(v){if(!v)return '—';const d=new Date(v);return isNaN(d)?'—':d.toLocaleDateString(undefined,{day:'2-digit',month:'short',year:'numeric'});}

onMounted(async()=>{try{const d=await api('/me');user.value=d.user;await load();}catch{}});

</script>



<template>

<div class="app" :data-theme="theme">

 <div v-if="!user" class="login-shell">

  <div class="login card"><div class="logo">biltrax<span>.</span></div><p class="eyebrow">MANAGEMENT CONSOLE</p><h1>Welcome back</h1><p class="muted">Sign in to manage website submissions.</p>

   <form @submit.prevent="login"><label>Email<input v-model="credentials.email" type="email" required autocomplete="username" /></label><label>Password<input v-model="credentials.password" type="password" required autocomplete="current-password" /></label><button class="btn primary" type="submit">Sign in →</button></form><p v-if="error" class="error">{{error}}</p>

  </div>

 </div>

 <template v-else>

  <aside class="sidebar">

   <div>

    <div class="logo">biltrax<span></span></div>

    <!-- <p class="eyebrow sidebar-sub">MANAGEMENT CONSOLE</p>

    <p class="menu-label">WORKSPACE</p> -->



    <button v-for="n in [['dashboard','⌂','Overview'],['contact','✉','Contact enquiries'],['careers','▤','Career applications']]" :key="n[0]" :class="['nav',view===n[0]?'active':'']" @click="navigate(n[0])"><span class="nav-icon" aria-hidden="true">{{n[1]}}</span><span class="nav-label">{{n[2]}}</span><span v-if="view===n[0]" class="nav-chevron">›</span></button>

   </div><div class="sidebar-foot"><div class="avatar">{{(user.name||'A').slice(0,1).toUpperCase()}}</div><div class="user-meta"><strong>{{user.name}}</strong><small>Administrator</small></div><button class="logout" title="Sign out" aria-label="Sign out" @click="logout">⏻</button></div>

  </aside>

  <main class="main">

   <header class="topbar"><div><p class="eyebrow">BILTRAX <span class="crumb">/ {{view.toUpperCase()}}</span></p><h1>{{labels[view]}}</h1><p class="muted subtitle">{{view==='dashboard'?'Your website operations and submission insights.':view==='contact'?'Review and manage incoming enquiries.':'Review applications and candidate progress.'}}</p></div><div class="top-actions"><button class="btn" title="Refresh" :disabled="loading" @click="load">↻ Refresh</button><button class="btn" @click="theme=theme==='dark'?'light':'dark'">{{theme==='dark'?'☀ Light mode':'☾ Dark mode'}}</button></div></header>

   <p v-if="error" class="error banner" role="alert">{{error}}</p><p v-if="notice" class="success banner">✓ {{notice}}</p>

   <template v-if="view==='dashboard'">

    <div class="stats"><div v-for="s in [['Contact enquiries',summary.contact,'✉','violet'],['Career applications',summary.careers,'▣','teal'],['New',summary.new,'●','indigo'],['In progress',summary.in_progress,'◷','gold'],['Resolved',summary.resolved,'✓','mint']]" :key="s[0]" class="stat card"><div :class="['stat-icon',s[3]]">{{s[2]}}</div><p>{{s[0]}}</p><strong>{{s[1]??0}}</strong><small>All-time submissions</small></div></div>

    <div class="analytics-grid">

     <section v-for="type in ['contact','careers']" :key="type" class="card analytics-card">

      <div class="analytics-head"><div><div class="section-tag">{{type==='contact'?'CONTACT ENQUIRIES':'CAREER APPLICATIONS'}}</div><h2>{{type==='contact'?'Enquiry activity':'Application activity'}}</h2><p class="muted">Submissions over time</p></div><div class="segmented"><button :class="{chosen:periods[type]==='daily'}" @click="periods[type]='daily'">Daily</button><button :class="{chosen:periods[type]==='monthly'}" @click="periods[type]='monthly'">Monthly</button></div></div>

      <div class="chart-area"><Bar :data="trendData(type)" :options="barOptions" /></div>

      <div class="analytics-foot"><span class="foot-dot" :class="type"></span>{{type==='contact'?'Enquiries received':'Applications received'}} <strong>{{totals[type]}}</strong></div>

     </section>

    </div>

    <div class="analytics-grid distribution-grid"><section v-for="type in ['contact','careers']" :key="type" class="card distribution-card"><div><div class="section-tag">{{type==='contact'?'ENQUIRY WORKFLOW':'RECRUITMENT WORKFLOW'}}</div><h2>{{type==='contact'?'Enquiry status':'Application status'}}</h2><p class="muted">Current distribution by status</p></div><div class="distribution-content"><div class="donut-wrap"><Doughnut :data="donutData(type)" :options="donutOptions" /><div class="donut-center"><strong>{{totals[type]}}</strong><small>Total</small></div></div><div class="status-list"><div v-for="s in [['new','New'],['in_progress','In progress'],['resolved','Resolved']]" :key="s[0]"><span><i :class="s[0]"></i>{{s[1]}}</span><strong>{{summary.status_breakdown?.[type]?.[s[0]]??0}}</strong></div></div></div></section></div>

    <section class="card quick"><div><h2>Quick actions</h2><p class="muted">Open a workspace to review submissions and update their status.</p></div><div class="quick-buttons"><button class="btn primary" @click="navigate('contact')">View enquiries →</button><button class="btn" @click="navigate('careers')">View applicants →</button></div></section>

   </template>

   <section v-else class="card records"><div class="records-head"><div><h2>{{labels[view]}}</h2><p class="muted">Search, review and update submitted records.</p></div><span class="count">{{rows.length}} on this page</span></div><div class="toolbar"><input v-model="search" placeholder="Search by name or email" @keyup.enter="page=1;load()" /><select v-model="status" @change="page=1;load()"><option value="">All statuses</option><option value="new">New</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option></select><button class="btn primary" @click="page=1;load()">Search</button><button class="btn" @click="search='';status='';page=1;load()">Reset</button></div><div class="overflow"><table><thead><tr><th>Name</th><th>Email</th><th>{{view==='contact'?'Company':'Interest'}}</th><th>Status</th><th>Submitted</th><th>Action</th></tr></thead><tbody><tr v-for="r in rows" :key="r.id"><td><div class="person"><span class="person-avatar">{{(r.full_name||'?').slice(0,1).toUpperCase()}}</span><strong>{{r.full_name}}</strong></div></td><td>{{r.work_email||r.email}}</td><td>{{r.company||r.area_of_interest||'—'}}</td><td><span :class="['pill',r.status]">{{statusLabels[r.status]||r.status}}</span></td><td>{{dateLabel(r.created_at)}}</td><td><button class="btn review" @click="detail(r.id)">Review →</button></td></tr><tr v-if="!rows.length"><td colspan="6" class="no-records">{{loading?'Loading…':'No records found'}}</td></tr></tbody></table></div><div class="pager"><span>Page {{page}} of {{last}}</span><div><button class="btn" :disabled="page<=1||loading" @click="page--;load()">← Previous</button><button class="btn" :disabled="page>=last||loading" @click="page++;load()">Next →</button></div></div></section>

  </main>

  <Transition name="modal"><div v-if="selected" class="overlay" @click.self="selected=null"><section class="review-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div class="modal-head"><div class="modal-person"><span class="modal-avatar">{{(selected.full_name||'?').slice(0,1).toUpperCase()}}</span><div><p class="eyebrow">{{view==='contact'?'ENQUIRY':'APPLICATION'}} DETAILS · #{{selected.id}}</p><h2 id="modal-title">{{selected.full_name}}</h2><span :class="['pill',selected.status]">{{statusLabels[selected.status]||selected.status}}</span></div></div><button class="btn close-btn" aria-label="Close" @click="selected=null">✕</button></div><div class="modal-body"><div class="detail-section"><h3>Submitted information</h3><p class="muted">Details provided through the website form</p><div class="detail-grid"><div v-for="entry in visibleDetails" :key="entry[0]" class="detail-item"><span>{{niceKey(entry[0])}}</span><p>{{formatValue(entry[1],entry[0])}}</p></div></div></div><div class="edit-section"><div class="edit-heading"><span class="edit-heading-icon">✎</span><div><h3>Review & update</h3><p class="muted">Manage workflow status and notes.</p></div></div><label>Status<select v-model="selected.status"><option value="new">New</option><option value="in_progress">In progress</option><option value="resolved">Resolved</option></select></label><label>Internal notes<textarea v-model="selected.internal_notes" rows="6" placeholder="Add internal review notes…"></textarea></label><button v-if="view==='careers'" class="btn resume" @click="resume(selected.id)">↓ Download resume</button></div></div><div class="modal-foot"><span class="muted">Last updated: {{dateLabel(selected.updated_at)}}</span><div><button class="btn" @click="selected=null">Cancel</button><button class="btn primary" :disabled="saving" @click="save">{{saving?'Saving…':'✓ Save changes'}}</button></div></div></section></div></Transition>

 </template>

</div>

</template>

<style src="./cms-redesign.css"></style>
