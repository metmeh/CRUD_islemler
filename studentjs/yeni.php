<?php
include 'db.php';



// Parametreleri al
$ad = $_GET['ad'];
$soyad = $_GET['soyad'];
$dtarih = $_GET['dtarih'];
$dyer = $_GET['dyer'];

// SQL sorgusu: Öğrenciyi ekle
$sql = "INSERT INTO student (fname, lname, birthpalace, birthdate) VALUES ('$ad', '$soyad', '$dyer', '$dtarih')";

// Sorguyu çalıştır
if ($conn->query($sql) === TRUE) {
    // Yeni eklenen kaydın ID'sini al
    $last_id = $conn->insert_id;
    // Başarı durumunda 'success' mesajı ve 'sid' değerini döndür
    echo $last_id;
} else {
    // Hata durumunda 'error' mesajı döndür
    echo "error";
}

// Bağlantıyı kapat
$conn->close();
?>