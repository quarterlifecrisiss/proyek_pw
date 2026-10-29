const recipes = [
    {
        id: 'talbinah',
        nama: 'Talbinah Susu Madu',
        kategori: 'Sarapan',
        waktu: '25 mnt',
        porsi: 1,
        warna: '#b08a4f',
        inisial: 'Tb',
        ringkas: 'Bubur barley lembut yang dimasak dengan susu, lalu disiram madu. Hangat dan bikin kenyang lama.',
        nutrisi: { kalori: 115, karbo: 20, protein: 3, lemak: 3, serat: 2 },
        bahan: [
            '2 sdm tepung barley (atau barley utuh yang diblender)',
            '200 ml susu cair',
            '½ batang kayu manis (opsional)',
            '1 sdm madu',
            '1–2 butir kurma, cincang kasar'
        ],
        langkah: [
            'Larutkan tepung barley dengan sedikit susu dingin supaya tidak menggumpal.',
            'Panaskan sisa susu bersama kayu manis sampai hampir mendidih.',
            'Masukkan larutan barley, aduk terus dengan api kecil 10–15 menit sampai mengental.',
            'Matikan api, tunggu agak hangat, baru tambahkan madu (jangan saat masih mendidih).',
            'Sajikan dengan taburan kurma cincang.'
        ],
        dalil: 'Talbinah itu menenangkan hati orang yang sakit dan menghilangkan sebagian kesedihan.',
        sumber: 'HR. Bukhari, dari Aisyah radhiyallahu ‘anha'
    },
    {
        id: 'sup-labu',
        nama: 'Sup Labu Kuning & Daging',
        kategori: 'Hidangan Utama',
        waktu: '50 mnt',
        porsi: 1,
        warna: '#c9772b',
        inisial: 'Lb',
        ringkas: 'Labu kuning dimasak bersama potongan daging sapi dan rempah. Kuahnya manis gurih, cocok buat makan malam.',
        nutrisi: { kalori: 53, karbo: 2, protein: 5, lemak: 3, serat: 1 },
        bahan: [
            '75 g daging sapi, potong dadu',
            '100 g labu kuning, potong besar',
            '¼ bawang bombay, iris',
            '1 siung bawang putih, geprek',
            '¼ sdt jintan bubuk',
            '250 ml air',
            'Garam, lada, dan minyak zaitun secukupnya'
        ],
        langkah: [
            'Tumis bawang bombay dan bawang putih dengan minyak zaitun sampai harum.',
            'Masukkan daging, aduk sampai berubah warna, lalu taburi jintan.',
            'Tuang air, masak dengan api kecil sekitar 30 menit sampai daging empuk.',
            'Tambahkan labu, masak lagi 10–15 menit sampai labu lunak tapi belum hancur.',
            'Bumbui garam dan lada. Cicipi, sesuaikan.'
        ],
        dalil: 'Anas bin Malik melihat Rasulullah ﷺ mencari-cari potongan labu di sekeliling piring. Sejak itu Anas selalu menyukai labu.',
        sumber: 'HR. Bukhari & Muslim'
    },
    {
        id: 'timun-kurma',
        nama: 'Salad Timun & Kurma Segar',
        kategori: 'Pelengkap',
        waktu: '10 mnt',
        porsi: 1,
        warna: '#5c6b3a',
        inisial: 'Tk',
        ringkas: 'Perpaduan dingin dan manis. Timun yang segar ketemu kurma yang legit — ternyata ini kombinasi yang Nabi ﷺ suka.',
        nutrisi: { kalori: 90, karbo: 15, protein: 1, lemak: 3, serat: 2 },
        bahan: [
            '1 buah timun, iris tipis',
            '3 butir kurma, buang biji dan belah',
            '½ sdm minyak zaitun',
            '½ sdt air jeruk nipis',
            'Sejumput garam dan daun mint secukupnya'
        ],
        langkah: [
            'Tata irisan timun di piring saji.',
            'Letakkan kurma di atasnya.',
            'Campur minyak zaitun, air jeruk nipis, dan garam, lalu siramkan.',
            'Beri daun mint dan sajikan dingin.'
        ],
        dalil: 'Aku melihat Rasulullah ﷺ makan mentimun bersama kurma basah (ruthab).',
        sumber: 'HR. Bukhari & Muslim, dari Abdullah bin Ja‘far'
    },
    {
        id: 'roti-cuka',
        nama: 'Roti Celup Zaitun & Cuka Apel',
        kategori: 'Sarapan',
        waktu: '5 mnt',
        porsi: 1,
        warna: '#7a3e1d',
        inisial: 'Rc',
        ringkas: 'Sarapan paling sederhana di buku ini. Roti hangat, cocolan minyak zaitun, cuka apel, dan sedikit za’atar.',
        nutrisi: { kalori: 450, karbo: 30, protein: 6, lemak: 35, serat: 4 },
        bahan: [
            '2 lembar roti pita atau roti gandum',
            '3 sdm minyak zaitun extra virgin',
            '1 sdm cuka apel',
            '½ sdt za’atar atau oregano kering',
            'Sejumput garam laut'
        ],
        langkah: [
            'Panggang roti sebentar di teflon sampai hangat dan sedikit renyah.',
            'Tuang minyak zaitun ke piring kecil, teteskan cuka apel di tengahnya.',
            'Taburi za’atar dan garam.',
            'Sobek roti, celupkan, nikmati pelan-pelan.'
        ],
        dalil: 'Sebaik-baik lauk adalah cuka.',
        sumber: 'HR. Muslim, dari Jabir bin Abdillah'
    },
    {
        id: 'tharid',
        nama: 'Tharid Kuah Kambing',
        kategori: 'Hidangan Utama',
        waktu: '90 mnt',
        porsi: 1,
        warna: '#8f3b22',
        inisial: 'Th',
        ringkas: 'Roti yang disobek lalu disiram kuah daging kambing berbumbu. Makanan istimewa yang Nabi ﷺ jadikan perumpamaan.',
        nutrisi: { kalori: 100, karbo: 5, protein: 6, lemak: 6, serat: 1 },
        bahan: [
            '125 g daging kambing, potong',
            '½ buah roti pita / roti maryam, sobek-sobek',
            '½ buah tomat, potong',
            '¼ bawang bombay, cincang',
            '¼ sdt lada hitam, ¼ sdt kapulaga, 1 lembar daun salam',
            '300 ml air',
            'Garam secukupnya'
        ],
        langkah: [
            'Rebus kambing sebentar, buang air pertama supaya tidak prengus.',
            'Tumis bawang bombay sampai layu, masukkan daging, tomat, dan rempah.',
            'Tuang air baru, masak dengan api kecil sekitar 1 jam sampai empuk.',
            'Susun sobekan roti di mangkuk lebar.',
            'Siram kuah panas dan daging di atasnya, diamkan 2 menit supaya roti menyerap kuah.'
        ],
        dalil: 'Keutamaan Aisyah atas wanita lain seperti keutamaan tharid atas makanan lainnya.',
        sumber: 'HR. Bukhari & Muslim'
    },
    {
        id: 'wedang-habbats',
        nama: 'Wedang Jahe Madu Habbatussauda',
        kategori: 'Minuman',
        waktu: '15 mnt',
        porsi: 1,
        warna: '#2b2420',
        inisial: 'Wj',
        ringkas: 'Minuman hangat buat malam hujan. Jahe bakar, madu, dan sedikit jintan hitam yang disangrai.',
        nutrisi: { kalori: 35, karbo: 9, protein: 0, lemak: 0, serat: 0 },
        bahan: [
            '½ ruas jahe besar, bakar lalu geprek',
            '½ batang serai, geprek',
            '¼ sdt habbatussauda, sangrai sebentar',
            '1 sdm madu',
            '250 ml air'
        ],
        langkah: [
            'Rebus air bersama jahe dan serai sekitar 10 menit.',
            'Masukkan habbatussauda, rebus 2 menit lagi.',
            'Saring ke gelas, biarkan agak hangat.',
            'Aduk madu ke dalamnya, lalu minum selagi hangat.'
        ],
        dalil: 'Habbatussauda ini adalah obat untuk segala penyakit, kecuali kematian.',
        sumber: 'HR. Bukhari & Muslim, dari Abu Hurairah'
    }
];

