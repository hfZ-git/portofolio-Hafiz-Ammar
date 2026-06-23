/* ============================================================
   script.js — Semua Interaksi, Logika, dan Efek Dinamis
   Pelajari: DOM Manipulation, Event, IntersectionObserver, dll.
   ============================================================ */

// ─── 1. DATA PROJECT ───────────────────────────────────────
// Ubah isi array ini sesuai project kamu!
const projects = [
  {
    id: 1,
    title: "",
    category: "",
    badge: "",
    badgeClass: "badge-network",
    desc: "---",
    fullDesc: "---",
    tags: ["Cisco", "Packet Tracer", "VLAN", "OSPF", "ACL"],
    gradient: "linear-gradient(135deg, #3b0764, #1e1b4b)",
    icon: "ri-router-line",
    link: "#"
  },
  {
    id: 2,
    title: "",
    category: "",
    badge: "",
    badgeClass: "badge-web",
    desc: "---",
    fullDesc: "---",
    tags: ["HTML", "CSS", "JavaScript", "PHP", "MySQL"],
    gradient: "linear-gradient(135deg, #0c4a6e, #0d3b2e)",
    icon: "ri-global-line",
    link: "#"
  },
  {
    id: 3,
    title: "Super Lab",
    category: "server",
    badge: "Server",
    badgeClass: "badge-server",
    desc: "Instalasi dan konfigurasi server Debian sebagai file server, web server (Apache), dan DNS lokal untuk lab komputer sekolah.",
    fullDesc: "Implementasi server multi-fungsi menggunakan Debian 10. Layanan yang dikonfigurasi: Samba file server untuk berbagi file antar komputer Windows/Linux, Apache2 web server, BIND9 DNS lokal, dan OpenSSH untuk remote management. Dokumentasi lengkap tersedia.",
    tags: ["Debian", "Apache", "Samba", "DNS", "SSH", "Mail Server"],
    gradient: "linear-gradient(135deg, #064e3b, #1a3a1a)",
    icon: "ri-server-line",
    link: "https://drive.google.com/file/d/10vdqn51a_Iyg_7-v_tuZ1ePZMBzmbJFw/view"
  },
  {
    id: 4,
    title: "",
    category: "",
    badge: "",
    badgeClass: "badge-network",
    desc: "---",
    fullDesc: "---",
    tags: ["MikroTik", "Hotspot", "RouterOS", "PPPoE", "QoS"],
    gradient: "linear-gradient(135deg, #4c1d95, #1e1b4b)",
    icon: "ri-wifi-line",
    link: "#"
  },
  {
    id: 5,
    title: "",
    category: "",
    badge: "",
    badgeClass: "badge-web",
    desc: "---",
    fullDesc: "---",
    tags: ["PHP", "MySQL", "QR Code", "Bootstrap", "AJAX"],
    gradient: "linear-gradient(135deg, #0c4a6e, #1e3a5f)",
    icon: "ri-qr-code-line",
    link: "#"
  },
  {
    id: 6,
    title: "",
    category: "",
    badge: "",
    badgeClass: "badge-server",
    desc: "---",
    fullDesc: "---",
    tags: ["Wireshark", "TCP/IP", "Network Analysis", "Security"],
    gradient: "linear-gradient(135deg, #7f1d1d, #1c1c1c)",
    icon: "ri-line-chart-line",
    link: "#"
  }
];

// ─── 2. KURSOR CUSTOM ──────────────────────────────────────
// Membuat titik dan cincin mengikuti posisi mouse
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

// Hanya aktifkan di perangkat dengan mouse (bukan layar sentuh)
if (cursorDot && cursorRing) {
  document.addEventListener('mousemove', (e) => {
    // translate(-50%) sudah dihandle CSS, kita cukup set left/top
    cursorDot.style.left  = e.clientX + 'px';
    cursorDot.style.top   = e.clientY + 'px';
    cursorRing.style.left = e.clientX + 'px';
    cursorRing.style.top  = e.clientY + 'px';
  });

  // Saat hover elemen interaktif → cincin melebar
  document.querySelectorAll('a, button, .project-card, .glass-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ─── 3. TOAST NOTIFIKASI ──────────────────────────────────
// Fungsi global untuk menampilkan toast dari mana saja di HTML
let toastTimer; // Menyimpan timer agar tidak bertabrakan

function showToast(msg = 'Berhasil!') {
  const toast   = document.getElementById('toast');
  const toastMsg = document.getElementById('toastMsg');
  if (!toast) return;

  toastMsg.textContent = msg;
  toast.classList.add('show');    // Muncul (slide dari kanan)

  // Hapus timer lama jika ada, lalu set yang baru
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show'); // Hilang otomatis setelah 2.8 detik
  }, 2800);
}

