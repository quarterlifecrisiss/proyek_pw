<?php
// Konfigurasi koneksi database (sesuaikan dengan XAMPP/lokal Anda)
$DB_HOST = '127.0.0.1';
$DB_USER = 'root';
$DB_PASS = '';
$DB_NAME = 'thibbun_nabawi';

mysqli_report(MYSQLI_REPORT_OFF);
$koneksi = @new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

if ($koneksi->connect_errno) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'ok' => false,
        'error' => 'Koneksi database gagal',
        'detail' => $koneksi->connect_error
    ]);
    exit;
}

$koneksi->set_charset('utf8mb4');

function json_response($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function read_json_body() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    if (!is_array($data)) $data = $_POST;
    return is_array($data) ? $data : [];
}