const kamus = [
    { kelompok: 'Alkohol', dari: 'Mirin', jenis: 'Arak beras manis (Jepang)', ke: 'Air + madu + sedikit cuka beras', catatan: '3 sdm air, 1 sdm madu, ½ sdt cuka beras. Rasanya manis-asam mirip aslinya.' },
    { kelompok: 'Alkohol', dari: 'Sake', jenis: 'Arak beras (Jepang)', ke: 'Kaldu ayam / kaldu dashi', catatan: 'Untuk marinasi, tambahkan sedikit air jahe biar bau amisnya hilang.' },
    { kelompok: 'Alkohol', dari: 'Angciu / Shaoxing', jenis: 'Arak masak (Tiongkok)', ke: 'Kaldu + kecap asin + cuka hitam', catatan: 'Perbandingan 3 : 1 : ½. Cocok untuk tumisan dan bebek.' },
    { kelompok: 'Alkohol', dari: 'Red wine', jenis: 'Anggur merah beralkohol', ke: 'Jus anggur merah + cuka apel', catatan: 'Untuk semur daging atau saus bolognese. Kurangi gula di resep karena jusnya sudah manis.' },
    { kelompok: 'Alkohol', dari: 'White wine', jenis: 'Anggur putih beralkohol', ke: 'Kaldu ayam + air jeruk lemon', catatan: 'Pas untuk risotto atau saus krim. Sedikit lemon saja, jangan terlalu asam.' },
    { kelompok: 'Alkohol', dari: 'Rum', jenis: 'Minuman keras dari tebu', ke: 'Jus nanas atau air kelapa', catatan: 'Untuk kue, aroma rum bisa diganti perisa rum yang bersertifikat halal.' },
    { kelompok: 'Alkohol', dari: 'Brandy / Cognac', jenis: 'Minuman keras', ke: 'Jus apel atau jus pir', catatan: 'Kalau untuk flambé, lewati saja langkahnya — rasanya tetap enak.' },
    { kelompok: 'Alkohol', dari: 'Bir (untuk adonan)', jenis: 'Minuman fermentasi beralkohol', ke: 'Air soda dingin', catatan: 'Gelembungnya bikin adonan gorengan tetap renyah, sama seperti bir.' },
    { kelompok: 'Alkohol', dari: 'Marsala', jenis: 'Anggur fortifikasi (Italia)', ke: 'Jus anggur + sedikit cuka balsamic', catatan: 'Untuk tiramisu, cukup pakai kopi pekat saja.' },
    { kelompok: 'Alkohol', dari: 'Kirsch', jenis: 'Brandy ceri', ke: 'Sirup ceri atau jus ceri', catatan: 'Biasanya dipakai di black forest. Jus ceri kalengan juga bisa.' },
    { kelompok: 'Babi', dari: 'Gelatin babi', jenis: 'Pengental dari kulit/tulang babi', ke: 'Agar-agar atau gelatin sapi halal', catatan: 'Agar-agar lebih cepat set dan teksturnya lebih padat. Pakai sekitar setengah takaran.' },
    { kelompok: 'Babi', dari: 'Lard', jenis: 'Lemak babi', ke: 'Mentega, ghee, atau shortening nabati', catatan: 'Untuk kulit pai yang flaky, mentega dingin paling mendekati.' },
    { kelompok: 'Babi', dari: 'Bacon', jenis: 'Daging babi asap', ke: 'Beef bacon / smoked beef', catatan: 'Atau kulit ayam yang digoreng kering + sejumput paprika asap.' },
    { kelompok: 'Babi', dari: 'Ham', jenis: 'Paha babi olahan', ke: 'Kalkun asap atau smoked beef', catatan: 'Cocok untuk isian sandwich dan roti lapis.' },
    { kelompok: 'Babi', dari: 'Pepperoni', jenis: 'Sosis babi pedas', ke: 'Pepperoni sapi halal', catatan: 'Sudah banyak dijual di supermarket. Cek logo halalnya.' },
    { kelompok: 'Lainnya', dari: 'Ekstrak vanila', jenis: 'Biasanya dilarutkan dalam alkohol', ke: 'Vanili bubuk / biji vanila asli', catatan: 'Kerok biji dari batang vanila. Aromanya malah lebih wangi.' },
    { kelompok: 'Lainnya', dari: 'Kecap inggris', jenis: 'Beberapa merek mengandung ikan teri & cuka malt', ke: 'Kecap inggris bersertifikat halal', catatan: 'Atau campur kecap asin, cuka apel, dan sedikit gula aren.' },
    { kelompok: 'Lainnya', dari: 'Keju dengan rennet hewani', jenis: 'Enzim dari lambung hewan yang tidak jelas sembelihannya', ke: 'Keju dengan rennet mikroba / nabati', catatan: 'Lihat label "microbial rennet" atau "vegetarian rennet", atau pilih yang berlogo halal.' }
];

