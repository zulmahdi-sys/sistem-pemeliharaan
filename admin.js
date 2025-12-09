// Cek apakah user sudah login saat halaman dibuka
function checkLogin() {
    const adminLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!adminLoggedIn || adminLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return false;
    }
    
    // Tampilkan username di header
    const username = localStorage.getItem('adminUsername');
    document.getElementById('adminUsername').textContent = '👤 ' + username;
    
    // Load semua data dari localStorage
    loadAllData();
    return true;
}

// Logout
function logout() {
    if (confirm('Apakah Anda yakin ingin logout?')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        window.location.href = 'login.html';
    }
}

// Tampilkan tab yang dipilih
function showTab(tabName) {
    // Sembunyikan semua tab
    const tabs = document.querySelectorAll('.tab-content');
    tabs.forEach(tab => tab.classList.remove('active'));
    
    // Hapus active class dari menu
    const menuLinks = document.querySelectorAll('.menu-link');
    menuLinks.forEach(link => link.classList.remove('active'));
    
    // Tampilkan tab yang dipilih
    document.getElementById(tabName).classList.add('active');
    
    // Tambahkan active class ke menu
    event.target.classList.add('active');
    
    // Load gallery preview jika tab gallery dipilih
    if (tabName === 'gallery') {
        renderGalleryFormFields();
        loadGalleryPreview();
    }
}

// Submit form
function submitForm(event, category) {
    event.preventDefault();
    
    let formData = {};
    const form = event.target;
    const formElements = form.elements;
    
    for (let i = 0; i < formElements.length; i++) {
        const element = formElements[i];
        if (element.name && element.type !== 'submit' && element.type !== 'reset') {
            formData[element.id] = element.value;
        }
    }
    
    // Simpan ke localStorage
    let dataArray = JSON.parse(localStorage.getItem(category) || '[]');
    formData.id = Date.now();
    dataArray.push(formData);
    localStorage.setItem(category, JSON.stringify(dataArray));
    
    // Reset form
    form.reset();
    
    // Tampilkan pesan sukses
    const successId = category === 'listrik' ? 'listrikSuccess' : 
                     category === 'air-bersih' ? 'airBersihSuccess' :
                     category === 'air-kotor' ? 'airKotorSuccess' :
                     category === 'ac' ? 'acSuccess' : 'kendaraanSuccess';
    
    const successMessage = document.getElementById(successId);
    successMessage.style.display = 'block';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 3000);
    
    // Muat ulang tabel
    loadTableData(category);
}

