<?php
require_once __DIR__ . '/koneksi.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

$sql = "SELECT id, slug, nama, kategori, waktu_masak, porsi, warna, inisial, ringkas,
               nutrisi, bahan, langkah, dalil, sumber, user_id, disetujui, created_at
        FROM resep
        WHERE disetujui = 1
        ORDER BY (slug IS NULL) ASC, created_at ASC, id ASC";

$result = $koneksi->query($sql);
if (!$result) {
    json_response(['ok' => false, 'error' => 'Gagal mengambil resep'], 500);
}

$resep = [];
while ($row = $result->fetch_assoc()) {
    $nutrisi = json_decode($row['nutrisi'] ?? 'null', true);
    $bahan   = json_decode($row['bahan'] ?? '[]', true);
    $langkah = json_decode($row['langkah'] ?? '[]', true);

    $resep[] = [
        'id'       => $row['slug'] ?: ('db-' . $row['id']),
        'db_id'    => (int)$row['id'],
        'nama'     => $row['nama'],
        'kategori' => $row['kategori'],
        'waktu'    => $row['waktu_masak'] ?: '',
        'porsi'    => (int)$row['porsi'],
        'warna'    => $row['warna'] ?: '#3f6b4a',
        'inisial'  => $row['inisial'] ?: mb_substr($row['nama'], 0, 2),
        'ringkas'  => $row['ringkas'] ?: '',
        'nutrisi'  => is_array($nutrisi) ? $nutrisi : ['kalori'=>0,'karbo'=>0,'protein'=>0,'lemak'=>0,'serat'=>0],
        'bahan'    => is_array($bahan) ? $bahan : [],
        'langkah'  => is_array($langkah) ? $langkah : [],
        'dalil'    => $row['dalil'] ?: '',
        'sumber'   => $row['sumber'] ?: '',
    ];
}

json_response($resep);
