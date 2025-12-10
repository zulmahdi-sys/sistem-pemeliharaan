// Smooth scrolling untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Load pengumuman dan agenda di halaman home
function loadPengumumanAgendaHome() {
    // Load Pengumuman
    const pengumumanArray = JSON.parse(localStorage.getItem('pengumuman') || '[]');
    const daftarPengumuman = document.getElementById('daftarPengumumanHome');
    
    if (pengumumanArray.length > 0) {
        daftarPengumuman.innerHTML = '';
        pengumumanArray.slice(-3).reverse().forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'pengumuman-card-home';
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
            const isiText = getField(item, 'isi_pengumuman', 'isi');
            card.innerHTML = `
                <div class="tanggal">${formatDate(getField(item, 'tgl_pengumuman', 'tgl'))}</div>
                <div class="judul">${getField(item, 'judul_pengumuman', 'judul')}</div>
                <div class="isi">${isiText === '-' ? '-' : isiText.substring(0, 100) + (isiText.length > 100 ? '...' : '')}</div>
            `;
            daftarPengumuman.appendChild(card);
        });
    }
    
    // Load Agenda
    const agendaArray = JSON.parse(localStorage.getItem('agenda') || '[]');
    const daftarAgenda = document.getElementById('daftarAgendaHome');
    
    if (agendaArray.length > 0) {
        daftarAgenda.innerHTML = '';
        agendaArray.slice(-3).forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'agenda-card-home';
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
            card.innerHTML = `
                <div class="jam">⏰ ${getField(item, 'jam_agenda', 'jam')}</div>
                <div class="tanggal">${formatDate(getField(item, 'tgl_agenda', 'tgl'))}</div>
                <div class="judul">${getField(item, 'judul_agenda', 'judul_agenda')}</div>
                <div class="pic">👤 ${getField(item, 'pic_agenda', 'pic_agenda')}</div>
                ${getField(item, 'keterangan_agenda', 'keterangan_agenda') !== '-' ? `<div class="keterangan">📝 ${getField(item, 'keterangan_agenda', 'keterangan_agenda')}</div>` : ''}
            `;
            daftarAgenda.appendChild(card);
        });
    }

    // Load Data Perbaikan
    loadDataPerbaikanHome();
    
    // Load Data di masing-masing kategori section
    loadDataPerbaikanCategories();
}

// Load Data Perbaikan ke Home (hanya 3 data terakhir)
function loadDataPerbaikanHome() {
    // Jaringan Listrik
    loadDataHomeTable('listrik', 'tabelListrikHome');
    
    // Air Bersih
    loadDataHomeTable('air-bersih', 'tabelAirBersihHome');
    
    // Air Kotor
    loadDataHomeTable('air-kotor', 'tabelAirKotorHome');
    
    // AC
    loadDataHomeTable('ac', 'tabelACHome');
    
    // Kendaraan
    loadDataHomeTable('kendaraan', 'tabelKendaraanHome');
}