// Load data ke tabel
function loadTableData(category) {
    const dataArray = JSON.parse(localStorage.getItem(category) || '[]');
    
    let bodyId, tableId;
    if (category === 'listrik') {
        bodyId = 'bodyTabelListrik';
        tableId = 'tabelListrik';
    } else if (category === 'air-bersih') {
        bodyId = 'bodyTabelAirBersih';
        tableId = 'tabelAirBersih';
    } else if (category === 'air-kotor') {
        bodyId = 'bodyTabelAirKotor';
        tableId = 'tabelAirKotor';
    } else if (category === 'ac') {
        bodyId = 'bodyTabelAC';
        tableId = 'tabelAC';
    } else if (category === 'kendaraan') {
        bodyId = 'bodyTabelKendaraan';
        tableId = 'tabelKendaraan';
    } else if (category === 'agenda') {
        bodyId = 'bodyTabelAgenda';
        tableId = 'tabelAgenda';
    } else if (category === 'pengumuman') {
        loadPengumumanCards();
        return;
    }
    
    const tbody = document.getElementById(bodyId);
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    dataArray.forEach((item, index) => {
        const row = tbody.insertRow();
        
        if (category === 'listrik') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.tgl_listrik}</td>
                <td>${item.teknisi_listrik}</td>
                <td>${item.lokasi_listrik}</td>
                <td>${item.jenis_kerusakan_listrik}</td>
                <td>${item.deskripsi_listrik}</td>
                <td><button class="btn-delete" onclick="deleteData('${category}', ${item.id})">Hapus</button></td>
            `;
        } else if (category === 'air-bersih') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.tgl_air_bersih}</td>
                <td>${item.teknisi_air_bersih}</td>
                <td>${item.lokasi_air_bersih}</td>
                <td>${item.jenis_pekerjaan_air_bersih}</td>
                <td>${item.deskripsi_air_bersih}</td>
                <td><button class="btn-delete" onclick="deleteData('${category}', ${item.id})">Hapus</button></td>
            `;
        } else if (category === 'air-kotor') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.tgl_air_kotor}</td>
                <td>${item.teknisi_air_kotor}</td>
                <td>${item.lokasi_air_kotor}</td>
                <td>${item.jenis_pekerjaan_air_kotor}</td>
                <td>${item.deskripsi_air_kotor}</td>
                <td><button class="btn-delete" onclick="deleteData('${category}', ${item.id})">Hapus</button></td>
            `;
        } else if (category === 'ac') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.tgl_ac}</td>
                <td>${item.teknisi_ac}</td>
                <td>${item.lokasi_ac}</td>
                <td>${item.jenis_pekerjaan_ac}</td>
                <td>${item.deskripsi_ac}</td>
                <td><button class="btn-delete" onclick="deleteData('${category}', ${item.id})">Hapus</button></td>
            `;
        } else if (category === 'kendaraan') {
            const kmTempuh = item.km_akhir - item.km_awal;
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.tgl_kendaraan}</td>
                <td>${item.pengemudi}</td>
                <td>${item.no_polisi}</td>
                <td>${item.jenis_kendaraan}</td>
                <td>${item.tujuan}</td>
                <td>${kmTempuh} KM</td>
                <td>${item.durasi} Jam</td>
                <td><button class="btn-delete" onclick="deleteData('${category}', ${item.id})">Hapus</button></td>
            `;
        } else if (category === 'agenda') {
            row.innerHTML = `
                <td>${index + 1}</td>
                <td>${item.tgl_agenda}</td>
                <td>${item.jam_agenda}</td>
                <td>${item.judul_agenda}</td>
                <td>${item.pic_agenda}</td>
                <td>${item.keterangan_agenda || '-'}</td>
                <td><button class="btn-delete" onclick="deleteData('${category}', ${item.id})">Hapus</button></td>
            `;
        }
    });
}

// Load Pengumuman Cards
function loadPengumumanCards() {
    const dataArray = JSON.parse(localStorage.getItem('pengumuman') || '[]');
    const container = document.getElementById('daftarPengumuman');
    
    container.innerHTML = '';
    
    dataArray.reverse().forEach((item, index) => {
        const card = document.createElement('div');
        card.className = 'pengumuman-card';
        card.innerHTML = `
            <div class="tanggal">${item.tgl_pengumuman}</div>
            <div class="judul">${item.judul_pengumuman}</div>
            <div class="isi">${item.isi_pengumuman}</div>
            <button class="btn-delete" onclick="deleteData('pengumuman', ${item.id})">Hapus</button>
        `;
        container.appendChild(card);
    });
}

// Hapus data
function deleteData(category, id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        let dataArray = JSON.parse(localStorage.getItem(category) || '[]');
        dataArray = dataArray.filter(item => item.id !== id);
        localStorage.setItem(category, JSON.stringify(dataArray));
        loadTableData(category);
    }
}

// Load semua data dari localStorage
function loadAllData() {
    loadTableData('listrik');
    loadTableData('air-bersih');
    loadTableData('air-kotor');
    loadTableData('ac');
    loadTableData('kendaraan');
    loadTableData('pengumuman');
    loadTableData('agenda');
    
    // Initialize gallery form fields
    renderGalleryFormFields();
    loadGalleryPreview();
}

// Export PDF
function exportPDF(category) {
    const table = document.getElementById('tabelListrik');
    let tableId, fileName;
    
    if (category === 'listrik') {
        tableId = 'tabelListrik';
        fileName = 'Laporan_Jaringan_Listrik';
    } else if (category === 'air-bersih') {
        tableId = 'tabelAirBersih';
        fileName = 'Laporan_Air_Bersih';
    } else if (category === 'air-kotor') {
        tableId = 'tabelAirKotor';
        fileName = 'Laporan_Air_Kotor';
    } else if (category === 'ac') {
        tableId = 'tabelAC';
        fileName = 'Laporan_AC';
    } else if (category === 'kendaraan') {
        tableId = 'tabelKendaraan';
        fileName = 'Laporan_Kendaraan_Dinas';
    } else if (category === 'pengumuman') {
        exportPengumumanPDF();
        return;
    } else if (category === 'agenda') {
        tableId = 'tabelAgenda';
        fileName = 'Laporan_Agenda_Kerja';
    }
    
    const element = document.getElementById(tableId);
    const opt = {
        margin: 10,
        filename: fileName + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'landscape', unit: 'mm', format: 'a4' }
    };
    
    html2pdf().set(opt).from(element).save();
}

// Export Pengumuman PDF
function exportPengumumanPDF() {
    const dataArray = JSON.parse(localStorage.getItem('pengumuman') || '[]');
    
    let html = `
        <h2 style="text-align: center; color: #667eea;">Laporan Pengumuman</h2>
        <hr>
    `;
    
    dataArray.reverse().forEach((item, index) => {
        html += `
            <div style="margin-bottom: 2rem; border-left: 3px solid #667eea; padding-left: 1rem;">
                <p style="color: #999; margin-bottom: 0.5rem;">${item.tgl_pengumuman}</p>
                <h3 style="color: #667eea; margin-bottom: 0.8rem;">${item.judul_pengumuman}</h3>
                <p style="color: #555; line-height: 1.6;">${item.isi_pengumuman}</p>
            </div>
        `;
    });
    
    const opt = {
        margin: 10,
        filename: 'Laporan_Pengumuman.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' }
    };
    
    const element = document.createElement('div');
    element.innerHTML = html;
    html2pdf().set(opt).from(element).save();
}

// Export Excel
function exportExcel(category) {
    const dataArray = JSON.parse(localStorage.getItem(category) || '[]');
    
    let fileName = '';
    let headers = [];
    let rows = [];
    
    if (category === 'listrik') {
        fileName = 'Laporan_Jaringan_Listrik';
        headers = ['No', 'Tanggal', 'Teknisi', 'Lokasi', 'Jenis Kerusakan', 'Deskripsi'];
        dataArray.forEach((item, index) => {
            rows.push([
                index + 1,
                item.tgl_listrik,
                item.teknisi_listrik,
                item.lokasi_listrik,
                item.jenis_kerusakan_listrik,
                item.deskripsi_listrik
            ]);
        });
    } else if (category === 'air-bersih') {
        fileName = 'Laporan_Air_Bersih';
        headers = ['No', 'Tanggal', 'Teknisi', 'Lokasi', 'Jenis Pekerjaan', 'Deskripsi'];
        dataArray.forEach((item, index) => {
            rows.push([
                index + 1,
                item.tgl_air_bersih,
                item.teknisi_air_bersih,
                item.lokasi_air_bersih,
                item.jenis_pekerjaan_air_bersih,
                item.deskripsi_air_bersih
            ]);
        });
    } else if (category === 'air-kotor') {
        fileName = 'Laporan_Air_Kotor';
        headers = ['No', 'Tanggal', 'Teknisi', 'Lokasi', 'Jenis Pekerjaan', 'Deskripsi'];
        dataArray.forEach((item, index) => {
            rows.push([
                index + 1,
                item.tgl_air_kotor,
                item.teknisi_air_kotor,
                item.lokasi_air_kotor,
                item.jenis_pekerjaan_air_kotor,
                item.deskripsi_air_kotor
            ]);
        });
    } else if (category === 'ac') {
        fileName = 'Laporan_AC';
        headers = ['No', 'Tanggal', 'Teknisi', 'Lokasi', 'Jenis Pekerjaan', 'Deskripsi'];
        dataArray.forEach((item, index) => {
            rows.push([
                index + 1,
                item.tgl_ac,
                item.teknisi_ac,
                item.lokasi_ac,
                item.jenis_pekerjaan_ac,
                item.deskripsi_ac
            ]);
        });
    } else if (category === 'kendaraan') {
        fileName = 'Laporan_Kendaraan_Dinas';
        headers = ['No', 'Tanggal', 'Pengemudi', 'No Polisi', 'Jenis', 'Tujuan', 'KM Tempuh', 'Durasi'];
        dataArray.forEach((item, index) => {
            const kmTempuh = item.km_akhir - item.km_awal;
            rows.push([
                index + 1,
                item.tgl_kendaraan,
                item.pengemudi,
                item.no_polisi,
                item.jenis_kendaraan,
                item.tujuan,
                kmTempuh,
                item.durasi
            ]);
        });
    } else if (category === 'pengumuman') {
        fileName = 'Laporan_Pengumuman';
        headers = ['No', 'Tanggal', 'Judul', 'Isi'];
        dataArray.forEach((item, index) => {
            rows.push([
                index + 1,
                item.tgl_pengumuman,
                item.judul_pengumuman,
                item.isi_pengumuman
            ]);
        });
    } else if (category === 'agenda') {
        fileName = 'Laporan_Agenda_Kerja';
        headers = ['No', 'Tanggal', 'Jam', 'Judul Agenda', 'PIC', 'Keterangan'];
        dataArray.forEach((item, index) => {
            rows.push([
                index + 1,
                item.tgl_agenda,
                item.jam_agenda,
                item.judul_agenda,
                item.pic_agenda,
                item.keterangan_agenda || '-'
            ]);
        });
    }
    
    // Buat workbook baru
    const wb = XLSX.utils.book_new();
    const ws_data = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    // Set lebar kolom
    ws['!cols'] = [];
    for (let i = 0; i < headers.length; i++) {
        ws['!cols'].push({ wch: 15 });
    }
    
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, fileName + '.xlsx');
}

// Cek login saat halaman dimuat
window.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    setTimeout(() => {
        setupGalleryUploadDragDrop();
    }, 100);
});

/* =====================================================
   GALLERY DOKUMENTASI FUNCTIONS
   ===================================================== */

// Validasi file upload
const ALLOWED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.png', '.jpg', '.jpeg'];

// Setup drag-drop event listeners
function setupGalleryUploadDragDrop() {
    const uploadArea = document.getElementById('galleryUploadArea');
    const fileInput = document.getElementById('gallery_image');
    
    if (!uploadArea || !fileInput) return;

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    // Highlight drop area when item is dragged over it
    ['dragenter', 'dragover'].forEach(eventName => {
        uploadArea.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadArea.addEventListener(eventName, unhighlight, false);
    });

    function highlight(e) {
        uploadArea.classList.add('drag-over');
    }

    function unhighlight(e) {
        uploadArea.classList.remove('drag-over');
    }

    // Handle dropped files
    uploadArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        fileInput.files = files;
        
        // Trigger change event
        const event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
    }

    // Handle file selection
    fileInput.addEventListener('change', handleFileSelect);
}

// Handle file selection
function handleFileSelect(e) {
    const file = e.target.files[0];
    
    if (!file) {
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('fileInfo').style.display = 'none';
        return;
    }

    // Validate file
    const validation = validateFile(file);
    if (!validation.valid) {
        showGalleryError(validation.message);
        e.target.value = '';
        document.getElementById('imagePreview').style.display = 'none';
        document.getElementById('fileInfo').style.display = 'none';
        return;
    }

    // Clear error message
    document.getElementById('galleryError').style.display = 'none';

    // Show preview
    const reader = new FileReader();
    reader.onload = function(event) {
        const previewImg = document.getElementById('previewImage');
        previewImg.src = event.target.result;
        document.getElementById('imagePreview').style.display = 'block';
    };
    reader.readAsDataURL(file);

    // Show file info
    showFileInfo(file);
}

// Validate file
function validateFile(file) {
    // Check file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return {
            valid: false,
            message: '❌ Format file tidak didukung! Hanya PNG dan JPG yang diizinkan.'
        };
    }

    // Check file extension
    const fileName = file.name.toLowerCase();
    const hasValidExtension = ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!hasValidExtension) {
        return {
            valid: false,
            message: '❌ Extension file tidak valid! Gunakan .PNG atau .JPG'
        };
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
        const sizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(0);
        return {
            valid: false,
            message: `❌ Ukuran file terlalu besar! Maksimal ${sizeMB}MB`
        };
    }

    return { valid: true };
}

// Show file info
function showFileInfo(file) {
    const fileSize = (file.size / 1024).toFixed(2);
    const fileExtension = file.name.split('.').pop().toUpperCase();
    
    document.getElementById('fileName').textContent = file.name;
    document.getElementById('fileSize').textContent = fileSize + ' KB';
    document.getElementById('fileFormat').textContent = fileExtension;
    document.getElementById('fileInfo').style.display = 'block';
}

// Remove image preview
function removeImagePreview() {
    document.getElementById('gallery_image').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('fileInfo').style.display = 'none';
}

// Show gallery error
function showGalleryError(message) {
    const errorDiv = document.getElementById('galleryError');
    const errorMessage = document.getElementById('errorMessage');
    errorMessage.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 5000);
}

// Data kategori gallery per kelompok
const galleryCategoryData = {
    listrik: {
        icon: '⚡',
        label: 'Jaringan Listrik',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        fields: [
            { name: 'lokasi_listrik', label: 'Lokasi', placeholder: 'Misal: Ruang Server, Lantai 2, dll' },
            { name: 'jenis_pekerjaan_listrik', label: 'Jenis Pekerjaan', placeholder: 'Misal: Penggantian Kabel, Perbaikan Panel, dll' },
            { name: 'kondisi_listrik', label: 'Kondisi Sebelum', placeholder: 'Jelaskan kondisi yang diperbaiki' }
        ]
    },
    'air-bersih': {
        icon: '💧',
        label: 'Air Bersih',
        color: '#06b6d4',
        bgColor: 'rgba(6, 182, 212, 0.1)',
        fields: [
            { name: 'lokasi_air_bersih', label: 'Lokasi', placeholder: 'Misal: Tangki Air Utama, Ruang Pompa, dll' },
            { name: 'jenis_pekerjaan_air_bersih', label: 'Jenis Pekerjaan', placeholder: 'Misal: Pembersihan Tangki, Perbaikan Pompa, dll' },
            { name: 'kondisi_air_bersih', label: 'Kondisi Sebelum', placeholder: 'Jelaskan masalah yang ditemukan' }
        ]
    },
    'air-kotor': {
        icon: '🚰',
        label: 'Air Kotor',
        color: '#8b5cf6',
        bgColor: 'rgba(139, 92, 246, 0.1)',
        fields: [
            { name: 'lokasi_air_kotor', label: 'Lokasi', placeholder: 'Misal: Sistem Drainase, Septik Tank, dll' },
            { name: 'jenis_pekerjaan_air_kotor', label: 'Jenis Pekerjaan', placeholder: 'Misal: Pembersihan Saluran, Perbaikan Septik, dll' },
            { name: 'kondisi_air_kotor', label: 'Kondisi Sebelum', placeholder: 'Jelaskan kondisi sistem drainase' }
        ]
    },
    ac: {
        icon: '❄️',
        label: 'Perbaikan AC',
        color: '#14b8a6',
        bgColor: 'rgba(20, 184, 166, 0.1)',
        fields: [
            { name: 'lokasi_ac', label: 'Lokasi', placeholder: 'Misal: Ruang Kantor, Ruang Server, dll' },
            { name: 'jenis_pekerjaan_ac', label: 'Jenis Pekerjaan', placeholder: 'Misal: Service Rutin, Perbaikan Compressor, dll' },
            { name: 'kondisi_ac', label: 'Kondisi Sebelum', placeholder: 'Jelaskan permasalahan AC' }
        ]
    },
    kendaraan: {
        icon: '🚗',
        label: 'Kendaraan Dinas',
        color: '#a855f7',
        bgColor: 'rgba(168, 85, 247, 0.1)',
        fields: [
            { name: 'jenis_kendaraan', label: 'Jenis Kendaraan', placeholder: 'Misal: Mobil, Motor, Truck' },
            { name: 'no_polisi', label: 'No. Polisi', placeholder: 'Misal: BL-001-XYZ' },
            { name: 'jenis_pekerjaan_kendaraan', label: 'Jenis Perbaikan', placeholder: 'Misal: Ganti Oli, Perbaikan Mesin, dll' }
        ]
    }
};

let currentGalleryCategory = 'listrik';

// Switch kategori gallery
function switchGalleryCategory(event) {
    event.preventDefault();
    const buttons = document.querySelectorAll('.gallery-cat-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    currentGalleryCategory = event.target.dataset.category;
    const categoryInfo = galleryCategoryData[currentGalleryCategory];
    
    // Update category title
    document.getElementById('categoryTitle').textContent = categoryInfo.label;
    
    // Render dynamic form fields
    renderGalleryFormFields();
    
    // Load gallery preview untuk kategori ini
    loadGalleryPreview();
}

// Render form fields berdasarkan kategori
function renderGalleryFormFields() {
    const formContent = document.getElementById('galleryFormContent');
    const categoryInfo = galleryCategoryData[currentGalleryCategory];
    
    if (!formContent || !categoryInfo) return;
    
    let html = `
        <div class="form-group">
            <label for="gallery_title">Judul Dokumentasi</label>
            <input type="text" id="gallery_title" name="gallery_title" placeholder="Misal: ${categoryInfo.label} - Deskripsi Singkat" required>
        </div>
    `;
    
    // Add dynamic fields based on category
    categoryInfo.fields.forEach(field => {
        html += `
            <div class="form-group">
                <label for="${field.name}">${field.label}</label>
                <input type="text" id="${field.name}" name="${field.name}" placeholder="${field.placeholder}" required>
            </div>
        `;
    });
    
    html += `
        <div class="form-group">
            <label for="gallery_description">Deskripsi Lengkap</label>
            <textarea id="gallery_description" name="gallery_description" placeholder="Jelaskan dokumentasi perbaikan ini secara detail..." style="height: 120px;"></textarea>
        </div>

        <input type="hidden" id="gallery_category" name="gallery_category" value="${currentGalleryCategory}">
    `;
    
    formContent.innerHTML = html;
    
    // Reinitialize drag-drop after form render
    setTimeout(() => {
        setupGalleryUploadDragDrop();
    }, 50);
}

function submitGalleryForm(event) {
    event.preventDefault();
    
    const title = document.getElementById('gallery_title').value.trim();
    const category = document.getElementById('gallery_category').value;
    const description = document.getElementById('gallery_description').value.trim();
    const imageInput = document.getElementById('gallery_image');
    
    // Validasi semua field
    if (!title) {
        showGalleryError('❌ Judul dokumentasi harus diisi!');
        return;
    }

    if (!category) {
        showGalleryError('❌ Kategori harus dipilih!');
        return;
    }

    if (!imageInput.files[0]) {
        showGalleryError('❌ Pilih file gambar terlebih dahulu!');
        return;
    }

    // Validate file
    const file = imageInput.files[0];
    const validation = validateFile(file);
    if (!validation.valid) {
        showGalleryError(validation.message);
        return;
    }

    // Check required fields per category
    const categoryInfo = galleryCategoryData[category];
    if (categoryInfo) {
        for (let field of categoryInfo.fields) {
            const fieldElement = document.getElementById(field.name);
            if (!fieldElement || !fieldElement.value.trim()) {
                showGalleryError(`❌ ${field.label} harus diisi!`);
                return;
            }
        }
    }

    // Collect additional fields
    const additionalData = {};
    if (categoryInfo) {
        categoryInfo.fields.forEach(field => {
            const fieldElement = document.getElementById(field.name);
            if (fieldElement) {
                additionalData[field.name] = fieldElement.value.trim();
            }
        });
    }
    
    // Convert image to base64
    const reader = new FileReader();
    reader.onload = function(e) {
        const galleryItem = {
            id: Date.now(),
            title: title,
            category: category,
            description: description,
            image: e.target.result,
            date: new Date().toISOString().split('T')[0],
            timestamp: Date.now(),
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            ...additionalData
        };
        
        // Save to localStorage
        let galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
        galleryItems.push(galleryItem);
        localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
        
        // Show success message
        const successDiv = document.getElementById('gallerySuccess');
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
        
        // Clear error message
        document.getElementById('galleryError').style.display = 'none';
        
        // Reset form
        event.target.reset();
        removeImagePreview();
        
        // Refresh preview
        loadGalleryPreview();
    };
    reader.readAsDataURL(file);
}

// Load Gallery Preview in Admin
function loadGalleryPreview() {
    const preview = document.getElementById('galleryPreview');
    if (!preview) return;
    
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    
    // Filter by current category
    const filteredItems = galleryItems.filter(item => item.category === currentGalleryCategory);
    
    if (filteredItems.length === 0) {
        preview.innerHTML = '<p style="color: #999; grid-column: 1/-1;">Belum ada dokumentasi untuk kategori ini</p>';
        return;
    }
    
    preview.innerHTML = '';
    
    // Sort by timestamp (newest first)
    filteredItems.sort((a, b) => b.timestamp - a.timestamp);
    
    filteredItems.forEach(item => {
        const categoryLabels = {
            'listrik': '⚡ Listrik',
            'air-bersih': '💧 Air Bersih',
            'air-kotor': '🚰 Air Kotor',
            'ac': '❄️ AC',
            'kendaraan': '🚗 Kendaraan'
        };
        
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = `
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            position: relative;
        `;
        
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 150px; object-fit: cover;">
            <div style="padding: 1rem;">
                <h4 style="margin: 0 0 0.5rem; color: #047857;">${item.title}</h4>
                <p style="margin: 0.3rem 0; font-size: 0.85rem; color: #666;">
                    <strong>${categoryLabels[item.category]}</strong>
                </p>
                <p style="margin: 0.3rem 0; font-size: 0.8rem; color: #999;">
                    ${item.date}
                </p>
                <button onclick="deleteGalleryItem(${item.id})" style="
                    width: 100%;
                    padding: 0.5rem;
                    margin-top: 0.8rem;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 0.85rem;
                ">🗑️ Hapus</button>
            </div>
        `;
        
        preview.appendChild(itemDiv);
    });
}

// Delete Gallery Item
function deleteGalleryItem(id) {
    if (!confirm('Yakin ingin menghapus dokumentasi ini?')) return;
    
    let galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    galleryItems = galleryItems.filter(item => item.id !== id);
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
    
    loadGalleryPreview();
}

// Load gallery items to public page
function loadPublicGallery() {
    const storedItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    if (storedItems.length > 0) {
        // Merge dengan sample data
        window.galleryData = [...window.galleryData, ...storedItems];
        renderGallery('all');
    }
}

// Load gallery preview when gallery tab is shown
function showGalleryTab() {
    loadGalleryPreview();
}

