let recipes = [];
let kamus = [];
let adab = [];

const SECTIONS = ['beranda', 'resep', 'kamus'];
const state = { kategori: 'Semua', qResep: '', kelompok: 'Semua', qKamus: '' };
let lastFocus = null;
let openedFromLink = false;

/* ---------- Supabase ---------- */
let supabaseClient = null;

function isSupabaseConfigured() {
    return typeof window.SUPABASE_URL === 'string' &&
        window.SUPABASE_URL &&
        !window.SUPABASE_URL.includes('YOUR_PROJECT_REF') &&
        typeof window.SUPABASE_ANON_KEY === 'string' &&
        window.SUPABASE_ANON_KEY &&
        window.SUPABASE_ANON_KEY !== 'YOUR_SUPABASE_ANON_KEY';
}

function initSupabase() {
    if (supabaseClient) return supabaseClient;
    if (isSupabaseConfigured() && window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
    }
    return supabaseClient;
}

const RECIPE_IMAGES = {
    'talbinah': { src: 'img/talbinah-fufuskitchen.png', alt: 'Semangkuk talbinah susu madu' },
    'sup-labu': { src: 'img/autumn-pumpkin-soup.webp', alt: 'Semangkuk sup labu hangat' },
    'timun-kurma': { src: 'img/asian-cucumber-salad.jpg', alt: 'Salad mentimun segar' },
    'roti-cuka': { src: 'img/wholemeal-sourdough-bread-smoked-butter-with-sherry.jpg', alt: 'Roti dengan minyak zaitun' },
    'tharid': { src: 'img/lamb-stew-wiesbaden.jpg', alt: 'Kuah daging disajikan bersama roti' },
    'wedang-habbats': { src: 'img/wedang-jahe-halodoc.webp', alt: 'Segelas wedang jahe hangat' }
};

function getRecipeImage(r) {
    if (r && r.gambar) return { src: r.gambar, alt: r.gambar_alt || r.nama || '' };
    if (r && RECIPE_IMAGES[r.id]) return RECIPE_IMAGES[r.id];
    return null;
}

function mapResepRow(row) {
    const base = {
        id: row.slug || ('db-' + row.id),
        db_id: row.id,
        nama: row.nama,
        kategori: row.kategori,
        waktu: row.waktu_masak || '',
        porsi: row.porsi || 1,
        warna: row.warna || '#3f6b4a',
        inisial: row.inisial || (row.nama ? String(row.nama).slice(0, 2) : ''),
        ringkas: row.ringkas || '',
        nutrisi: row.nutrisi || { kalori: 0, karbo: 0, protein: 0, lemak: 0, serat: 0 },
        bahan: Array.isArray(row.bahan) ? row.bahan : [],
        langkah: Array.isArray(row.langkah) ? row.langkah : [],
        dalil: row.dalil || '',
        sumber: row.sumber || ''
    };
    if (row.gambar) {
        base.gambar = row.gambar;
        base.gambar_alt = row.gambar_alt || '';
    }
    return base;
}

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
    const $navLogin = $('nav a.btn-login');
    const $tambahSection = $('#tambah-resep');

    if (isLoggedIn()) {
        if ($navLogin.length) {
            $navLogin.text('Keluar').attr('href', '#').removeAttr('data-page');
        }
        $tambahSection.removeClass('hidden');
    } else {
        if ($navLogin.length) {
            $navLogin.text('Masuk').attr({ href: '#masuk', 'data-page': 'masuk' });
        }
        $tambahSection.addClass('hidden');
    }
}

/* ---------- utilitas ---------- */
function setLoading($el, text) {
    $el.html(`<div class="empty"><b>${escapeHtml(text)}</b></div>`);
}

function ajaxErrorMessage(err) {
    if (!err) return 'Gagal memuat data.';
    if (err.status === 0) return 'Tidak bisa terhubung. Periksa koneksi atau jalankan lewat server lokal.';
    if (err.status) return `Gagal memuat data (HTTP ${err.status}).`;
    if (err.message) return `Gagal memuat data (${err.message}).`;
    return 'Gagal memuat data.';
}

/* ---------- memuat data via AJAX/Supabase ---------- */
let dataReady = false;

async function getResepData() {
    const sb = initSupabase();
    if (sb) {
        const { data, error } = await sb
            .from('resep')
            .select('*')
            .eq('disetujui', true)
            .order('created_at', { ascending: true })
            .order('id', { ascending: true });
        if (error) throw error;
        return Array.isArray(data) ? data.map(mapResepRow) : [];
    }
    const data = await $.getJSON('data/resep.json');
    return Array.isArray(data) ? data : [];
}