// Load tabel data untuk halaman Home (3 data terakhir)
function loadDataHomeTable(category, containerId) {
    const dataArray = JSON.parse(localStorage.getItem(category) || '[]');
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    if (dataArray.length === 0) {
        container.innerHTML = '<tr><td colspan="100%" class="empty-row">Belum ada data perbaikan</td></tr>';
        return;
    }
    
    container.innerHTML = '';
    
    // Tampilkan hanya 3 data terakhir
    const recentData = dataArray.slice(-3).reverse();
    
    recentData.forEach((item, index) => {
        const row = container.insertRow();
        
        if (category === 'listrik') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_listrik', 'tgl'))}</td>
                <td>${getField(item, 'teknisi_listrik', 'teknisi')}</td>
                <td>${getField(item, 'lokasi_listrik', 'lokasi')}</td>
                <td>${getField(item, 'jenis_kerusakan_listrik', 'jenis_kerusakan')}</td>
                <td>${getField(item, 'deskripsi_listrik', 'deskripsi')}</td>
            `;
        } else if (category === 'air-bersih') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_air_bersih', 'tgl'))}</td>
                <td>${getField(item, 'teknisi_air_bersih', 'teknisi')}</td>
                <td>${getField(item, 'lokasi_air_bersih', 'lokasi')}</td>
                <td>${getField(item, 'jenis_pekerjaan_air_bersih', 'jenis_pekerjaan')}</td>
                <td>${getField(item, 'deskripsi_air_bersih', 'deskripsi')}</td>
            `;
        } else if (category === 'air-kotor') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_air_kotor', 'tgl'))}</td>
                <td>${getField(item, 'teknisi_air_kotor', 'teknisi')}</td>
                <td>${getField(item, 'lokasi_air_kotor', 'lokasi')}</td>
                <td>${getField(item, 'jenis_pekerjaan_air_kotor', 'jenis_pekerjaan')}</td>
                <td>${getField(item, 'deskripsi_air_kotor', 'deskripsi')}</td>
            `;
        } else if (category === 'ac') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_ac', 'tgl'))}</td>
                <td>${getField(item, 'teknisi_ac', 'teknisi')}</td>
                <td>${getField(item, 'lokasi_ac', 'lokasi')}</td>
                <td>${getField(item, 'jenis_pekerjaan_ac', 'jenis_pekerjaan')}</td>
                <td>${getField(item, 'deskripsi_ac', 'deskripsi')}</td>
            `;
        } else if (category === 'kendaraan') {
            const kmTempuh = calcKm(item);
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_kendaraan', 'tgl'))}</td>
                <td>${getField(item, 'jenis_kendaraan', 'jenis_kendaraan')}</td>
                <td>${getField(item, 'pengemudi', 'driver')}</td>
                <td>${getField(item, 'no_polisi', 'noPolisi')}</td>
                <td>${getField(item, 'tujuan', 'purpose')}</td>
                <td>${kmTempuh === '-' ? '-' : kmTempuh + ' KM'} / ${getField(item, 'durasi', 'duration')} Jam</td>
            `;
        }
    });
}

// Load Data Perbaikan di setiap kategori section
function loadDataPerbaikanCategories() {
    // Jaringan Listrik
    loadCategoryTable('listrik', 'tabelListrikCategory');
    
    // Air Bersih
    loadCategoryTable('air-bersih', 'tabelAirBersihCategory');
    
    // Air Kotor
    loadCategoryTable('air-kotor', 'tabelAirKotorCategory');
    
    // AC
    loadCategoryTable('ac', 'tabelACCategory');
    
    // Kendaraan
    loadCategoryTable('kendaraan', 'tabelKendaraanCategory');
}

// Load tabel data untuk kategori tertentu
function loadCategoryTable(category, containerId) {
    const dataArray = JSON.parse(localStorage.getItem(category) || '[]');
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    if (dataArray.length === 0) {
        container.innerHTML = '<tr><td colspan="100%" class="empty-row">Belum ada data perbaikan</td></tr>';
        return;
    }
    
    container.innerHTML = '';
    
    dataArray.forEach((item, index) => {
        const row = container.insertRow();
        if (category === 'listrik') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_listrik', 'tgl'))}</td>
                <td>${getField(item, 'teknisi_listrik', 'teknisi')}</td>
                <td>${getField(item, 'lokasi_listrik', 'lokasi')}</td>
                <td>${getField(item, 'jenis_kerusakan_listrik', 'jenis_kerusakan')}</td>
                <td>${getField(item, 'deskripsi_listrik', 'deskripsi')}</td>
            `;
        } else if (category === 'air-bersih') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_air_bersih', 'tgl'))}</td>
                <td>${getField(item, 'teknisi_air_bersih', 'teknisi')}</td>
                <td>${getField(item, 'lokasi_air_bersih', 'lokasi')}</td>
                <td>${getField(item, 'jenis_pekerjaan_air_bersih', 'jenis_pekerjaan')}</td>
                <td>${getField(item, 'deskripsi_air_bersih', 'deskripsi')}</td>
            `;
        } else if (category === 'air-kotor') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_air_kotor', 'tgl'))}</td>
                <td>${getField(item, 'teknisi_air_kotor', 'teknisi')}</td>
                <td>${getField(item, 'lokasi_air_kotor', 'lokasi')}</td>
                <td>${getField(item, 'jenis_pekerjaan_air_kotor', 'jenis_pekerjaan')}</td>
                <td>${getField(item, 'deskripsi_air_kotor', 'deskripsi')}</td>
            `;
        } else if (category === 'ac') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_ac', 'tgl'))}</td>
                <td>${getField(item, 'teknisi_ac', 'teknisi')}</td>
                <td>${getField(item, 'lokasi_ac', 'lokasi')}</td>
                <td>${getField(item, 'jenis_pekerjaan_ac', 'jenis_pekerjaan')}</td>
                <td>${getField(item, 'deskripsi_ac', 'deskripsi')}</td>
            `;
        } else if (category === 'kendaraan') {
            const kmTempuh = calcKm(item);
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${formatDate(getField(item, 'tgl_kendaraan', 'tgl'))}</td>
                <td>${getField(item, 'jenis_kendaraan', 'jenis_kendaraan')}</td>
                <td>${getField(item, 'pengemudi', 'driver')}</td>
                <td>${getField(item, 'no_polisi', 'noPolisi')}</td>
                <td>${getField(item, 'tujuan', 'purpose')}</td>
                <td>${kmTempuh === '-' ? '-' : kmTempuh + ' KM'} / ${getField(item, 'durasi', 'duration')} Jam</td>
            `;
        }
    });
}