// ─── 4. COPY EMAIL ─────────────────────────────────────────
function copyEmail() {
  const email = document.getElementById('emailValue')?.textContent;
  if (!email) return;

  // Menggunakan Clipboard API modern
  navigator.clipboard.writeText(email)
    .then(() => showToast('📋 Email berhasil disalin!'))
    .catch(() => {
      // Fallback untuk browser lama
      const temp = document.createElement('input');
      temp.value = email;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      showToast('📋 Email berhasil disalin!');
    });
}

// ─── 5. KIRIM EMAIL VIA MAILTO ─────────────────────────────
function sendEmail() {
  const name  = document.getElementById('formName')?.value.trim();
  const email = document.getElementById('formEmail')?.value.trim();
  const msg   = document.getElementById('formMsg')?.value.trim();

  // Validasi sederhana
  if (!name || !email || !msg) {
    showToast('⚠️ Harap isi semua kolom!');
    return;
  }

  // Buka aplikasi email bawaan dengan data sudah terisi
  const mailtoLink = `mailto:hafisammar11@gmail.com?subject=Pesan dari ${encodeURIComponent(name)}&body=${encodeURIComponent(`Halo Hafiz,\n\n${msg}\n\nDari: ${name}\nEmail: ${email}`)}`;
  window.open(mailtoLink, '_blank');
  showToast('📧 Membuka aplikasi email...');
}

// ─── 6. NAVIGASI SCROLL ────────────────────────────────────
const navbar    = document.getElementById('navbar');
const navLinks  = document.querySelectorAll('.nav-link');
const sections  = document.querySelectorAll('section[id]');
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('navLinks');

// Navbar berubah style saat scroll ke bawah
window.addEventListener('scroll', () => {
  // Efek navbar sticky dengan background
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Highlight menu sesuai section yang sedang dilihat
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) current = sec.id;
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
});

// Smooth scroll saat klik menu navigasi
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1); // Hapus '#'
    const target = document.getElementById(targetId);
    if (target) {
      const offset = 80; // Tinggi navbar
      const top = target.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    // Tutup menu mobile jika sedang terbuka
    navMenu.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

// Toggle hamburger menu untuk mobile
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navMenu.classList.toggle('open');
});

// ─── 7. PARTIKEL HERO ──────────────────────────────────────
// Membuat titik-titik kecil yang melayang di background hero
function createParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;

  const count = 22; // Jumlah partikel
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';

    const size  = Math.random() * 4 + 2;   // Ukuran: 2–6px
    const left  = Math.random() * 100;      // Posisi horizontal: 0–100%
    const delay = Math.random() * 12;       // Jeda mulai: 0–12 detik
    const dur   = Math.random() * 10 + 10; // Durasi: 10–20 detik

    // Bergantian warna biru
    const color = i % 2 === 0
      ? `rgba(59,130,246,${Math.random() * 0.4 + 0.1})`
      : `rgba(96,165,250,${Math.random() * 0.4 + 0.1})`;

    Object.assign(p.style, {
      width:          size + 'px',
      height:         size + 'px',
      left:           left + '%',
      background:     color,
      animationDelay: delay + 's',
      animationDuration: dur + 's',
    });

    container.appendChild(p);
  }
}

// ─── 8. TEKS ROLE BERPUTAR (TYPEWRITER EFFECT) ─────────────
const roles = [
  'Cybersecurity',
  'SysAdmin',
  'IT Support',
];

let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function typeRole() {
  const el = document.getElementById('roleText');
  if (!el) return;

  const fullText = roles[roleIndex];

  if (isDeleting) {
    // Hapus karakter satu per satu
    el.textContent = fullText.slice(0, charIndex - 1);
    charIndex--;
  } else {
    // Ketik karakter satu per satu
    el.textContent = fullText.slice(0, charIndex + 1);
    charIndex++;
  }

  // Tentukan delay berikutnya
  let delay = isDeleting ? 60 : 110;

  if (!isDeleting && charIndex === fullText.length) {
    // Selesai mengetik → tunggu lalu hapus
    delay = 1800;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Selesai menghapus → pindah ke role berikutnya
    isDeleting = false;
    roleIndex  = (roleIndex + 1) % roles.length;
    delay = 400;
  }

  setTimeout(typeRole, delay);
}