const adab = [
    { judul: 'Mulai dengan bismillah', isi: 'Kalau lupa di awal, ucapkan "Bismillahi awwalahu wa akhirahu" saat ingat.', sumber: 'HR. Abu Dawud & Tirmidzi' },
    { judul: 'Pakai tangan kanan', isi: 'Makan dan minum dengan tangan kanan, ambil yang paling dekat dengan kita.', sumber: 'HR. Bukhari & Muslim' },
    { judul: 'Sepertiga, sepertiga, sepertiga', isi: 'Sepertiga perut untuk makanan, sepertiga untuk minum, sepertiga untuk napas.', sumber: 'HR. Tirmidzi' },
    { judul: 'Tidak mencela makanan', isi: 'Kalau suka, dimakan. Kalau tidak suka, ditinggalkan tanpa dikomentari.', sumber: 'HR. Bukhari & Muslim' },
    { judul: 'Makan bersama-sama', isi: 'Berkumpul saat makan dan menyebut nama Allah membuat makanan diberkahi.', sumber: 'HR. Abu Dawud' },
    { judul: 'Habiskan, jangan tersisa', isi: 'Bersihkan piring dan jari, karena kita tidak tahu di bagian mana berkahnya.', sumber: 'HR. Muslim' }
];

const SECTIONS = ['beranda', 'resep', 'kamus'];
const state = { kategori: 'Semua', qResep: '', kelompok: 'Semua', qKamus: '' };
let lastFocus = null;
let openedFromLink = false;

