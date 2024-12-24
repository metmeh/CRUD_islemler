<?php 
// Veritabanı bağlantısı
$conn = new mysqli('localhost', 'root', '', 'student');

// Bağlantıyı kontrol et
if ($conn->connect_error) {
    die("Bağlantı başarısız: " . $conn->connect_error);
}
?>