// Load data untuk kategori tertentu
function loadDataCategory(category, containerId, type) {
    const dataArray = JSON.parse(localStorage.getItem(category) || '[]');
    const container = document.getElementById(containerId);
    
    if (!container) return;
    
    if (dataArray.length === 0) {
        if (container.tagName === 'TBODY') {
            container.innerHTML = '<tr><td colspan="100%" class="empty-row">Belum ada data perbaikan</td></tr>';
        } else {
            container.innerHTML = '<div class="empty-message">Belum ada data perbaikan</div>';
        }
        return;
    }
    
    container.innerHTML = '';
    
    // Jika container adalah TBODY, tampilkan sebagai tabel
    if (container.tagName === 'TBODY') {
        dataArray.forEach((item, index) => {
            const row = container.insertRow();
            if (category === 'listrik') {
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${formatDate(getField(item, 'tgl_listrik', 'tgl'))}</td>
                    <td>${getField(item, 'teknisi_listrik', 'teknisi')}</td>
                    <td>${getField(item, 'lokasi_listrik', 'lokasi')}</td>
                    <td>${getField(item, 'jenis_kerusakan_listrik', 'jenis_kerusakan')}</td>
                    <td>${getField(item, 'deskripsi_listrik', 'deskripsi')}</td>
                `;
            } else if (category === 'air-bersih') {
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${formatDate(getField(item, 'tgl_air_bersih', 'tgl'))}</td>
                    <td>${getField(item, 'teknisi_air_bersih', 'teknisi')}</td>
                    <td>${getField(item, 'lokasi_air_bersih', 'lokasi')}</td>
                    <td>${getField(item, 'jenis_pekerjaan_air_bersih', 'jenis_pekerjaan')}</td>
                    <td>${getField(item, 'deskripsi_air_bersih', 'deskripsi')}</td>
                `;
            } else if (category === 'air-kotor') {
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${formatDate(getField(item, 'tgl_air_kotor', 'tgl'))}</td>
                    <td>${getField(item, 'teknisi_air_kotor', 'teknisi')}</td>
                    <td>${getField(item, 'lokasi_air_kotor', 'lokasi')}</td>
                    <td>${getField(item, 'jenis_pekerjaan_air_kotor', 'jenis_pekerjaan')}</td>
                    <td>${getField(item, 'deskripsi_air_kotor', 'deskripsi')}</td>
                `;
            } else if (category === 'ac') {
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${formatDate(getField(item, 'tgl_ac', 'tgl'))}</td>
                    <td>${getField(item, 'teknisi_ac', 'teknisi')}</td>
                    <td>${getField(item, 'lokasi_ac', 'lokasi')}</td>
                    <td>${getField(item, 'jenis_pekerjaan_ac', 'jenis_pekerjaan')}</td>
                    <td>${getField(item, 'deskripsi_ac', 'deskripsi')}</td>
                `;
            } else if (category === 'kendaraan') {
                const kmTempuh = calcKm(item);
                row.innerHTML = `
                    <td>${index + 1}</td>
                    <td>${formatDate(getField(item, 'tgl_kendaraan', 'tgl'))}</td>
                    <td>${getField(item, 'jenis_kendaraan', 'jenis_kendaraan')}</td>
                    <td>${getField(item, 'pengemudi', 'driver')}</td>
                    <td>${getField(item, 'no_polisi', 'noPolisi')}</td>
                    <td>${getField(item, 'tujuan', 'purpose')}</td>
                    <td>${kmTempuh === '-' ? '-' : kmTempuh + ' KM'} / ${getField(item, 'durasi', 'duration')} Jam</td>
                `;
            }
        });
    } else {
        // Format card jika bukan TBODY (untuk kompatibilitas dengan kode lama)
        dataArray.slice(-3).reverse().forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'data-card';
            card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
            
            let content = '';
            
            if (type === 'jaringan-listrik') {
                content = `
                    <div class="tanggal">${formatDate(getField(item, 'tgl_listrik', 'tgl'))}</div>
                    <div class="label">${getField(item, 'jenis_kerusakan_listrik', 'jenis_kerusakan')}</div>
                    <div class="info-item">
                        <div class="info-label">👨‍🔧 Teknisi</div>
                        <div class="info-value">${getField(item, 'teknisi_listrik', 'teknisi')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📍 Lokasi</div>
                        <div class="info-value">${getField(item, 'lokasi_listrik', 'lokasi')}</div>
                    </div>
                    <div class="deskripsi">
                        <strong>📝 Deskripsi:</strong><br>
                        ${getField(item, 'deskripsi_listrik', 'deskripsi')}
                    </div>
                `;
            } else if (type === 'air-bersih') {
                content = `
                    <div class="tanggal">${formatDate(getField(item, 'tgl_air_bersih', 'tgl'))}</div>
                    <div class="label">${getField(item, 'jenis_pekerjaan_air_bersih', 'jenis_pekerjaan')}</div>
                    <div class="info-item">
                        <div class="info-label">👨‍🔧 Teknisi</div>
                        <div class="info-value">${getField(item, 'teknisi_air_bersih', 'teknisi')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📍 Lokasi</div>
                        <div class="info-value">${getField(item, 'lokasi_air_bersih', 'lokasi')}</div>
                    </div>
                    <div class="deskripsi">
                        <strong>📝 Deskripsi:</strong><br>
                        ${getField(item, 'deskripsi_air_bersih', 'deskripsi')}
                    </div>
                `;
            } else if (type === 'air-kotor') {
                content = `
                    <div class="tanggal">${formatDate(getField(item, 'tgl_air_kotor', 'tgl'))}</div>
                    <div class="label">${getField(item, 'jenis_pekerjaan_air_kotor', 'jenis_pekerjaan')}</div>
                    <div class="info-item">
                        <div class="info-label">👨‍🔧 Teknisi</div>
                        <div class="info-value">${getField(item, 'teknisi_air_kotor', 'teknisi')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📍 Lokasi</div>
                        <div class="info-value">${getField(item, 'lokasi_air_kotor', 'lokasi')}</div>
                    </div>
                    <div class="deskripsi">
                        <strong>📝 Deskripsi:</strong><br>
                        ${getField(item, 'deskripsi_air_kotor', 'deskripsi')}
                    </div>
                `;
            } else if (type === 'ac') {
                content = `
                    <div class="tanggal">${formatDate(getField(item, 'tgl_ac', 'tgl'))}</div>
                    <div class="label">${getField(item, 'jenis_pekerjaan_ac', 'jenis_pekerjaan')}</div>
                    <div class="info-item">
                        <div class="info-label">👨‍🔧 Teknisi</div>
                        <div class="info-value">${getField(item, 'teknisi_ac', 'teknisi')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📍 Lokasi</div>
                        <div class="info-value">${getField(item, 'lokasi_ac', 'lokasi')}</div>
                    </div>
                    <div class="deskripsi">
                        <strong>📝 Deskripsi:</strong><br>
                        ${getField(item, 'deskripsi_ac', 'deskripsi')}
                    </div>
                `;
            } else if (type === 'kendaraan') {
                const kmTempuh = calcKm(item);
                content = `
                    <div class="tanggal">${formatDate(getField(item, 'tgl_kendaraan', 'tgl'))}</div>
                    <div class="label">${getField(item, 'jenis_kendaraan', 'jenis_kendaraan')}</div>
                    <div class="info-item">
                        <div class="info-label">👨‍💼 Pengemudi</div>
                        <div class="info-value">${getField(item, 'pengemudi', 'driver')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🚗 Nomor Polisi</div>
                        <div class="info-value">${getField(item, 'no_polisi', 'noPolisi')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">🎯 Tujuan</div>
                        <div class="info-value">${getField(item, 'tujuan', 'purpose')}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">📏 KM Tempuh / Durasi</div>
                        <div class="info-value">${kmTempuh === '-' ? '-' : kmTempuh + ' KM'} / ${getField(item, 'durasi', 'duration')} Jam</div>
                    </div>
                    ${getField(item, 'keterangan_kendaraan', 'keterangan_kendaraan') !== '-' ? `<div class="deskripsi"><strong>📝 Keterangan:</strong><br>${getField(item, 'keterangan_kendaraan', 'keterangan_kendaraan')}</div>` : ''}
                `;
            }
            
            card.innerHTML = content;
            container.appendChild(card);
        });
    }
}