function loadData() {
    dataReady = false;
    $('#adab-list').html('<li><p class="form-hint">Memuat adab makan…</p></li>');
    setLoading($('#recipe-container'), 'Memuat resep…');
    setLoading($('#kamus-container'), 'Memuat kamus bahan…');

    const resepReq = getResepData().catch(function () {
        return $.getJSON('data/resep.json').then(function (data) {
            return Array.isArray(data) ? data : [];
        });
    });
    const kamusReq = $.getJSON('data/kamus.json').then(function (d) { return Array.isArray(d) ? d : []; });
    const adabReq = $.getJSON('data/adab.json').then(function (d) { return Array.isArray(d) ? d : []; });

    return $.when(resepReq, kamusReq, adabReq).done(function (resepData, kamusData, adabData) {
        recipes = Array.isArray(resepData) ? resepData : (Array.isArray(resepData && resepData[0]) ? resepData[0] : []);
        kamus = Array.isArray(kamusData) ? kamusData : (Array.isArray(kamusData && kamusData[0]) ? kamusData[0] : []);
        adab = Array.isArray(adabData) ? adabData : (Array.isArray(adabData && adabData[0]) ? adabData[0] : []);
        dataReady = true;
    }).fail(function (err) {
        const msg = ajaxErrorMessage(err);
        $('#adab-list').html(`<li><p>${escapeHtml(msg)}</p></li>`);
        $('#recipe-container').html(`<div class="empty"><b>${escapeHtml(msg)}</b><br><button type="button" class="link-btn" data-reload="data">Coba muat ulang</button></div>`);
        $('#kamus-container').html(`<div class="empty"><b>${escapeHtml(msg)}</b><br><button type="button" class="link-btn" data-reload="data">Coba muat ulang</button></div>`);
        showToast('Gagal memuat data');
    });
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

function simpanInboxLokal(payload) {
    const masuk = loadInbox();
    masuk.unshift(Object.assign({ id: Date.now().toString(), dibaca: false }, payload));
    saveInbox(masuk);
}

async function handleInboxForm(e) {
    e.preventDefault();
    if (!currentUser) {
        $('#inbox-status')
            .text('Silakan masuk terlebih dahulu untuk mengirim pesan.')
            .removeClass('ok')
            .addClass('err');
        showToast('Silakan masuk terlebih dahulu');
        openLogin();
        return;
    }
    const nama = $.trim($('#inbox-nama').val());
    const email = $.trim($('#inbox-email').val());
    const pesan = $.trim($('#inbox-pesan').val());
    const $status = $('#inbox-status');
    const $btn = $(this).find('button[type="submit"]');

    if (!nama || !pesan) {
        $status.text('Nama dan pesan wajib diisi.').removeClass('ok').addClass('err');
        return;
    }

    const payload = {
        waktu: new Date().toISOString(),
        user: currentUser.nama,
        nama,
        email,
        pesan
    };

    $btn.prop('disabled', true).text('Mengirim…');
    $status.text('Mengirim pesan…').removeClass('ok err');

    const sb = initSupabase();
    try {
        if (sb) {
            const { error } = await sb.from('pesan').insert({
                user_nama: currentUser.nama,
                nama,
                email: email || null,
                pesan
            });
            if (error) throw error;
            simpanInboxLokal(payload);
            $('#form-masuk')[0].reset();
            $status.text('Pesan terkirim. Terima kasih atas masukan Anda!').removeClass('err').addClass('ok');
        } else {
            throw new Error('Supabase belum dikonfigurasi');
        }
    } catch (err) {
        // fallback: simpan lokal agar data tetap masuk
        simpanInboxLokal(payload);
        $('#form-masuk')[0].reset();
        $status.text('Pesan disimpan di perangkat ini (database tidak tersedia).').removeClass('err').addClass('ok');
    } finally {
        $btn.prop('disabled', false).text('Kirim Pesan');
        setTimeout(() => { $status.text('').removeClass('ok'); }, 4000);
    }
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

function simpanResepLokal(payload) {
    const list = loadSubmittedRecipes();
    list.unshift(Object.assign({ id: 'user-' + Date.now(), disetujui: false }, payload));
    saveSubmittedRecipes(list);
}

let recipeImageData = null;

function readImageAsDataURL(file, maxSize = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        if (!file) { resolve(null); return; }
        if (!file.type || !file.type.startsWith('image/')) {
            reject(new Error('File harus berupa gambar.'));
            return;
        }
        const reader = new FileReader();
        reader.onerror = () => reject(new Error('Gagal membaca file gambar.'));
        reader.onload = () => {
            const img = new Image();
            img.onerror = () => reject(new Error('Format gambar tidak didukung.'));
            img.onload = () => {
                let { width, height } = img;
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round(height * (maxSize / width));
                        width = maxSize;
                    } else {
                        width = Math.round(width * (maxSize / height));
                        height = maxSize;
                    }
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // gunakan jpeg untuk kompresi yang baik; png tetap diproses
                let dataUrl = canvas.toDataURL('image/jpeg', quality);
                resolve(dataUrl);
            };
            img.src = reader.result;
        };
        reader.readAsDataURL(file);
    });
}