// ─── 9. TERMINAL ANIMASI ───────────────────────────────────
// Baris-baris yang akan "diketik" di terminal
const terminalLines = [
  { type: 'cmd',  content: 'whoami' },
  { type: 'out',  content: 'hafiz_ammar @ TKJ-Graduate' },
  { type: 'cmd',  content: 'cat skills.txt' },
  { type: 'out',  content: '→ Networking, Linux, Web Dev' },
  { type: 'cmd',  content: 'ping target.perusahaan.com' },
  { type: 'comment', content: '# Reply from: 200.ms TTL=128' },
  { type: 'cmd',  content: 'echo "Siap bekerja keras!"' },
  { type: 'out',  content: 'Siap bekerja keras!' },
  { type: 'cmd',  content: '█' }, // Kursor terminal
];

function buildTerminal() {
  const body = document.getElementById('terminalBody');
  if (!body) return;

  terminalLines.forEach((line, i) => {
    setTimeout(() => {
      const div = document.createElement('div');
      div.className = 't-line';

      if (line.type === 'cmd') {
        div.innerHTML = `<span class="t-prompt">$ </span><span class="t-cmd">${line.content}</span>`;
      } else if (line.type === 'out') {
        div.innerHTML = `<span class="t-out">${line.content}</span>`;
      } else {
        div.innerHTML = `<span class="t-comment">${line.content}</span>`;
      }

      body.appendChild(div);
      // Scroll otomatis ke baris terbaru
      body.scrollTop = body.scrollHeight;
    }, i * 420); // Setiap baris muncul dengan jeda
  });
}

// ─── 10. RENDER CARDS PROJECT ──────────────────────────────
function renderProjects(filter = 'all') {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  // Filter data sesuai kategori yang dipilih
  const filtered = filter === 'all'
    ? projects
    : projects.filter(p => p.category === filter);

  // Kosongkan grid lalu isi ulang
  grid.innerHTML = '';

  filtered.forEach((proj, idx) => {
    const card = document.createElement('div');
    card.className = 'glass-card project-card reveal';
    card.setAttribute('data-category', proj.category);
    // Simpan data project di elemen untuk diambil saat klik
    card.setAttribute('data-id', proj.id);

    card.innerHTML = `
      <!-- Thumbnail (menggunakan gradient warna sebagai pengganti gambar) -->
      <div class="project-card-img-wrap">
        <div style="
          width:100%; height:180px;
          background:${proj.gradient};
          display:flex; align-items:center; justify-content:center;
        ">
          <i class="${proj.icon}" style="font-size:3.5rem;color:rgba(255,255,255,0.25);"></i>
        </div>
      </div>

      <!-- Overlay muncul saat hover -->
      <div class="project-card-overlay">
        <span><i class="ri-eye-line"></i> Lihat Detail</span>
      </div>

      <!-- Isi card -->
      <div class="project-card-body">
        <span class="project-card-badge ${proj.badgeClass}">${proj.badge}</span>
        <h3>${proj.title}</h3>
        <p>${proj.desc}</p>
        <div class="project-tags">
          ${proj.tags.map(t => `<span>${t}</span>`).join('')}
        </div>
      </div>
    `;

    // Klik card → buka modal
    card.addEventListener('click', () => openModal(proj.id));

    grid.appendChild(card);

    // Trigger animasi reveal setelah sedikit delay
    setTimeout(() => card.classList.add('visible'), 50 + idx * 80);
  });
}

// ─── 11. FILTER TOMBOL PROJECT ─────────────────────────────
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    // Hapus 'active' dari semua tombol
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    // Tambahkan 'active' ke tombol yang diklik
    btn.classList.add('active');
    // Render ulang project sesuai filter
    renderProjects(btn.getAttribute('data-filter'));
  });
});