// Format tanggal Indonesia
function formatDate(dateString) {
    if (!dateString) return '-';
    // Accept already ISO dates or plain date strings; ensure valid date
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

// Safely get first available field from an object
function getField(obj, ...keys) {
    for (const k of keys) {
        if (!obj) continue;
        const v = obj[k];
        if (v !== undefined && v !== null && String(v).trim() !== '') return v;
    }
    return '-';
}

// Calculate KM tempuh safely
function calcKm(item) {
    if (!item) return '-';
    const start = Number(item.km_awal);
    const end = Number(item.km_akhir);
    if (!isNaN(start) && !isNaN(end)) return end - start;
    return '-';
}

// Tambahkan animasi CSS
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInLeft {
            from {
                opacity: 0;
                transform: translateX(-30px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        .navbar a.active {
            border-bottom: 2px solid white;
            opacity: 1;
        }

        .section {
            animation: fadeInUp 0.6s ease;
        }

        .card {
            animation: fadeInUp 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// Load data saat halaman dibuka
window.addEventListener('DOMContentLoaded', () => {
    loadPengumumanAgendaHome();
    addAnimationStyles();
    initGallery();
    initVehicleSchedule();
    
    // Parallax effect pada hero section
    addParallaxEffect();
});

// Parallax effect
function addParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        if (scrollPosition < window.innerHeight) {
            hero.style.backgroundPosition = `center ${scrollPosition * 0.5}px`;
        }
    });
}

// Highlight active navigation item dengan smooth transition
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.navbar a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Intersection Observer untuk fade in elements
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            entry.target.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe semua card saat halaman siap
window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'none';
        observer.observe(card);
    });

    // Initialize Gallery
    initGallery();
});

