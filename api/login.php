<?php
require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$data = read_json_body();
$nama = trim($data['nama'] ?? '');

if ($nama === '' || mb_strlen($nama) < 2) {
    json_response(['ok' => false, 'error' => 'Nama wajib diisi (min. 2 karakter)'], 400);
}
if (mb_strlen($nama) > 100) {
    $nama = mb_substr($nama, 0, 100);
}

// Cari pengguna berdasarkan nama
$stmt = $koneksi->prepare('SELECT id, nama FROM users WHERE nama = ? LIMIT 1');
$stmt->bind_param('s', $nama);
$stmt->execute();
$res = $stmt->get_result();
$user = $res->fetch_assoc();
$stmt->close();

if ($user) {
    $upd = $koneksi->prepare('UPDATE users SET last_login = NOW() WHERE id = ?');
    $upd->bind_param('i', $user['id']);
    $upd->execute();
    $upd->close();
} else {
    $ins = $koneksi->prepare('INSERT INTO users (nama, last_login) VALUES (?, NOW())');
    $ins->bind_param('s', $nama);
    if (!$ins->execute()) {
        $ins->close();
        json_response(['ok' => false, 'error' => 'Gagal menyimpan pengguna'], 500);
    }
    $user = ['id' => $ins->insert_id, 'nama' => $nama];
    $ins->close();
}

json_response([
    'ok' => true,
    'user' => [
        'id' => (int)$user['id'],
        'nama' => $user['nama']
    ]
]);
