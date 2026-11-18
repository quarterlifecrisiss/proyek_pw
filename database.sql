-- Database untuk proyek Thibbun Nabawi
-- Jalankan di phpMyAdmin / MySQL (XAMPP)

CREATE DATABASE IF NOT EXISTS thibbun_nabawi
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE thibbun_nabawi;

-- Tabel pengguna (login sederhana berbasis nama)
CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL DEFAULT NULL,
  UNIQUE KEY uniq_nama (nama)
) ENGINE=InnoDB;

-- Tabel resep (katalog bawaan + kiriman pengguna)
CREATE TABLE IF NOT EXISTS resep (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) DEFAULT NULL,
  nama VARCHAR(150) NOT NULL,
  kategori VARCHAR(50) NOT NULL,
  waktu_masak VARCHAR(30) DEFAULT NULL,
  porsi INT UNSIGNED NOT NULL DEFAULT 1,
  warna VARCHAR(20) DEFAULT '#3f6b4a',
  inisial VARCHAR(10) DEFAULT '',
  ringkas TEXT,
  nutrisi JSON DEFAULT NULL,
  bahan JSON NOT NULL,
  langkah JSON NOT NULL,
  dalil TEXT,
  sumber VARCHAR(255) DEFAULT NULL,
  user_id INT UNSIGNED DEFAULT NULL,
  disetujui TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_slug (slug),
  KEY idx_kategori (kategori),
  KEY idx_disetujui (disetujui),
  CONSTRAINT fk_resep_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Data awal: resep katalog bawaan
INSERT INTO resep (slug, nama, kategori, waktu_masak, porsi, warna, inisial, ringkas, nutrisi, bahan, langkah, dalil, sumber, disetujui) VALUES
('talbinah', 'Talbinah Susu Madu', 'Sarapan', '25 mnt', 1, '#b08a4f', 'Tb',
 'Bubur barley lembut yang dimasak dengan susu, lalu disiram madu. Hangat dan bikin kenyang lama.',
 JSON_OBJECT('kalori',115,'karbo',20,'protein',3,'lemak',3,'serat',2),
 JSON_ARRAY('2 sdm tepung barley (atau barley utuh yang diblender)','200 ml susu cair','½ batang kayu manis (opsional)','1 sdm madu','1–2 butir kurma, cincang kasar'),
 JSON_ARRAY('Larutkan tepung barley dengan sedikit susu dingin supaya tidak menggumpal.','Panaskan sisa susu bersama kayu manis sampai hampir mendidih.','Masukkan larutan barley, aduk terus dengan api kecil 10–15 menit sampai mengental.','Matikan api, tunggu agak hangat, baru tambahkan madu (jangan saat masih mendidih).','Sajikan dengan taburan kurma cincang.'),
 'Talbinah itu menenangkan hati orang yang sakit dan menghilangkan sebagian kesedihan.',
 'HR. Bukhari, dari Aisyah radhiyallahu ‘anha', 1),

('sup-labu', 'Sup Labu Kuning & Daging', 'Hidangan Utama', '50 mnt', 1, '#c9772b', 'Lb',
 'Labu kuning dimasak bersama potongan daging sapi dan rempah. Kuahnya manis gurih, cocok buat makan malam.',
 JSON_OBJECT('kalori',53,'karbo',2,'protein',5,'lemak',3,'serat',1),
 JSON_ARRAY('75 g daging sapi, potong dadu','100 g labu kuning, potong besar','¼ bawang bombay, iris','1 siung bawang putih, geprek','¼ sdt jintan bubuk','250 ml air','Garam, lada, dan minyak zaitun secukupnya'),
 JSON_ARRAY('Tumis bawang bombay dan bawang putih dengan minyak zaitun sampai harum.','Masukkan daging, aduk sampai berubah warna, lalu taburi jintan.','Tuang air, masak dengan api kecil sekitar 30 menit sampai daging empuk.','Tambahkan labu, masak lagi 10–15 menit sampai labu lunak tapi belum hancur.','Bumbui garam dan lada. Cicipi, sesuaikan.'),
 'Anas bin Malik melihat Rasulullah ﷺ mencari-cari potongan labu di sekeliling piring. Sejak itu Anas selalu menyukai labu.',
 'HR. Bukhari & Muslim', 1),