/* ---------- login state (hanya di perangkat) ---------- */
const LOGIN_KEY = 'thibbun-nabawi:user';
const INBOX_KEY = 'thibbun-nabawi:inbox';
const RECIPE_SUBMIT_KEY = 'thibbun-nabawi:recipesubmit';

let currentUser = null;

function isLoggedIn() {
    return !!currentUser;
}

function loadLogin() {
    try {
        currentUser = JSON.parse(localStorage.getItem(LOGIN_KEY)) || null;
    } catch { currentUser = null; }
    updateLoginUI();
}

function saveLogin(user) {
    currentUser = user;
    try {
        localStorage.setItem(LOGIN_KEY, JSON.stringify(user));
    } catch {}
    updateLoginUI();
}

function logout() {
    currentUser = null;
    try { localStorage.removeItem(LOGIN_KEY); } catch {}
    updateLoginUI();
    showToast('Anda telah keluar');
}

function updateLoginUI() {
    const btn = document.querySelector('.btn-login');
    const tambahSection = $('tambah-resep');
    const navLogin = document.querySelector('nav a.btn-login');

    if (isLoggedIn()) {
        if (navLogin) {
            navLogin.textContent = 'Keluar';
            navLogin.dataset.page = '';
            navLogin.removeAttribute('href');
            navLogin.addEventListener('click', (e) => {
                e.preventDefault();
                logout();
            }, { once: true });
        }
        if (tambahSection) tambahSection.classList.remove('hidden');
    } else {
        if (navLogin) {
            navLogin.textContent = 'Masuk';
            navLogin.dataset.page = 'masuk';
            navLogin.href = '#masuk';
            navLogin.onclick = null;
        }
        if (tambahSection) tambahSection.classList.add('hidden');
    }
}

/* ---------- kotak masuk ---------- */
function loadInbox() {
    try {
        return JSON.parse(localStorage.getItem(INBOX_KEY)) || [];
    } catch { return []; }
}

function saveInbox(list) {
    try { localStorage.setItem(INBOX_KEY, JSON.stringify(list)); } catch {}
}

function handleInboxForm(e) {
    e.preventDefault();
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu');
        return;
    }
    const nama = $('inbox-nama').value.trim();
    const email = $('inbox-email').value.trim();
    const pesan = $('inbox-pesan').value.trim();
    const status = $('inbox-status');

    if (!nama || !pesan) {
        status.textContent = 'Nama dan pesan wajib diisi.';
        status.className = 'form-hint err';
        return;
    }

    const masuk = loadInbox();
    masuk.unshift({
        id: Date.now().toString(),
        waktu: new Date().toISOString(),
        user: currentUser.nama,
        nama,
        email,
        pesan,
        dibaca: false
    });
    saveInbox(masuk);

    $('form-masuk').reset();
    status.textContent = 'Pesan terkirim. Terima kasih atas masukan Anda!';
    status.className = 'form-hint ok';
    setTimeout(() => { status.textContent = ''; }, 4000);
}

