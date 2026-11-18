<?php
require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$data = read_json_body();

$nama  = trim($data['nama'] ?? '');
$email = trim($data['email'] ?? '');
$pesan = trim($data['pesan'] ?? '');
$user  = trim($data['user'] ?? $nama);

if ($nama === '' || $pesan === '') {
    json_response(['ok' => false, 'error' => 'Nama dan pesan wajib diisi'], 400);
}

// Simpan ke tabel pesan bila ada; jika tidak, fallback ke file JSON
$koneksi->query(
    "CREATE TABLE IF NOT EXISTS pesan (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        waktu TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        user_nama VARCHAR(100) DEFAULT NULL,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(150) DEFAULT NULL,
        pesan TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
);

$stmt = $koneksi->prepare("INSERT INTO pesan (user_nama, nama, email, pesan) VALUES (?, ?, ?, ?)");
if ($stmt) {
    $stmt->bind_param('ssss', $user, $nama, $email, $pesan);
    if ($stmt->execute()) {
        $stmt->close();
        json_response(['ok' => true, 'message' => 'Pesan diterima']);
    }
    $stmt->close();
}

// Fallback file jika insert gagal
$file = __DIR__ . '/pesan.json';
$list = [];
if (file_exists($file)) {
    $decoded = json_decode(file_get_contents($file), true);
    if (is_array($decoded)) $list = $decoded;
}
array_unshift($list, ['waktu'=>date('c'),'user'=>$user,'nama'=>$nama,'email'=>$email,'pesan'=>$pesan]);
file_put_contents($file, json_encode($list, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

json_response(['ok' => true, 'message' => 'Pesan diterima']);
