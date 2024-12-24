<?php
include 'db.php';

if (isset($_GET['sid'], $_GET['ad'], $_GET['soyad'], $_GET['dtarih'], $_GET['dyer'])) {
    $sid = $_GET['sid'];
    $ad = $_GET['ad'];
    $soyad = $_GET['soyad'];
    $dtarih = $_GET['dtarih'];
    $dyer = $_GET['dyer'];

    // Veritabanında güncelleme işlemi (direct query)
    $sql = "UPDATE student SET fname = '$ad', lname = '$soyad', birthdate = '$dtarih', birthpalace = '$dyer' WHERE sid = $sid";

    // Sorguyu çalıştır
    if ($conn->query($sql) === TRUE) {
        echo "1";  // Güncelleme başarılı
    } else {
        echo "error";  // Hata durumunda
    }
}

$conn->close();
?>