/* ---------- tambah resep ---------- */
function loadSubmittedRecipes() {
    try {
        return JSON.parse(localStorage.getItem(RECIPE_SUBMIT_KEY)) || [];
    } catch { return []; }
}

function saveSubmittedRecipes(list) {
    try { localStorage.setItem(RECIPE_SUBMIT_KEY, JSON.stringify(list)); } catch {}
}

function handleAddRecipeForm(e) {
    e.preventDefault();
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu');
        return;
    }
    const nama = $('resep-nama').value.trim();
    const kategori = $('resep-kategori').value;
    const waktu = $('resep-waktu').value.trim();
    const porsi = parseInt($('resep-porsi').value, 10) || 1;
    const ringkas = $('resep-ringkas').value.trim();
    const bahan = $('resep-bahan').value.split('\n').map(b => b.trim()).filter(b => b);
    const langkah = $('resep-langkah').value.split('\n').map(l => l.trim()).filter(l => l);
    const dalil = $('resep-dalil').value.trim();
    const status = $('recipe-status');

    if (!nama || !kategori || !waktu || !ringkas || !bahan.length || !langkah.length) {
        status.textContent = 'Isi semua field yang wajib.';
        status.className = 'form-hint err';
        return;
    }

    const list = loadSubmittedRecipes();
    list.unshift({
        id: 'user-' + Date.now(),
        waktu: new Date().toISOString(),
        user: currentUser.nama,
        nama, kategori, waktu, porsi, ringkas, bahan, langkah, dalil,
        disetujui: false
    });
    saveSubmittedRecipes(list);

    $('form-tambah-resep').reset();
    $('resep-porsi').value = 1;
    status.textContent = 'Resep terkirim. Akan ditinjwa sebelum ditampilkan.';
    status.className = 'form-hint ok';
    setTimeout(() => { status.textContent = ''; }, 5000);
}


const $ = id => document.getElementById(id);

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}

function highlight(text, q) {
    const safe = escapeHtml(text);
    if (!q) return safe;
    const pattern = escapeHtml(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
}

function recipeText(r) {
    return [r.nama, r.ringkas, r.kategori, ...r.bahan].join(' ').toLowerCase();
}

function showToast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- navigasi ---------- */
function setActiveNav(sectionId) {
    document.querySelectorAll('nav a').forEach(a => {
        const active = a.dataset.page === sectionId;
        a.classList.toggle('active', active);
        active ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current');
    });
}

function watchSections() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    SECTIONS.forEach(id => observer.observe($(id)));
}


function recipeFromHash() {
    const [section, id] = location.hash.replace('#', '').split('/');
    return section === 'resep' && recipes.some(r => r.id === id) ? id : null;
}

function route() {
    const id = recipeFromHash();
    id ? openRecipe(id) : hideModal();
}

/* ---------- beranda ---------- */
function renderAdab() {
    $('adab-list').innerHTML = adab.map(a => `
        <li>
            <h3>${a.judul}</h3>
            <p>${a.isi}</p>
            <small>${a.sumber}</small>
        </li>
    `).join('');
}

/* ---------- resep ---------- */
/* ---------- favorit (disimpan di perangkat) ---------- */
const FAV_KEY = 'thibbun-nabawi:favorit';
const HEART = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20.5s-7.5-4.6-9.6-9.3C1 7.9 3.2 4.5 6.7 4.5c2.1 0 3.6 1.1 4.6 2.6.3.4.9.4 1.2 0 1-1.5 2.5-2.6 4.6-2.6 3.5 0 5.7 3.4 4.3 6.7-2.1 4.7-9.4 9.3-9.4 9.3z"/></svg>';

let favorites = new Set();

function loadFavorites() {
    try {
        const saved = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
        favorites = new Set(saved.filter(id => recipes.some(r => r.id === id)));
    } catch {
        favorites = new Set();
    }
}

function saveFavorites() {
    try {
        localStorage.setItem(FAV_KEY, JSON.stringify([...favorites]));
    } catch {
        /* mode privat / penyimpanan penuh: favorit tetap jalan selama halaman terbuka */
    }
}

