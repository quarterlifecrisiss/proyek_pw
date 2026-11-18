let recipes = [];
let kamus = [];
let adab = [];

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

/* ---------- utilitas AJAX ---------- */
function setLoading($el, text) {
    $el.html(`<div class="empty"><b>${escapeHtml(text)}</b></div>`);
}

function ajaxErrorMessage(jqXHR) {
    if (jqXHR && jqXHR.status === 0) return 'Tidak bisa terhubung. Jalankan lewat server lokal (mis. Live Server/XAMPP).';
    if (jqXHR && jqXHR.status) return `Gagal memuat data (HTTP ${jqXHR.status}).`;
    return 'Gagal memuat data.';
}

/* ---------- memuat data via AJAX ---------- */
let dataReady = false;

function getResepData() {
    // Prioritas: ambil dari database (SQL) via API, fallback ke file JSON statis
    return $.ajax({ url: 'api/get_resep.php', method: 'GET', dataType: 'json', timeout: 8000 })
        .then(function (data) {
            const list = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : null);
            if (!list) return $.Deferred().reject().promise();
            return list;
        }, function () {
            return $.getJSON('data/resep.json').then(function (data) {
                return Array.isArray(data) ? data : [];
            });
        });
}

function loadData() {
    dataReady = false;
    $('#adab-list').html('<li><p class="form-hint">Memuat adab makan…</p></li>');
    setLoading($('#recipe-container'), 'Memuat resep…');
    setLoading($('#kamus-container'), 'Memuat kamus bahan…');

    const resepReq = getResepData();
    const kamusReq = $.getJSON('data/kamus.json');
    const adabReq = $.getJSON('data/adab.json');

    return $.when(resepReq, kamusReq, adabReq).done(function (resepData, kamusRes, adabRes) {
        if (Array.isArray(resepData)) {
            recipes = resepData;
        } else if (resepData && Array.isArray(resepData[0])) {
            recipes = resepData[0];
        } else {
            recipes = [];
        }
        kamus = Array.isArray(kamusRes[0]) ? kamusRes[0] : [];
        adab = Array.isArray(adabRes[0]) ? adabRes[0] : [];
        dataReady = true;
    }).fail(function (jqXHR) {
        const msg = ajaxErrorMessage(jqXHR);
        $('#adab-list').html(`<li><p>${escapeHtml(msg)}</p></li>`);
        $('#recipe-container').html(`<div class="empty"><b>${escapeHtml(msg)}</b><br><button type="button" class="link-btn" data-reload="data">Coba muat ulang</button></div>`);
        $('#kamus-container').html(`<div class="empty"><b>${escapeHtml(msg)}</b><br><button type="button" class="link-btn" data-reload="data">Coba muat ulang</button></div>`);
        showToast('Gagal memuat data via AJAX');
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

function handleInboxForm(e) {
    e.preventDefault();
    if (!currentUser) {
        showToast('Silakan masuk terlebih dahulu');
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

    $.ajax({
        url: 'api/kirim_pesan.php',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(payload),
        timeout: 8000
    }).done(function () {
        simpanInboxLokal(payload);
        $('#form-masuk')[0].reset();
        $status.text('Pesan terkirim. Terima kasih atas masukan Anda!').removeClass('err').addClass('ok');
    }).fail(function () {
        // fallback: simpan lokal agar data tetap masuk
        simpanInboxLokal(payload);
        $('#form-masuk')[0].reset();
        $status.text('Pesan disimpan di perangkat ini (server tidak tersedia).').removeClass('err').addClass('ok');
    }).always(function () {
        $btn.prop('disabled', false).text('Kirim Pesan');
        setTimeout(() => { $status.text('').removeClass('ok'); }, 4000);
    });
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

function handleAddRecipeForm(e) {
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

    $btn.prop('disabled', true).text('Mengirim…');
    $status.text('Mengirim resep…').removeClass('ok err');

    $.ajax({
        url: 'api/kirim_resep.php',
        method: 'POST',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify(payload),
        timeout: 8000
    }).done(function () {
        simpanResepLokal(payload);
        $('#form-tambah-resep')[0].reset();
        $('#resep-porsi').val(1);
        $status.text('Resep terkirim. Akan ditinjau sebelum ditampilkan.').removeClass('err').addClass('ok');
    }).fail(function () {
        simpanResepLokal(payload);
        $('#form-tambah-resep')[0].reset();
        $('#resep-porsi').val(1);
        $status.text('Resep disimpan di perangkat ini (server tidak tersedia).').removeClass('err').addClass('ok');
    }).always(function () {
        $btn.prop('disabled', false).text('Kirim Resep');
        setTimeout(() => { $status.text('').removeClass('ok'); }, 5000);
    });
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

    $('#modal-content').html(`
        <button type="button" class="modal-close" data-close aria-label="Tutup">×</button>
        <p class="eyebrow">${r.kategori.toLowerCase()}</p>
        <h2 id="modal-title">${escapeHtml(r.nama)}</h2>
        <p class="modal-lead">${escapeHtml(r.ringkas)}</p>

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

    $('#form-login').on('submit', function (e) {
        e.preventDefault();
        const nama = $.trim($('#login-nama').val());
        const $status = $('#login-status');
        const $btn = $(this).find('button[type="submit"]');
        if (!nama) {
            $status.text('Nama wajib diisi.').removeClass('ok').addClass('err');
            return;
        }

        $btn.prop('disabled', true).text('Memproses…');
        $status.text('Menghubungkan ke server…').removeClass('ok err');

        $.ajax({
            url: 'api/login.php',
            method: 'POST',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify({ nama }),
            timeout: 8000
        }).done(function (res) {
            const user = res && res.user ? res.user : { nama };
            saveLogin(user);
            $('#form-login')[0].reset();
            $status.text('').removeClass('err ok');
            closeLogin();
            showToast(`Selamat datang, ${user.nama || nama}`);
        }).fail(function () {
            // fallback: login lokal jika server/database tidak tersedia
            saveLogin({ nama });
            $('#form-login')[0].reset();
            $status.text('').removeClass('err ok');
            closeLogin();
            showToast(`Selamat datang, ${nama} (mode lokal)`);
        }).always(function () {
            $btn.prop('disabled', false).text('Masuk');
        });
    });

    $('#form-masuk').on('submit', handleInboxForm);
    $('#form-tambah-resep').on('submit', handleAddRecipeForm);

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