/* =====================================================
   GALLERY DOCUMENTATION
   ===================================================== */

// Sample gallery data (dapat diambil dari localStorage atau API)
const galleryData = [
    {
        id: 1,
        title: 'Perbaikan Panel Listrik',
        category: 'listrik',
        image: 'https://via.placeholder.com/300x200?text=Panel+Listrik+1',
        date: '2025-12-05'
    },
    {
        id: 2,
        title: 'Inspeksi Jaringan Listrik',
        category: 'listrik',
        image: 'https://via.placeholder.com/300x200?text=Inspeksi+Listrik',
        date: '2025-12-03'
    },
    {
        id: 3,
        title: 'Pembersihan Tangki Air',
        category: 'air-bersih',
        image: 'https://via.placeholder.com/300x200?text=Tangki+Air+Bersih',
        date: '2025-12-04'
    },
    {
        id: 4,
        title: 'Perbaikan Pipa Air',
        category: 'air-bersih',
        image: 'https://via.placeholder.com/300x200?text=Pipa+Air+Bersih',
        date: '2025-12-02'
    },
    {
        id: 5,
        title: 'Pemompaan Septic Tank',
        category: 'air-kotor',
        image: 'https://via.placeholder.com/300x200?text=Septic+Tank',
        date: '2025-12-01'
    },
    {
        id: 6,
        title: 'Inspeksi Saluran Air',
        category: 'air-kotor',
        image: 'https://via.placeholder.com/300x200?text=Saluran+Air',
        date: '2025-11-30'
    },
    {
        id: 7,
        title: 'Servis AC Ruang Meeting',
        category: 'ac',
        image: 'https://via.placeholder.com/300x200?text=Servis+AC',
        date: '2025-11-28'
    },
    {
        id: 8,
        title: 'Pembersihan Filter AC',
        category: 'ac',
        image: 'https://via.placeholder.com/300x200?text=Filter+AC',
        date: '2025-11-25'
    },
    {
        id: 9,
        title: 'Perawatan Kendaraan',
        category: 'kendaraan',
        image: 'https://via.placeholder.com/300x200?text=Perawatan+Kendaraan',
        date: '2025-11-20'
    },
    {
        id: 10,
        title: 'Ganti Oli Kendaraan',
        category: 'kendaraan',
        image: 'https://via.placeholder.com/300x200?text=Ganti+Oli',
        date: '2025-11-15'
    }
];