('timun-kurma', 'Salad Timun & Kurma Segar', 'Pelengkap', '10 mnt', 1, '#5c6b3a', 'Tk',
 'Perpaduan dingin dan manis. Timun yang segar ketemu kurma yang legit — ternyata ini kombinasi yang Nabi ﷺ suka.',
 JSON_OBJECT('kalori',90,'karbo',15,'protein',1,'lemak',3,'serat',2),
 JSON_ARRAY('1 buah timun, iris tipis','3 butir kurma, buang biji dan belah','½ sdm minyak zaitun','½ sdt air jeruk nipis','Sejumput garam dan daun mint secukupnya'),
 JSON_ARRAY('Tata irisan timun di piring saji.','Letakkan kurma di atasnya.','Campur minyak zaitun, air jeruk nipis, dan garam, lalu siramkan.','Beri daun mint dan sajikan dingin.'),
 'Aku melihat Rasulullah ﷺ makan mentimun bersama kurma basah (ruthab).',
 'HR. Bukhari & Muslim, dari Abdullah bin Ja‘far', 1),

('roti-cuka', 'Roti Celup Zaitun & Cuka Apel', 'Sarapan', '5 mnt', 1, '#7a3e1d', 'Rc',
 'Sarapan paling sederhana di buku ini. Roti hangat, cocolan minyak zaitun, cuka apel, dan sedikit za’atar.',
 JSON_OBJECT('kalori',450,'karbo',30,'protein',6,'lemak',35,'serat',4),
 JSON_ARRAY('2 lembar roti pita atau roti gandum','3 sdm minyak zaitun extra virgin','1 sdm cuka apel','½ sdt za’atar atau oregano kering','Sejumput garam laut'),
 JSON_ARRAY('Panggang roti sebentar di teflon sampai hangat dan sedikit renyah.','Tuang minyak zaitun ke piring kecil, teteskan cuka apel di tengahnya.','Taburi za’atar dan garam.','Sobek roti, celupkan, nikmati pelan-pelan.'),
 'Sebaik-baik lauk adalah cuka.',
 'HR. Muslim, dari Jabir bin Abdillah', 1),

('tharid', 'Tharid Kuah Kambing', 'Hidangan Utama', '90 mnt', 1, '#8f3b22', 'Th',
 'Roti yang disobek lalu disiram kuah daging kambing berbumbu. Makanan istimewa yang Nabi ﷺ jadikan perumpamaan.',
 JSON_OBJECT('kalori',100,'karbo',5,'protein',6,'lemak',6,'serat',1),
 JSON_ARRAY('125 g daging kambing, potong','½ buah roti pita / roti maryam, sobek-sobek','½ buah tomat, potong','¼ bawang bombay, cincang','¼ sdt lada hitam, ¼ sdt kapulaga, 1 lembar daun salam','300 ml air','Garam secukupnya'),
 JSON_ARRAY('Rebus kambing sebentar, buang air pertama supaya tidak prengus.','Tumis bawang bombay sampai layu, masukkan daging, tomat, dan rempah.','Tuang air baru, masak dengan api kecil sekitar 1 jam sampai empuk.','Susun sobekan roti di mangkuk lebar.','Siram kuah panas dan daging di atasnya, diamkan 2 menit supaya roti menyerap kuah.'),
 'Keutamaan Aisyah atas wanita lain seperti keutamaan tharid atas makanan lainnya.',
 'HR. Bukhari & Muslim', 1),

('wedang-habbats', 'Wedang Jahe Madu Habbatussauda', 'Minuman', '15 mnt', 1, '#2b2420', 'Wj',
 'Minuman hangat buat malam hujan. Jahe bakar, madu, dan sedikit jintan hitam yang disangrai.',
 JSON_OBJECT('kalori',35,'karbo',9,'protein',0,'lemak',0,'serat',0),
 JSON_ARRAY('½ ruas jahe besar, bakar lalu geprek','½ batang serai, geprek','¼ sdt habbatussauda, sangrai sebentar','1 sdm madu','250 ml air'),
 JSON_ARRAY('Rebus air bersama jahe dan serai sekitar 10 menit.','Masukkan habbatussauda, rebus 2 menit lagi.','Saring ke gelas, biarkan agak hangat.','Aduk madu ke dalamnya, lalu minum selagi hangat.'),
 'Habbatussauda ini adalah obat untuk segala penyakit, kecuali kematian.',
 'HR. Bukhari & Muslim, dari Abu Hurairah', 1);
