<?php
require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$data = read_json_body();

$nama     = trim($data['nama'] ?? '');
$kategori = trim($data['kategori'] ?? '');
$waktu    = trim($data['waktuMasak'] ?? $data['waktu_masak'] ?? '');
$porsi    = max(1, (int)($data['porsi'] ?? 1));
$ringkas  = trim($data['ringkas'] ?? '');
$bahan    = $data['bahan'] ?? [];
$langkah  = $data['langkah'] ?? [];
$dalil    = trim($data['dalil'] ?? '');
$user_id  = isset($data['user_id']) ? (int)$data['user_id'] : null;

if ($nama === '' || $kategori === '' || $ringkas === '' || empty($bahan) || empty($langkah)) {
    json_response(['ok' => false, 'error' => 'Data resep tidak lengkap'], 400);
}

if (!is_array($bahan)) $bahan = [];
if (!is_array($langkah)) $langkah = [];

// Buat slug & inisial sederhana
$inisial = mb_strtoupper(mb_substr($nama, 0, 2));
$nutrisi = json_encode(['kalori'=>0,'karbo'=>0,'protein'=>0,'lemak'=>0,'serat'=>0], JSON_UNESCAPED_UNICODE);
$bahanJson = json_encode(array_values($bahan), JSON_UNESCAPED_UNICODE);
$langkahJson = json_encode(array_values($langkah), JSON_UNESCAPED_UNICODE);
$warna = '#3f6b4a';
$disetujui = 0; // kiriman pengguna perlu ditinjau

if ($user_id && $user_id > 0) {
    $stmt = $koneksi->prepare(
        "INSERT INTO resep (nama, kategori, waktu_masak, porsi, warna, inisial, ringkas, nutrisi, bahan, langkah, dalil, sumber, user_id, disetujui)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?, ?)"
    );
    $stmt->bind_param(
        'sssissssssii',
        $nama, $kategori, $waktu, $porsi, $warna, $inisial, $ringkas,
        $nutrisi, $bahanJson, $langkahJson, $dalil, $user_id, $disetujui
    );
} else {
    $stmt = $koneksi->prepare(
        "INSERT INTO resep (nama, kategori, waktu_masak, porsi, warna, inisial, ringkas, nutrisi, bahan, langkah, dalil, sumber, disetujui)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)"
    );
    $stmt->bind_param(
        'sssissssssi',
        $nama, $kategori, $waktu, $porsi, $warna, $inisial, $ringkas,
        $nutrisi, $bahanJson, $langkahJson, $dalil, $disetujui
    );
}

if (!$stmt->execute()) {
    $err = $stmt->error;
    $stmt->close();
    json_response(['ok' => false, 'error' => 'Gagal menyimpan resep', 'detail' => $err], 500);
}

$id = $stmt->insert_id;
$stmt->close();

json_response(['ok' => true, 'message' => 'Resep diterima', 'id' => $id]);