// Category labels
const categoryLabels = {
    'listrik': '⚡ Jaringan Listrik',
    'air-bersih': '💧 Air Bersih',
    'air-kotor': '🚰 Air Kotor',
    'ac': '❄️ Perbaikan AC',
    'kendaraan': '🚗 Kendaraan Dinas'
};

// Initialize Gallery
function initGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    if (!galleryGrid) return;

    // Load gallery items from localStorage
    loadPublicGallery();

    // Display initial gallery
    renderGallery('all');

    // Add filter button listeners
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            e.target.classList.add('active');
            // Render filtered gallery
            renderGallery(e.target.dataset.filter);
        });
    });
}

// Load gallery items from localStorage
function loadPublicGallery() {
    const storedItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    if (storedItems.length > 0) {
        // Merge dengan sample data, prioritaskan data terbaru dari localStorage
        window.galleryData = [...storedItems, ...window.galleryData];
    }
}

// Render Gallery Items
function renderGallery(filter) {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    // Filter data
    const filteredData = filter === 'all' 
        ? galleryData 
        : galleryData.filter(item => item.category === filter);

    // Clear grid
    galleryGrid.innerHTML = '';

    if (filteredData.length === 0) {
        galleryGrid.innerHTML = '<p style="text-align: center; color: #999; padding: 3rem; grid-column: 1/-1;">Belum ada dokumentasi untuk kategori ini</p>';
        return;
    }

    // Render items
    filteredData.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'gallery-item';
        itemElement.style.animation = `fadeInUp 0.6s ease ${index * 0.1}s both`;
        itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="gallery-item-image" onerror="this.src='https://via.placeholder.com/300x200?text=Dokumentasi'">
            <div class="gallery-item-overlay">
                <div class="gallery-item-category">${categoryLabels[item.category]}</div>
                <h3>${item.title}</h3>
                <p>${item.date}</p>
            </div>
        `;
        
        // Add click event to open image in modal or lightbox
        itemElement.addEventListener('click', () => {
            openImageModal(item);
        });

        galleryGrid.appendChild(itemElement);
    });
}

// Open Image Modal
function openImageModal(item) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close">&times;</span>
            <img src="${item.image}" alt="${item.title}" style="width: 100%; max-height: 90vh; object-fit: contain; border-radius: 12px;">
            <div class="modal-info">
                <h2>${item.title}</h2>
                <p><strong>Kategori:</strong> ${categoryLabels[item.category]}</p>
                <p><strong>Tanggal:</strong> ${formatDate(item.date)}</p>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal
    const closeBtn = modal.querySelector('.modal-close');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

// Load gallery from localStorage (untuk upload di admin)
function loadGalleryFromStorage() {
    const storedGallery = localStorage.getItem('galleryItems');
    if (storedGallery) {
        try {
            const items = JSON.parse(storedGallery);
            galleryData.push(...items);
            renderGallery('all');
        } catch (e) {
            console.error('Error loading gallery from storage:', e);
        }
    }
}

/* =====================================================
   VEHICLE SCHEDULING SYSTEM
   ===================================================== */

// Daftar kendaraan dinas
const vehicleList = [
    { id: 1, name: 'Avanza D-001', type: 'mobil', noPolisi: 'BL-001-XYZ', driver: 'Budi Santoso' },
    { id: 2, name: 'Innova D-002', type: 'mobil', noPolisi: 'BL-002-XYZ', driver: 'Rudi Hermanto' },
    { id: 3, name: 'Elf Truck D-003', type: 'truck', noPolisi: 'BL-003-XYZ', driver: 'Andi Wijaya' },
    { id: 4, name: 'Scoopy D-004', type: 'motor', noPolisi: 'BL-004-XYZ', driver: 'Hendra Kusuma' },
    { id: 5, name: 'Beat D-005', type: 'motor', noPolisi: 'BL-005-XYZ', driver: 'Bambang Suharto' }
];

// Initialize vehicle schedule
function initVehicleSchedule() {
    const calendarContainer = document.getElementById('vehicleScheduleCalendar');
    const filterButtons = document.querySelectorAll('.vehicle-filter-btn');
    
    if (!calendarContainer) return;

    // Generate calendar untuk 12 bulan ke depan
    generateYearCalendar();
    
    // Load vehicle status
    loadVehicleStatus('all');

    // Add filter listeners
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            filterButtons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            loadVehicleStatus(e.target.dataset.vehicle);
        });
    });
}

// Generate calendar untuk 12 bulan
function generateYearCalendar() {
    const container = document.getElementById('vehicleScheduleCalendar');
    if (!container) return;

    container.innerHTML = '';
    const today = new Date();
    const startMonth = today.getMonth();
    const startYear = today.getFullYear();

    for (let i = 0; i < 12; i++) {
        const monthDate = new Date(startYear, startMonth + i, 1);
        const monthName = monthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        
        const monthCalendar = document.createElement('div');
        monthCalendar.className = 'calendar-month';
        monthCalendar.innerHTML = `
            <div class="calendar-month-title">${monthName}</div>
            <div class="calendar-days" id="month-${i}"></div>
        `;
        
        container.appendChild(monthCalendar);
        generateDaysOfMonth(i, startMonth, startYear);
    }
}

// Generate hari-hari dalam sebulan
function generateDaysOfMonth(monthOffset, startMonth, startYear) {
    const monthDate = new Date(startYear, startMonth + monthOffset, 1);
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const daysContainer = document.getElementById(`month-${monthOffset}`);
    if (!daysContainer) return;

    // Day headers
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    let html = '';
    dayNames.forEach(day => {
        html += `<div class="calendar-day-header">${day}</div>`;
    });

    // Empty cells
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    // Days
    const kendaraanData = JSON.parse(localStorage.getItem('kendaraan') || '[]');
    for (let day = 1; day <= daysInMonth; day++) {
        // Format YYYY-MM-DD untuk kecocokan dengan input date
        const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const isBooked = kendaraanData.some(k => k.tgl_kendaraan === dateStr);
        const bookingInfo = kendaraanData.find(k => k.tgl_kendaraan === dateStr);
        
        const status = isBooked ? 'booked' : 'available';
        const tooltip = isBooked ? `${bookingInfo.pengemudi}` : 'Tersedia';
        
        html += `
            <div class="calendar-day ${status}">
                ${day}
                <div class="calendar-day-tooltip">${tooltip}</div>
            </div>
        `;
    }

    daysContainer.innerHTML = html;
}

// Load vehicle status grid
function loadVehicleStatus(filter) {
    const statusGrid = document.getElementById('vehicleStatusGrid');
    if (!statusGrid) return;

    const kendaraanData = JSON.parse(localStorage.getItem('kendaraan') || '[]');
    
    const filteredVehicles = filter === 'all' 
        ? vehicleList 
        : vehicleList.filter(v => v.type === filter);

    statusGrid.innerHTML = '';

    filteredVehicles.forEach(vehicle => {
        // Hitung penggunaan tahun ini
        const thisYearUsages = kendaraanData.filter(k => {
            const year = new Date(k.tgl_kendaraan).getFullYear();
            return year === new Date().getFullYear();
        });

        const todayUsage = kendaraanData.find(k => {
            const usageDate = new Date(k.tgl_kendaraan).toLocaleDateString();
            const today = new Date().toLocaleDateString();
            return usageDate === today;
        });

        const isAvailable = !todayUsage;
        const nextUsage = getNextVehicleUsage(vehicle.id, kendaraanData);

        const card = document.createElement('div');
        card.className = 'vehicle-status-card';
        card.innerHTML = `
            <div class="vehicle-header">
                <div class="vehicle-name">${getVehicleIcon(vehicle.type)} ${vehicle.name}</div>
                <div class="vehicle-status-badge ${isAvailable ? 'status-available' : 'status-booked'}">
                    ${isAvailable ? '✓ Tersedia' : '✗ Terpakai'}
                </div>
            </div>

            <div class="vehicle-details">
                <div class="vehicle-detail-item">
                    <span class="vehicle-detail-label">No. Polisi</span>
                    <span class="vehicle-detail-value">${vehicle.noPolisi}</span>
                </div>
                <div class="vehicle-detail-item">
                    <span class="vehicle-detail-label">Pengemudi</span>
                    <span class="vehicle-detail-value">${vehicle.driver}</span>
                </div>
                <div class="vehicle-detail-item">
                    <span class="vehicle-detail-label">Jenis</span>
                    <span class="vehicle-detail-value">${vehicle.type.toUpperCase()}</span>
                </div>
            </div>

            <div class="vehicle-usage-info">
                <div class="usage-item">
                    <strong>Total Penggunaan (2025)</strong>
                    <strong style="color: #a855f7;">${thisYearUsages.length}x</strong>
                </div>
                ${nextUsage ? `
                    <div class="usage-item">
                        <strong>Penggunaan Berikutnya</strong>
                        <strong style="color: #9333ea;">${nextUsage}</strong>
                    </div>
                ` : `
                    <div class="usage-item">
                        <strong>Penggunaan Berikutnya</strong>
                        <strong style="color: #6b7280;">-</strong>
                    </div>
                `}
            </div>
        `;

        statusGrid.appendChild(card);
    });
}

// Get vehicle icon by type
function getVehicleIcon(type) {
    const icons = {
        'mobil': '🚗',
        'motor': '🏍️',
        'truck': '🚚'
    };
    return icons[type] || '🚙';
}

// Get next vehicle usage date
function getNextVehicleUsage(vehicleId, kendaraanData) {
    const today = new Date();
    const futureUsages = kendaraanData
        .filter(k => {
            const usageDate = new Date(k.tgl_kendaraan);
            return usageDate > today;
        })
        .sort((a, b) => new Date(a.tgl_kendaraan) - new Date(b.tgl_kendaraan));

    if (futureUsages.length > 0) {
        return formatDate(futureUsages[0].tgl_kendaraan);
    }
    return null;
}