// ─── 12. MODAL PROJECT ─────────────────────────────────────
function openModal(id) {
  const proj    = projects.find(p => p.id === id);
  const overlay = document.getElementById('modalOverlay');
  if (!proj || !overlay) return;

  // Isi konten modal dengan data project
  document.getElementById('modalTitle').textContent = proj.title;
  document.getElementById('modalDesc').textContent  = proj.fullDesc;
  document.getElementById('modalBadge').textContent = proj.badge;
  document.getElementById('modalBadge').className   = `modal-badge ${proj.badgeClass}`;
  document.getElementById('modalLink').href         = proj.link;

  // Ganti gambar dengan gradient (karena tidak ada file gambar nyata)
  const imgEl = document.getElementById('modalImg');
  imgEl.style.display = 'none'; // Sembunyikan img tag
  const imgWrap = document.querySelector('.modal-img-wrap');
  imgWrap.style.cssText = `
    background: ${proj.gradient};
    display: flex; align-items: center; justify-content: center;
    height: 220px;
  `;
  imgWrap.innerHTML = `
    <i class="${proj.icon}" style="font-size:5rem;color:rgba(255,255,255,0.25);"></i>
  `;

  // Render tags
  document.getElementById('modalTags').innerHTML =
    proj.tags.map(t => `<span>${t}</span>`).join('');

  // Tampilkan modal
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden'; // Cegah scroll saat modal terbuka
}

function closeModal() {
  const overlay = document.getElementById('modalOverlay');
  if (overlay) overlay.classList.remove('open');
  document.body.style.overflow = '';
}

// Tombol close
document.getElementById('modalClose')?.addEventListener('click', closeModal);

// Klik luar modal → tutup
document.getElementById('modalOverlay')?.addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// Tekan Escape → tutup modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// ─── 13. ANIMASI SKILL BAR ─────────────────────────────────
// (skill bar dihapus, diganti skill card)

// ─── 14. INTERSECTION OBSERVER ─────────────────────────────
// Memantau elemen yang masuk ke viewport untuk animasi scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, {
  threshold: 0.12,     // Trigger saat 12% elemen terlihat
  rootMargin: '0px 0px -40px 0px'
});

// ─── 15. INISIALISASI SAAT HALAMAN SIAP ────────────────────
// Semua kode di dalam DOMContentLoaded berjalan setelah HTML selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
  // Jalankan semua fungsi inisialisasi
  createParticles();     // Partikel latar hero
  typeRole();            // Teks role berputar
  buildTerminal();       // Animasi terminal
  renderProjects();      // Tampilkan semua project

  // Pasang observer ke semua elemen dengan class 'reveal'
  // (harus setelah renderProjects agar card ter-observe)
  setTimeout(() => {
    document.querySelectorAll('.reveal, .glass-card, .section-title, .section-label').forEach(el => {
      el.classList.add('reveal'); // Pastikan punya class reveal
      observer.observe(el);
    });
  }, 100);

  // ── Hover magnet pada tombol utama ──
  // Tombol bergerak sedikit mengikuti posisi kursor
  document.querySelectorAll('.btn-primary, .btn-ghost').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ── Ripple effect saat klik tombol ──
  document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect   = this.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height);

      Object.assign(ripple.style, {
        width:    size + 'px',
        height:   size + 'px',
        left:     (e.clientX - rect.left - size / 2) + 'px',
        top:      (e.clientY - rect.top  - size / 2) + 'px',
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(255,255,255,0.25)',
        transform: 'scale(0)',
        animation: 'ripple 0.6s ease',
        pointerEvents: 'none',
      });

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Tambahkan animasi ripple ke CSS secara programatik
  const style = document.createElement('style');
  style.textContent = `
    @keyframes ripple {
      to { transform: scale(2.5); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  console.log('%c Portofolio Hafiz Ammar Al Arsyad ', 'background:#1d4ed8;color:#fff;padding:6px 12px;border-radius:4px;font-weight:bold;');
  console.log('💻 Dibangun dengan HTML, CSS, & JavaScript murni.');
});

// ─── 16. HOVER TILT EFFECT PADA CARD ───────────────────────
// Kartu "miring" mengikuti posisi kursor (efek 3D)
document.addEventListener('mouseover', (e) => {
  const card = e.target.closest('.glass-card');
  if (!card || card.closest('.contact-main') || card.closest('.contact-form')) return;

  card.addEventListener('mousemove', handleTilt);
  card.addEventListener('mouseleave', resetTilt);
});

function handleTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width  - 0.5; // -0.5 to 0.5
  const y = (e.clientY - rect.top)  / rect.height - 0.5;

  // Rotasi maksimal ±8 derajat
  card.style.transform = `
    perspective(800px)
    rotateX(${-y * 8}deg)
    rotateY(${x * 8}deg)
    translateY(-4px)
  `;
}

function resetTilt(e) {
  const card = e.currentTarget;
  card.style.transform = '';
  card.removeEventListener('mousemove', handleTilt);
  card.removeEventListener('mouseleave', resetTilt);
}