function isFav(id) {
    return favorites.has(id);
}

function favButton(id, withLabel = false) {
    const on = isFav(id);
    const label = on ? 'Hapus dari favorit' : 'Simpan ke favorit';
    return `
        <button type="button" class="${withLabel ? 'btn-small fav-inline' : 'fav-btn'} ${on ? 'on' : ''}"
                data-fav="${id}" aria-pressed="${on}" aria-label="${label}" title="${label}">
            ${HEART}${withLabel ? `<span>${on ? 'Tersimpan' : 'Simpan'}</span>` : ''}
        </button>`;
}

function toggleFav(id) {
    const r = recipes.find(x => x.id === id);
    if (!r) return;

    if (isFav(id)) {
        favorites.delete(id);
        showToast(`${r.nama} dihapus dari favorit`);
    } else {
        favorites.add(id);
        showToast(`${r.nama} disimpan ke favorit`);
    }
    saveFavorites();

    renderRecipeFilters();
    if (state.kategori === 'Favorit') renderRecipes();

    const on = isFav(id);
    const label = on ? 'Hapus dari favorit' : 'Simpan ke favorit';
    document.querySelectorAll(`[data-fav="${id}"]`).forEach(btn => {
        btn.classList.toggle('on', on);
        btn.classList.remove('pop');
        void btn.offsetWidth;
        if (on) btn.classList.add('pop');
        btn.setAttribute('aria-pressed', on);
        btn.setAttribute('aria-label', label);
        btn.title = label;
        const text = btn.querySelector('span');
        if (text) text.textContent = on ? 'Tersimpan' : 'Simpan';
    });
}