function clearRecipeImagePreview() {
    recipeImageData = null;
    $('#resep-foto-preview').addClass('hidden').empty();
}

async function handleRecipeImageChange() {
    const input = document.getElementById('resep-foto');
    const file = input && input.files && input.files[0];
    const $preview = $('#resep-foto-preview');
    if (!file) {
        clearRecipeImagePreview();
        return;
    }
    try {
        recipeImageData = await readImageAsDataURL(file);
        $preview
            .removeClass('hidden')
            .html(`<img src="${recipeImageData}" alt="Pratinjau foto makanan">`);
    } catch (err) {
        clearRecipeImagePreview();
        showToast(err.message || 'Gagal memuat foto.');
    }
}

async function handleAddRecipeForm(e) {
    e.preventDefault();
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu');
        return;
    }
    const nama = $.trim($('#resep-nama').val());
    const kategori = $('#resep-kategori').val();
    const waktu = $.trim($('#resep-waktu').val());
    const porsi = parseInt($('#resep-porsi').val(), 10) || 1;
    const ringkas = $.trim($('#resep-ringkas').val());
    const bahan = $.trim($('#resep-bahan').val()).split('\n').map(b => $.trim(b)).filter(Boolean);
    const langkah = $.trim($('#resep-langkah').val()).split('\n').map(l => $.trim(l)).filter(Boolean);
    const dalil = $.trim($('#resep-dalil').val());
    const $status = $('#recipe-status');
    const $btn = $(this).find('button[type="submit"]');

    if (!nama || !kategori || !waktu || !ringkas || !bahan.length || !langkah.length) {
        $status.text('Isi semua field yang wajib.').removeClass('ok').addClass('err');
        return;
    }

    // pastikan foto (jika dipilih) sudah diproses
    let gambar = recipeImageData;
    const fotoInput = document.getElementById('resep-foto');
    if (!gambar && fotoInput && fotoInput.files && fotoInput.files[0]) {
        try {
            gambar = await readImageAsDataURL(fotoInput.files[0]);
            recipeImageData = gambar;
        } catch (err) {
            $status.text(err.message || 'Gagal memproses foto.').removeClass('ok').addClass('err');
            return;
        }
    }

    const payload = {
        waktuSubmit: new Date().toISOString(),
        user: currentUser.nama,
        user_id: currentUser.id || null,
        nama,
        kategori,
        waktuMasak: waktu,
        porsi,
        ringkas,
        bahan,
        langkah,
        dalil
    };
    if (gambar) {
        payload.gambar = gambar;
        payload.gambar_alt = `Foto ${nama}`;
    }

    $btn.prop('disabled', true).text('Mengirim…');
    $status.text('Mengirim resep…').removeClass('ok err');

    const sb = initSupabase();
    let sentToDb = false;
    try {
        if (sb) {
            const inisial = String(nama).trim().slice(0, 2).toUpperCase();
            const insertData = {
                nama,
                kategori,
                waktu_masak: waktu,
                porsi,
                warna: '#3f6b4a',
                inisial,
                ringkas,
                nutrisi: { kalori: 0, karbo: 0, protein: 0, lemak: 0, serat: 0 },
                bahan,
                langkah,
                dalil: dalil || null,
                user_id: currentUser.id || null,
                disetujui: false
            };
            if (gambar) {
                insertData.gambar = gambar;
                insertData.gambar_alt = `Foto ${nama}`;
            }
            let { error } = await sb.from('resep').insert(insertData);
            // jika kolom gambar belum ada di tabel, coba kirim tanpa gambar
            if (error && gambar) {
                const errText = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`.toLowerCase();
                if (error.code === '42703' || errText.includes('gambar')) {
                    const { gambar: _g, gambar_alt: _ga, ...withoutImage } = insertData;
                    const retry = await sb.from('resep').insert(withoutImage);
                    error = retry.error;
                }
            }
            if (error) throw error;
            sentToDb = true;
            simpanResepLokal(payload);
            $('#form-tambah-resep')[0].reset();
            $('#resep-porsi').val(1);
            clearRecipeImagePreview();
            $status.text('Resep terkirim. Akan ditinjau sebelum ditampilkan.').removeClass('err').addClass('ok');
        } else {
            throw new Error('Supabase belum dikonfigurasi');
        }
    } catch (err) {
        simpanResepLokal(payload);
        $('#form-tambah-resep')[0].reset();
        $('#resep-porsi').val(1);
        clearRecipeImagePreview();
        $status.text('Resep disimpan di perangkat ini (database tidak tersedia).').removeClass('err').addClass('ok');
    } finally {
        $btn.prop('disabled', false).text('Kirim Resep');
        setTimeout(() => { $status.text('').removeClass('ok'); }, 5000);
    }
}

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
    return [r.nama, r.ringkas, r.kategori, ...(r.bahan || [])].join(' ').toLowerCase();
}

function showToast(msg) {
    const $t = $('#toast').stop(true, true).text(msg).addClass('show');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => $t.removeClass('show'), 2200);
}

/* ---------- navigasi ---------- */
function setActiveNav(sectionId) {
    $('nav a[data-page]').each(function () {
        const active = $(this).data('page') === sectionId;
        $(this).toggleClass('active', active);
        if (active) $(this).attr('aria-current', 'true');
        else $(this).removeAttr('aria-current');
    });
}

function watchSections() {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) setActiveNav(entry.target.id);
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    SECTIONS.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
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
    if (!adab.length) {
        $('#adab-list').html('');
        return;
    }
    $('#adab-list').html(adab.map(a => `
        <li>
            <h3>${escapeHtml(a.judul)}</h3>
            <p>${escapeHtml(a.isi)}</p>
            <small>${escapeHtml(a.sumber)}</small>
        </li>
    `).join(''));
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
    $(`[data-fav="${id}"]`).each(function () {
        const $btn = $(this);
        $btn.toggleClass('on', on).attr({ 'aria-pressed': on, 'aria-label': label, title: label });
        $btn.removeClass('pop');
        void this.offsetWidth;
        if (on) $btn.addClass('pop');
        $btn.find('span').text(on ? 'Tersimpan' : 'Simpan');
    });
}

function cardHTML(r, q = '') {
    const img = getRecipeImage(r);
    const art = img
        ? `<div class="card-art card-art-photo"><img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" loading="lazy" decoding="async"></div>`
        : `<div class="card-art" style="--c:${r.warna}" aria-hidden="true">${r.inisial}</div>`;
    return `
        <div class="col-12 col-md-6 col-lg-4">
            <article class="card">
        ${favButton(r.id)}
        <a class="card-link" href="#resep/${r.id}">
            ${art}
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

    $('#recipe-filters').html(chips.join(''));
}

function renderRecipes() {
    if (!recipes.length) return;
    const q = $.trim(state.qResep).toLowerCase();
    const list = recipes.filter(r => matchKategori(r) && (!q || recipeText(r).includes(q)));

    $('#resep-count').text(q || state.kategori !== 'Semua' ? `${list.length} hasil` : '');

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

    $('#recipe-container').html(list.length ? list.map(r => cardHTML(r, q)).join('') : empty);
}

function openRecipe(id) {
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) return;
    const r = recipes[index];
    const prev = recipes[(index - 1 + recipes.length) % recipes.length];
    const next = recipes[(index + 1) % recipes.length];

    const img = getRecipeImage(r);
    const heroImg = img
        ? `<figure class="modal-hero"><img src="${escapeHtml(img.src)}" alt="${escapeHtml(img.alt)}" decoding="async"></figure>`
        : '';

    $('#modal-content').html(`
        <button type="button" class="modal-close" data-close aria-label="Tutup">×</button>
        <p class="eyebrow">${r.kategori.toLowerCase()}</p>
        <h2 id="modal-title">${escapeHtml(r.nama)}</h2>
        <p class="modal-lead">${escapeHtml(r.ringkas)}</p>
        ${heroImg}

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
                        <li><label><input type="checkbox" id="b-${i}"><span>${escapeHtml(b)}</span></label></li>
                    `).join('')}
                </ul>
            </div>
            <div>
                <h4>cara membuat <span class="hint">klik langkah yang selesai</span></h4>
                <ol class="steps">
                    ${r.langkah.map(l => `<li tabindex="0">${escapeHtml(l)}</li>`).join('')}
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
            <blockquote>“${escapeHtml(r.dalil)}”</blockquote>
            <figcaption>${escapeHtml(r.sumber)}</figcaption>
        </figure>

        <nav class="modal-nav" aria-label="Resep lain">
            <a href="#resep/${prev.id}"><small>← Sebelumnya</small>${escapeHtml(prev.nama)}</a>
            <a href="#resep/${next.id}"><small>Berikutnya →</small>${escapeHtml(next.nama)}</a>
        </nav>
    `);

    const $modal = $('#recipe-modal');
    if (!$modal.hasClass('open')) {
        lastFocus = document.activeElement;
        $modal.addClass('open');
        $('body').css('overflow', 'hidden');
    }
    $('#modal-content').scrollTop(0);
    $modal.find('.modal-close').trigger('focus');
    document.title = `${r.nama} — Thibbun Nabawi`;
}

function hideModal() {
    const $modal = $('#recipe-modal');
    if (!$modal.hasClass('open')) return;
    $modal.removeClass('open');
    $('body').css('overflow', '');
    document.title = 'Thibbun Nabawi — catatan resep dari meja makan';
    if (lastFocus && typeof lastFocus.focus === 'function') {
        $(lastFocus).trigger('focus');
    }
}

function closeRecipe() {
    history.pushState(null, '', '#resep');
    hideModal();
    if (openedFromLink) {
        openedFromLink = false;
        const resep = document.getElementById('resep');
        if (resep) resep.scrollIntoView({ behavior: 'instant' });
    }
}

/* ---------- kamus ---------- */
function renderKamusFilters() {
    const groups = ['Semua', 'Alkohol', 'Babi', 'Lainnya'];
    const label = { Babi: 'Babi & turunannya', Lainnya: 'Perlu dicek' };
    $('#kamus-filters').html(groups.map(g => {
        return `<button type="button" class="chip ${g === state.kelompok ? 'active' : ''}" data-kelompok="${g}">${label[g] || g}</button>`;
    }).join(''));
}

function renderKamus() {
    if (!kamus.length) return;
    const q = $.trim(state.qKamus).toLowerCase();
    const items = kamus.filter(k =>
        (state.kelompok === 'Semua' || k.kelompok === state.kelompok) &&
        (!q || [k.dari, k.jenis, k.ke, k.catatan].some(t => String(t).toLowerCase().includes(q)))
    );

    $('#kamus-count').text(`${items.length} bahan`);

    $('#kamus-container').html(items.length
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
           </div>`);
}

/* ---------- modal login ---------- */
function openLogin() {
    lastFocus = document.activeElement;
    $('#login-modal').addClass('open');
    $('body').css('overflow', 'hidden');
    $('#login-nama').trigger('focus');
}

function closeLogin() {
    const $modal = $('#login-modal');
    if (!$modal.hasClass('open')) return;
    $modal.removeClass('open');
    $('body').css('overflow', '');
    if (lastFocus && typeof lastFocus.focus === 'function') {
        $(lastFocus).trigger('focus');
    }
}

function initApp() {
    loadFavorites();
    if (dataReady) {
        renderAdab();
        renderRecipeFilters();
        renderRecipes();
        renderKamusFilters();
        renderKamus();
        if (recipeFromHash()) {
            openedFromLink = true;
            route();
        }
    }
    watchSections();
}

/* ---------- event (jQuery delegation) ---------- */
$(function () {
    $(document)
        .on('click', '[data-fav]', function (e) {
            e.preventDefault();
            e.stopPropagation();
            toggleFav($(this).data('fav'));
        })
        .on('click', '#recipe-modal', function (e) {
            if (e.target.id === 'recipe-modal') closeRecipe();
        })
        .on('click', '#login-modal', function (e) {
            if (e.target.id === 'login-modal') closeLogin();
        })
        .on('click', '.steps li', function () {
            $(this).toggleClass('done');
        })
        .on('click', '[data-kategori]', function () {
            state.kategori = $(this).data('kategori');
            renderRecipeFilters();
            renderRecipes();
        })
        .on('click', '[data-kelompok]', function () {
            state.kelompok = $(this).data('kelompok');
            renderKamusFilters();
            renderKamus();
        })
        .on('click', '[data-reset="resep"]', function () {
            state.qResep = '';
            state.kategori = 'Semua';
            $('#search-resep').val('');
            renderRecipeFilters();
            renderRecipes();
        })
        .on('click', '[data-reset="kamus"]', function () {
            state.qKamus = '';
            state.kelompok = 'Semua';
            $('#search-kamus').val('');
            renderKamusFilters();
            renderKamus();
        })
        .on('click', '[data-reload="data"]', function () {
            loadData().always(initApp);
        })
        .on('click', '[data-close]', function () {
            closeRecipe();
        })
        .on('click', '[data-action="print"]', function () {
            window.print();
        })
        .on('click', '[data-action="copy"]', function () {
            const text = location.href;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text)
                    .then(() => showToast('Tautan resep disalin'))
                    .catch(() => showToast('Gagal menyalin, salin dari address bar ya'));
            } else {
                showToast('Gagal menyalin, salin dari address bar ya');
            }
        })
        .on('click', 'nav a.btn-login', function (e) {
            e.preventDefault();
            if (isLoggedIn()) logout();
            else openLogin();
        })
        .on('click', '[data-login-close]', function (e) {
            e.preventDefault();
            closeLogin();
        })
        .on('keydown', function (e) {
            if ($('#login-modal').hasClass('open') && e.key === 'Escape') {
                closeLogin();
            }
            if ($('#recipe-modal').hasClass('open')) {
                if (e.key === 'Escape') closeRecipe();
                if (e.key === 'Enter' && $(e.target).is('.steps li')) {
                    $(e.target).toggleClass('done');
                }
                if (e.key === 'Tab') {
                    const $focusable = $('#recipe-modal').find('button, a, input, [tabindex="0"]');
                    const first = $focusable.first()[0];
                    const last = $focusable.last()[0];
                    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); $(last).trigger('focus'); }
                    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); $(first).trigger('focus'); }
                }
            }
        });

    $('#form-login').on('submit', async function (e) {
        e.preventDefault();
        const nama = $.trim($('#login-nama').val());
        const $status = $('#login-status');
        const $btn = $(this).find('button[type="submit"]');
        if (!nama) {
            $status.text('Nama wajib diisi.').removeClass('ok').addClass('err');
            return;
        }

        $btn.prop('disabled', true).text('Memproses…');
        $status.text('Menghubungkan ke database…').removeClass('ok err');

        const sb = initSupabase();
        try {
            if (!sb) throw new Error('Supabase belum dikonfigurasi');

            let user = null;
            const { data: found, error: findErr } = await sb
                .from('users')
                .select('id, nama')
                .eq('nama', nama)
                .maybeSingle();
            if (findErr) throw findErr;

            if (found) {
                user = { id: found.id, nama: found.nama };
                await sb.from('users').update({ last_login: new Date().toISOString() }).eq('id', found.id);
            } else {
                const { data: inserted, error: insErr } = await sb
                    .from('users')
                    .insert({ nama, last_login: new Date().toISOString() })
                    .select('id, nama')
                    .single();
                if (insErr) throw insErr;
                user = { id: inserted.id, nama: inserted.nama };
            }

            saveLogin(user);
            $('#form-login')[0].reset();
            $status.text('').removeClass('err ok');
            closeLogin();
            showToast(`Selamat datang, ${user.nama || nama}`);
        } catch (err) {
            // fallback: login lokal jika Supabase belum siap/tidak tersedia
            saveLogin({ nama });
            $('#form-login')[0].reset();
            $status.text('').removeClass('err ok');
            closeLogin();
            showToast(`Selamat datang, ${nama} (mode lokal)`);
        } finally {
            $btn.prop('disabled', false).text('Masuk');
        }
    });

    $('#form-masuk').on('submit', handleInboxForm);
    $('#form-tambah-resep').on('submit', handleAddRecipeForm);
    $('#resep-foto').on('change', handleRecipeImageChange);

    let resepTimer, kamusTimer;
    $('#search-resep').on('input', function () {
        clearTimeout(resepTimer);
        const v = this.value;
        resepTimer = setTimeout(() => { state.qResep = v; renderRecipes(); }, 150);
    });

    $('#search-kamus').on('input', function () {
        clearTimeout(kamusTimer);
        const v = this.value;
        kamusTimer = setTimeout(() => { state.qKamus = v; renderKamus(); }, 150);
    });

    $(window).on('hashchange', route);

    loadLogin();
    loadData().always(initApp);
});
