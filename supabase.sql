-- Skema Supabase (PostgreSQL) untuk proyek Thibbun Nabawi
-- Jalankan di Supabase Dashboard: SQL Editor -> New query -> Run

-- Tabel pengguna (login sederhana berbasis nama)
create table if not exists public.users (
  id bigint generated always as identity primary key,
  nama text not null unique,
  created_at timestamptz not null default now(),
  last_login timestamptz
);

-- Tabel resep (katalog bawaan + kiriman pengguna)
create table if not exists public.resep (
  id bigint generated always as identity primary key,
  slug text unique,
  nama text not null,
  kategori text not null,
  waktu_masak text,
  porsi integer not null default 1,
  warna text default '#3f6b4a',
  inisial text default '',
  ringkas text,
  nutrisi jsonb,
  bahan jsonb not null default '[]'::jsonb,
  langkah jsonb not null default '[]'::jsonb,
  dalil text,
  sumber text,
  user_id bigint references public.users(id) on delete set null,
  disetujui boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_resep_kategori on public.resep (kategori);
create index if not exists idx_resep_disetujui on public.resep (disetujui);

-- Tabel pesan (kotak masuk/saran)
create table if not exists public.pesan (
  id bigint generated always as identity primary key,
  waktu timestamptz not null default now(),
  user_nama text,
  nama text not null,
  email text,
  pesan text not null
);

-- Data awal: resep katalog bawaan
insert into public.resep (slug, nama, kategori, waktu_masak, porsi, warna, inisial, ringkas, nutrisi, bahan, langkah, dalil, sumber, disetujui) values
('talbinah', 'Talbinah Susu Madu', 'Sarapan', '25 mnt', 1, '#b08a4f', 'Tb',
 'Bubur barley lembut yang dimasak dengan susu, lalu disiram madu. Hangat dan bikin kenyang lama.',
 '{"kalori":115,"karbo":20,"protein":3,"lemak":3,"serat":2}'::jsonb,
 '["2 sdm tepung barley (atau barley utuh yang diblender)","200 ml susu cair","½ batang kayu manis (opsional)","1 sdm madu","1–2 butir kurma, cincang kasar"]'::jsonb,
 '["Larutkan tepung barley dengan sedikit susu dingin supaya tidak menggumpal.","Panaskan sisa susu bersama kayu manis sampai hampir mendidih.","Masukkan larutan barley, aduk terus dengan api kecil 10–15 menit sampai mengental.","Matikan api, tunggu agak hangat, baru tambahkan madu (jangan saat masih mendidih).","Sajikan dengan taburan kurma cincang."]'::jsonb,
 'Talbinah itu menenangkan hati orang yang sakit dan menghilangkan sebagian kesedihan.',
 'HR. Bukhari, dari Aisyah radhiyallahu ‘anha', true),

('sup-labu', 'Sup Labu Kuning & Daging', 'Hidangan Utama', '50 mnt', 1, '#c9772b', 'Lb',
 'Labu kuning dimasak bersama potongan daging sapi dan rempah. Kuahnya manis gurih, cocok buat makan malam.',
 '{"kalori":53,"karbo":2,"protein":5,"lemak":3,"serat":1}'::jsonb,
 '["75 g daging sapi, potong dadu","100 g labu kuning, potong besar","¼ bawang bombay, iris","1 siung bawang putih, geprek","¼ sdt jintan bubuk","250 ml air","Garam, lada, dan minyak zaitun secukupnya"]'::jsonb,
 '["Tumis bawang bombay dan bawang putih dengan minyak zaitun sampai harum.","Masukkan daging, aduk sampai berubah warna, lalu taburi jintan.","Tuang air, masak dengan api kecil sekitar 30 menit sampai daging empuk.","Tambahkan labu, masak lagi 10–15 menit sampai labu lunak tapi belum hancur.","Bumbui garam dan lada. Cicipi, sesuaikan."]'::jsonb,
 'Anas bin Malik melihat Rasulullah ﷺ mencari-cari potongan labu di sekeliling piring. Sejak itu Anas selalu menyukai labu.',
 'HR. Bukhari & Muslim', true),

('timun-kurma', 'Salad Timun & Kurma Segar', 'Pelengkap', '10 mnt', 1, '#5c6b3a', 'Tk',
 'Perpaduan dingin dan manis. Timun yang segar ketemu kurma yang legit — ternyata ini kombinasi yang Nabi ﷺ suka.',
 '{"kalori":90,"karbo":15,"protein":1,"lemak":3,"serat":2}'::jsonb,
 '["1 buah timun, iris tipis","3 butir kurma, buang biji dan belah","½ sdm minyak zaitun","½ sdt air jeruk nipis","Sejumput garam dan daun mint secukupnya"]'::jsonb,
 '["Tata irisan timun di piring saji.","Letakkan kurma di atasnya.","Campur minyak zaitun, air jeruk nipis, dan garam, lalu siramkan.","Beri daun mint dan sajikan dingin."]'::jsonb,
 'Aku melihat Rasulullah ﷺ makan mentimun bersama kurma basah (ruthab).',
 'HR. Bukhari & Muslim, dari Abdullah bin Ja‘far', true),

('roti-cuka', 'Roti Celup Zaitun & Cuka Apel', 'Sarapan', '5 mnt', 1, '#7a3e1d', 'Rc',
 'Sarapan paling sederhana di buku ini. Roti hangat, cocolan minyak zaitun, cuka apel, dan sedikit za’atar.',
 '{"kalori":450,"karbo":30,"protein":6,"lemak":35,"serat":4}'::jsonb,
 '["2 lembar roti pita atau roti gandum","3 sdm minyak zaitun extra virgin","1 sdm cuka apel","½ sdt za’atar atau oregano kering","Sejumput garam laut"]'::jsonb,
 '["Panggang roti sebentar di teflon sampai hangat dan sedikit renyah.","Tuang minyak zaitun ke piring kecil, teteskan cuka apel di tengahnya.","Taburi za’atar dan garam.","Sobek roti, celupkan, nikmati pelan-pelan."]'::jsonb,
 'Sebaik-baik lauk adalah cuka.',
 'HR. Muslim, dari Jabir bin Abdillah', true),

('tharid', 'Tharid Kuah Kambing', 'Hidangan Utama', '90 mnt', 1, '#8f3b22', 'Th',
 'Roti yang disobek lalu disiram kuah daging kambing berbumbu. Makanan istimewa yang Nabi ﷺ jadikan perumpamaan.',
 '{"kalori":100,"karbo":5,"protein":6,"lemak":6,"serat":1}'::jsonb,
 '["125 g daging kambing, potong","½ buah roti pita / roti maryam, sobek-sobek","½ buah tomat, potong","¼ bawang bombay, cincang","¼ sdt lada hitam, ¼ sdt kapulaga, 1 lembar daun salam","300 ml air","Garam secukupnya"]'::jsonb,
 '["Rebus kambing sebentar, buang air pertama supaya tidak prengus.","Tumis bawang bombay sampai layu, masukkan daging, tomat, dan rempah.","Tuang air baru, masak dengan api kecil sekitar 1 jam sampai empuk.","Susun sobekan roti di mangkuk lebar.","Siram kuah panas dan daging di atasnya, diamkan 2 menit supaya roti menyerap kuah."]'::jsonb,
 'Keutamaan Aisyah atas wanita lain seperti keutamaan tharid atas makanan lainnya.',
 'HR. Bukhari & Muslim', true),

('wedang-habbats', 'Wedang Jahe Madu Habbatussauda', 'Minuman', '15 mnt', 1, '#2b2420', 'Wj',
 'Minuman hangat buat malam hujan. Jahe bakar, madu, dan sedikit jintan hitam yang disangrai.',
 '{"kalori":35,"karbo":9,"protein":0,"lemak":0,"serat":0}'::jsonb,
 '["½ ruas jahe besar, bakar lalu geprek","½ batang serai, geprek","¼ sdt habbatussauda, sangrai sebentar","1 sdm madu","250 ml air"]'::jsonb,
 '["Rebus air bersama jahe dan serai sekitar 10 menit.","Masukkan habbatussauda, rebus 2 menit lagi.","Saring ke gelas, biarkan agak hangat.","Aduk madu ke dalamnya, lalu minum selagi hangat."]'::jsonb,
 'Habbatussauda ini adalah obat untuk segala penyakit, kecuali kematian.',
 'HR. Bukhari & Muslim, dari Abu Hurairah', true)
on conflict (slug) do nothing;

-- Row Level Security (RLS) & kebijakan akses sederhana untuk anon key
-- Catatan: kebijakan di bawah ini permisif agar mudah dipakai untuk proyek belajar.
-- Untuk produksi, perketat kebijakan sesuai kebutuhan.

alter table public.users enable row level security;
alter table public.resep enable row level security;
alter table public.pesan enable row level security;

-- users: izinkan baca & tulis (login sederhana tanpa Supabase Auth)
create policy "users_select" on public.users for select using (true);
create policy "users_insert" on public.users for insert with check (true);
create policy "users_update" on public.users for update using (true) with check (true);

-- resep: publik bisa baca resep yang disetujui; kiriman baru disimpan sebagai disetujui=false
create policy "resep_select_disetujui" on public.resep for select using (disetujui = true);
create policy "resep_insert" on public.resep for insert with check (disetujui = false);

-- pesan: izinkan kirim pesan
create policy "pesan_insert" on public.pesan for insert with check (true);
-- (opsional) izinkan baca pesan; hapus jika tidak diperlukan
-- create policy "pesan_select" on public.pesan for select using (true);