function cardHTML(r, q = '') {
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <article class="card">
        ${favButton(r.id)}
        <a class="card-link" href="#resep/${r.id}">
            <div class="card-art" style="--c:${r.warna}" aria-hidden="true">${r.inisial}</div>
            <div class="card-body">
                <div class="card-meta">
                    <span>${r.kategori}</span>
                    <span>${r.porsi} porsi</span>
                </div>
                <h3>${highlight(r.nama, q)}</h3>
                <p>${highlight(r.ringkas, q)}</p>
                <div class="card-foot">
                    <span class="card-more">Buka resep →</span>
                </div>
            </div>
        </a>
            </article>
        </div>
    `;
}

function matchKategori(r) {
    if (state.kategori === 'Semua') return true;
    if (state.kategori === 'Favorit') return isFav(r.id);
    return r.kategori === state.kategori;
}

function renderRecipeFilters() {
    const cats = ['Semua', ...new Set(recipes.map(r => r.kategori))];
    const chips = cats.map(c => {
        return `<button type="button" class="chip ${c === state.kategori ? 'active' : ''}" data-kategori="${c}">${c}</button>`;
    });

    chips.splice(1, 0, `
        <button type="button" class="chip chip-fav ${state.kategori === 'Favorit' ? 'active' : ''}" data-kategori="Favorit">
            ${HEART} Favorit
        </button>`);

    $('recipe-filters').innerHTML = chips.join('');
}

function renderRecipes() {
    const q = state.qResep.trim().toLowerCase();
    const list = recipes.filter(r => matchKategori(r) && (!q || recipeText(r).includes(q)));

    $('resep-count').textContent = q || state.kategori !== 'Semua' ? `${list.length} hasil` : '';

    let empty = `
        <div class="empty">
            <b>Belum ada resep yang cocok.</b>
            Coba kata lain, atau
            <button type="button" class="link-btn" data-reset="resep">tampilkan semua resep</button>.
        </div>`;

    if (state.kategori === 'Favorit' && !favorites.size) {
        empty = `
            <div class="empty">
                <span class="empty-icon">${HEART}</span>
                <b>Belum ada resep favorit.</b>
                Tekan ikon hati di kartu resep untuk menyimpannya di sini.
                <br><button type="button" class="link-btn" data-reset="resep">Lihat semua resep</button>
            </div>`;
    }

    $('recipe-container').innerHTML = list.length ? list.map(r => cardHTML(r, q)).join('') : empty;
}

function openRecipe(id) {
    const index = recipes.findIndex(r => r.id === id);
    const r = recipes[index];
    const prev = recipes[(index - 1 + recipes.length) % recipes.length];
    const next = recipes[(index + 1) % recipes.length];

    $('modal-content').innerHTML = `
        <button type="button" class="modal-close" data-close aria-label="Tutup">×</button>
        <p class="eyebrow">${r.kategori.toLowerCase()}</p>
        <h2 id="modal-title">${r.nama}</h2>
        <p class="modal-lead">${r.ringkas}</p>

        <div class="modal-bar">
            <div class="modal-facts">
                <span><b>${r.porsi}</b> porsi</span>
                <span><b>${r.bahan.length}</b> bahan</span>
            </div>
            <div class="modal-actions">
                ${favButton(r.id, true)}
                <button type="button" class="btn-small" data-action="copy">Salin tautan</button>
                <button type="button" class="btn-small" data-action="print">Cetak</button>
            </div>
        </div>

        <div class="modal-cols">
            <div>
                <h4>bahan <span class="hint">centang yang sudah siap</span></h4>
                <ul class="checklist">
                    ${r.bahan.map((b, i) => `
                        <li><label><input type="checkbox" id="b-${i}"><span>${b}</span></label></li>
                    `).join('')}
                </ul>
            </div>
            <div>
                <h4>cara membuat <span class="hint">klik langkah yang selesai</span></h4>
                <ol class="steps">
                    ${r.langkah.map(l => `<li tabindex="0">${l}</li>`).join('')}
                </ol>
            </div>
        </div>

        <div class="nutrisi">
            <h4>Nutrisi per porsi <span class="hint">perkiraan, bisa beda tergantung bahan & takaran</span></h4>
            <dl>
                <div><dt>±${r.nutrisi.kalori}</dt><dd>kkal</dd></div>
                <div><dt>±${r.nutrisi.karbo} g</dt><dd>karbo</dd></div>
                <div><dt>±${r.nutrisi.protein} g</dt><dd>protein</dd></div>
                <div><dt>±${r.nutrisi.lemak} g</dt><dd>lemak</dd></div>
                <div><dt>±${r.nutrisi.serat} g</dt><dd>serat</dd></div>
            </dl>
        </div>

        <figure class="hadith">
            <blockquote>“${r.dalil}”</blockquote>
            <figcaption>${r.sumber}</figcaption>
        </figure>

        <nav class="modal-nav" aria-label="Resep lain">
            <a href="#resep/${prev.id}"><small>← Sebelumnya</small>${prev.nama}</a>
            <a href="#resep/${next.id}"><small>Berikutnya →</small>${next.nama}</a>
        </nav>
    `;

    const modal = $('recipe-modal');
    if (!modal.classList.contains('open')) {
        lastFocus = document.activeElement;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    $('modal-content').scrollTop = 0;
    modal.querySelector('.modal-close').focus();
    document.title = `${r.nama} — Thibbun Nabawi`;
}

function hideModal() {
    const modal = $('recipe-modal');
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    document.title = 'Thibbun Nabawi — catatan resep dari meja makan';
    if (lastFocus) lastFocus.focus({ preventScroll: true });
}

function closeRecipe() {
    history.pushState(null, '', '#resep');
    hideModal();
    if (openedFromLink) {
        openedFromLink = false;
        $('resep').scrollIntoView({ behavior: 'instant' });
    }
}

/* ---------- kamus ---------- */
function renderKamusFilters() {
    const groups = ['Semua', 'Alkohol', 'Babi', 'Lainnya'];
    const label = { Babi: 'Babi & turunannya', Lainnya: 'Perlu dicek' };
    $('kamus-filters').innerHTML = groups.map(g => {
        return `<button type="button" class="chip ${g === state.kelompok ? 'active' : ''}" data-kelompok="${g}">${label[g] || g}</button>`;
    }).join('');
}

function renderKamus() {
    const q = state.qKamus.trim().toLowerCase();
    const items = kamus.filter(k =>
        (state.kelompok === 'Semua' || k.kelompok === state.kelompok) &&
        (!q || [k.dari, k.jenis, k.ke, k.catatan].some(t => t.toLowerCase().includes(q)))
    );

    $('kamus-count').textContent = `${items.length} bahan`;

    $('kamus-container').innerHTML = items.length
        ? items.map(k => `
            <div class="dict-item">
                <div class="dict-from">
                    <h3>${highlight(k.dari, q)}</h3>
                    <span>${highlight(k.jenis, q)}</span>
                </div>
                <div class="dict-arrow" aria-hidden="true">→</div>
                <div class="dict-to">
                    <b>${highlight(k.ke, q)}</b>
                    <p>${highlight(k.catatan, q)}</p>
                </div>
            </div>`).join('')
        : `<div class="empty">
               <b>Hmm, belum ada di catatan kami.</b>
               Coba kata lain, atau
               <button type="button" class="link-btn" data-reset="kamus">tampilkan semua bahan</button>.
           </div>`;
}

/* ---------- event ---------- */
document.addEventListener('click', e => {
    const el = e.target.closest('[data-kategori], [data-kelompok], [data-reset], [data-close], [data-action]');
    const fav = e.target.closest('[data-fav]');

    if (fav) {
        e.preventDefault();
        return toggleFav(fav.dataset.fav);
    }
    if (e.target.id === 'recipe-modal') return closeRecipe();
    if (e.target.matches('.steps li')) e.target.classList.toggle('done');

    // tutup modal login jika klik di luar
    if (e.target.id === 'login-modal') closeLogin();

    if (!el) return;

    if (el.dataset.kategori) {
        state.kategori = el.dataset.kategori;
        renderRecipeFilters();
        renderRecipes();
    } else if (el.dataset.kelompok) {
        state.kelompok = el.dataset.kelompok;
        renderKamusFilters();
        renderKamus();
    } else if (el.dataset.reset === 'resep') {
        state.qResep = '';
        state.kategori = 'Semua';
        $('search-resep').value = '';
        renderRecipeFilters();
        renderRecipes();
    } else if (el.dataset.reset === 'kamus') {
        state.qKamus = '';
        state.kelompok = 'Semua';
        $('search-kamus').value = '';
        renderKamusFilters();
        renderKamus();
    } else if ('close' in el.dataset) {
        closeRecipe();
    } else if (el.dataset.action === 'print') {
        window.print();
    } else if (el.dataset.action === 'copy') {
        navigator.clipboard?.writeText(location.href)
            .then(() => showToast('Tautan resep disalin'))
            .catch(() => showToast('Gagal menyalin, salin dari address bar ya'));
    }
});

// ---------- login modal ----------
function openLogin() {
    const modal = $('login-modal');
    lastFocus = document.activeElement;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    $('login-nama').focus();
}

function closeLogin() {
    const modal = $('login-modal');
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus({ preventScroll: true });
}

document.addEventListener('click', e => {
    if (e.target.matches('[data-page="masuk"]')) {
        e.preventDefault();
        if (isLoggedIn()) {
            logout();
        } else {
            openLogin();
        }
    }
    if (e.target.matches('[data-login-close]')) {
        e.preventDefault();
        closeLogin();
    }
});

document.addEventListener('keydown', e => {
    const modal = $('login-modal');
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') closeLogin();
});

// ---------- form login ----------
$('form-login').addEventListener('submit', e => {
    e.preventDefault();
    const nama = $('login-nama').value.trim();
    const status = $('login-status');
    if (!nama) {
        status.textContent = 'Nama wajib diisi.';
        status.className = 'form-hint err';
        return;
    }
    saveLogin({ nama });
    $('form-login').reset();
    status.textContent = '';
    closeLogin();
    showToast(`Selamat datang, ${nama}`);
});

// ---------- form kotak masuk ----------
$('form-masuk').addEventListener('submit', handleInboxForm);

// ---------- form tambah resep ----------
$('form-tambah-resep').addEventListener('submit', handleAddRecipeForm);

document.addEventListener('keydown', e => {
    const modal = $('recipe-modal');
    if (!modal.classList.contains('open')) return;

    if (e.key === 'Escape') closeRecipe();

    if (e.key === 'Enter' && e.target.matches('.steps li')) e.target.classList.toggle('done');

    if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll('button, a, input, [tabindex="0"]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
});

$('search-resep').addEventListener('input', e => {
    state.qResep = e.target.value;
    renderRecipes();
});

$('search-kamus').addEventListener('input', e => {
    state.qKamus = e.target.value;
    renderKamus();
});

window.addEventListener('hashchange', route);

loadFavorites();
loadLogin();
renderAdab();
renderRecipeFilters();
renderRecipes();
renderKamusFilters();
renderKamus();
watchSections();

if (recipeFromHash()) {
    openedFromLink = true;
    route();
}
