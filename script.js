// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');
const socialTopbar = document.getElementById('socialTopbar');
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  navbar.classList.toggle('scrolled', scrolled);
  if (socialTopbar) {
    if (scrolled) {
      socialTopbar.style.transform = 'translateY(-100%)';
      navbar.style.top = '0';
    } else {
      socialTopbar.style.transform = 'translateY(0)';
      navbar.style.top = '33px';
    }
  }
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 100);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
const statNumbers = document.querySelectorAll('.stat-number');
let countersStarted = false;

function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  statNumbers.forEach(el => {
    const target = parseInt(el.dataset.target);
    const suffix = el.textContent.replace(/[0-9]/g, '');
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const update = () => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        return;
      }
      el.textContent = Math.floor(current) + suffix;
      requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const trustSection = document.querySelector('.trust-section');
if (trustSection) statsObserver.observe(trustSection);

// ===== PARTICLE CANVAS =====
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animId;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

class Particle {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.3 + 0.1;
    this.fadeDir = Math.random() > 0.5 ? 1 : -1;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.opacity += this.fadeDir * 0.002;
    if (this.opacity <= 0.05 || this.opacity >= 0.4) this.fadeDir *= -1;
    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 168, 67, ${this.opacity})`;
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000));
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(212, 168, 67, ${0.06 * (1 - dist / 120)})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  animId = requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== CURRENCY CONVERTER =====
let currentRate = 0;

async function fetchRate() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    currentRate = data.rates.IDR;
    const formatted = new Intl.NumberFormat('id-ID', { style: 'decimal', maximumFractionDigits: 2 }).format(currentRate);
    document.getElementById('liveRate').textContent = 'Rp ' + formatted;
    const updateTime = new Date(data.time_last_update_utc).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
    document.getElementById('rateUpdate').textContent = 'Terakhir diperbarui: ' + updateTime;
  } catch (err) {
    document.getElementById('liveRate').textContent = 'Gagal memuat';
    document.getElementById('rateUpdate').textContent = 'Coba refresh halaman';
  }
}

fetchRate();

const usdInput = document.getElementById('usdInput');
const idrInput = document.getElementById('idrInput');
const calcResult = document.getElementById('calcResult');

function formatIDR(num) {
  return new Intl.NumberFormat('id-ID', { maximumFractionDigits: 2 }).format(num);
}

function formatUSD(num) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);
}

usdInput.addEventListener('input', () => {
  if (!currentRate) return;
  const usd = parseFloat(usdInput.value);
  if (isNaN(usd) || usd === 0) {
    idrInput.value = '';
    calcResult.textContent = 'Masukkan angka untuk melihat hasil konversi';
    return;
  }
  const idr = usd * currentRate;
  idrInput.value = Math.round(idr);
  calcResult.textContent = `$${formatUSD(usd)} = Rp ${formatIDR(idr)}`;
});

idrInput.addEventListener('input', () => {
  if (!currentRate) return;
  const idr = parseFloat(idrInput.value);
  if (isNaN(idr) || idr === 0) {
    usdInput.value = '';
    calcResult.textContent = 'Masukkan angka untuk melihat hasil konversi';
    return;
  }
  const usd = idr / currentRate;
  usdInput.value = usd.toFixed(2);
  calcResult.textContent = `Rp ${formatIDR(idr)} = $${formatUSD(usd)}`;
});

document.getElementById('calcSwap').addEventListener('click', () => {
  const tempVal = usdInput.value;
  usdInput.value = idrInput.value;
  idrInput.value = tempVal;
  usdInput.dispatchEvent(new Event('input'));
});

// ===== AI CHATBOT =====
const chatFab = document.getElementById('chatFab');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatBadge = document.getElementById('chatBadge');
let chatOpened = false;

const botKnowledge = [
  { keys: ['trader kampoeng', 'apa itu tk', 'tentang'], reply: 'Trader Kampoeng adalah komunitas trading Indonesia yang fokus pada EA (Expert Advisor) dan Copy Trade untuk trading gold (XAUUSD). Kami menggunakan sistem Low Risk High Reward yang sudah terbukti menghasilkan profit konsisten. Gabung GRATIS!' },
  { keys: ['gabung', 'join', 'daftar', 'cara gabung', 'cara join'], reply: 'Untuk gabung Trader Kampoeng sangat mudah dan GRATIS! Cukup hubungi kami via WhatsApp:\n\n👉 https://wa.me/message/XCAEAC4OQBPPD1\n\nTim kami akan membantu setup dari awal.' },
  { keys: ['ea', 'expert advisor', 'robot'], reply: 'EA (Expert Advisor) adalah robot trading otomatis yang kami kembangkan. Cukup pasang di MT4/MT5, dan EA akan trading secara otomatis 24/7 dengan sistem Low Risk High Reward. Win rate mencapai 95%!' },
  { keys: ['copy trade', 'copytrade', 'copy'], reply: 'Copy Trade memungkinkan kamu mengikuti posisi trading dari master trader kami secara otomatis. Tanpa perlu analisa manual — cukup copy dan profit bareng!' },
  { keys: ['modal', 'minimum', 'deposit', 'berapa modal'], reply: 'Modal minimum untuk memulai sangat terjangkau! Kamu bisa mulai dari $1 (akun cent = 100 cent). Kami sudah pernah buktikan $1 menjadi $1,000 dalam 2 minggu!' },
  { keys: ['profit', 'hasil', 'keuntungan', 'bagi hasil'], reply: 'Sistem bagi hasil di Trader Kampoeng: 70% untuk pemodal dan 30% untuk pengelola. Sangat menguntungkan karena kamu tidak perlu trading sendiri!' },
  { keys: ['tier', 'jenjang', 'karir', 'level'], reply: 'Trader Kampoeng memiliki 5 Tier jenjang karir trader, dari pemula hingga master. Setiap tier memiliki benefit dan fasilitas yang meningkat!' },
  { keys: ['founder', 'tri subanadji', 'owner', 'pemilik'], reply: 'Founder Trader Kampoeng adalah Tri Subanadji (@TriSubanadji). Beliau sudah bertahun-tahun di industri trading dan mengembangkan sistem EA dan Copy Trade untuk membantu trader Indonesia.' },
  { keys: ['record', 'track record', 'pencapaian', 'bukti'], reply: 'Track record kami:\n🏆 $1 → $1,000 dalam 2 minggu (akun cent)\n🔥 $300 → $9,000 dalam 3 hari (akun cent)\n\nSemua dengan sistem Low Risk High Reward!' },
  { keys: ['kontak', 'hubungi', 'whatsapp', 'wa', 'telepon', 'konsultasi'], reply: 'Hubungi kami untuk konsultasi langsung:\n\n📱 WhatsApp: https://wa.me/message/XCAEAC4OQBPPD1\n🕐 Jam kerja: 08.00 - 22.00 WIB\n\nKonsultasi langsung dengan Tri Subanadji & Tim!' },
  { keys: ['tiktok', 'instagram', 'ig', 'discord', 'sosial', 'social media'], reply: 'Follow kami di social media:\n\n🎵 TikTok: @traderkampoeng\n📸 Instagram: @traderkampoeng\n💬 Discord: discord.gg/traderkampoeng' },
  { keys: ['gold', 'xauusd', 'emas', 'trading apa'], reply: 'Kami fokus trading XAUUSD (Gold/Emas). Pasar emas adalah salah satu yang paling liquid dan profitable. Kamu bisa lihat chart realtime XAUUSD di website kami di bagian Chart!' },
  { keys: ['risk', 'risiko', 'aman', 'low risk'], reply: 'Trader Kampoeng menggunakan sistem Low Risk High Reward. Artinya risiko per trade dijaga seminimal mungkin, sementara target profit dimaksimalkan. Ini membuat trading lebih aman dan terukur.' },
  { keys: ['mt4', 'mt5', 'metatrader', 'platform', 'broker'], reply: 'EA kami bisa digunakan di platform MetaTrader 4 (MT4) dan MetaTrader 5 (MT5). Tim kami akan membantu setup dari awal termasuk pemilihan broker yang tepat.' },
  { keys: ['gratis', 'free', 'bayar', 'biaya', 'harga'], reply: 'Gabung komunitas Trader Kampoeng itu GRATIS! Tidak ada biaya pendaftaran. Kamu hanya perlu menyiapkan modal trading minimal. Hubungi kami via WhatsApp untuk info lebih lanjut.' },
  { keys: ['kurs', 'kalkulator', 'rupiah', 'dolar', 'idr', 'usd'], reply: 'Kamu bisa cek kurs USD/IDR terbaru dan gunakan kalkulator konversi langsung di website kami! Scroll ke bagian "Kalkulator" atau klik menu Kalkulator di navbar.' },
];

function getBotReply(msg) {
  const lower = msg.toLowerCase();
  for (const item of botKnowledge) {
    if (item.keys.some(k => lower.includes(k))) return item.reply;
  }
  if (lower.includes('halo') || lower.includes('hai') || lower.includes('hi') || lower.includes('hello')) {
    return 'Halo! 👋 Selamat datang di Trader Kampoeng. Ada yang bisa saya bantu? Kamu bisa tanya tentang EA, Copy Trade, cara gabung, modal minimum, dan lainnya!';
  }
  if (lower.includes('terima kasih') || lower.includes('thanks') || lower.includes('makasih')) {
    return 'Sama-sama! 😊 Jika ada pertanyaan lain, jangan ragu untuk bertanya. Sukses selalu di trading!';
  }
  return 'Terima kasih atas pertanyaannya! Untuk informasi lebih detail, silakan hubungi tim kami langsung via WhatsApp:\n\n👉 https://wa.me/message/XCAEAC4OQBPPD1\n\nAtau coba tanya tentang: EA, Copy Trade, modal minimum, cara gabung, atau track record kami.';
}

function addMsg(text, type) {
  const div = document.createElement('div');
  div.className = `chat-msg ${type}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTyping() {
  const div = document.createElement('div');
  div.className = 'chat-msg bot typing';
  div.id = 'typingIndicator';
  div.innerHTML = '<div class="typing-dots"><span></span><span></span><span></span></div>';
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function removeTyping() {
  const el = document.getElementById('typingIndicator');
  if (el) el.remove();
}

function sendMessage(text) {
  if (!text.trim()) return;
  addMsg(text, 'user');
  chatInput.value = '';
  showTyping();
  const delay = 600 + Math.random() * 800;
  setTimeout(() => {
    removeTyping();
    addMsg(getBotReply(text), 'bot');
  }, delay);
}

chatFab.addEventListener('click', () => {
  chatWindow.classList.toggle('active');
  if (!chatOpened) {
    chatOpened = true;
    chatBadge.classList.add('hidden');
    setTimeout(() => {
      addMsg('Halo! 👋 Saya AI Assistant Trader Kampoeng. Ada yang bisa saya bantu?\n\nKamu bisa tanya tentang EA, Copy Trade, cara gabung, modal minimum, dan lainnya!', 'bot');
    }, 400);
  }
});

chatClose.addEventListener('click', () => {
  chatWindow.classList.remove('active');
});

chatSend.addEventListener('click', () => sendMessage(chatInput.value));
chatInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') sendMessage(chatInput.value);
});

document.querySelectorAll('.chat-quick-btn').forEach(btn => {
  btn.addEventListener('click', () => sendMessage(btn.dataset.q));
});
