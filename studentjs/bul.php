<?php
include("db.php");

// Arama parametrelerini al
$sid = isset($_GET['sid']) ? $_GET['sid'] : '';
$fname = isset($_GET['fname']) ? $_GET['fname'] : '';
$lname = isset($_GET['lname']) ? $_GET['lname'] : '';
$birthpalace = isset($_GET['birthpalace']) ? $_GET['birthpalace'] : '';
$birthdate = isset($_GET['birthdate']) ? $_GET['birthdate'] : '';

// SQL sorgusunu oluştur
$query = "SELECT * FROM student WHERE 1=1";

// Parametrelere göre sorguya koşullar ekle
if ($sid != '') {
    $query .= " AND sid = '$sid'";
}
if ($fname != '') {
    $query .= " AND fname LIKE '$fname%'";
}
if ($lname != '') {
    $query .= " AND lname LIKE '$lname%'";
}
if ($birthpalace != '') {
    $query .= " AND birthpalace LIKE '$birthpalace%'";
}
if ($birthdate != '') {
    $query .= " AND birthdate = '$birthdate'";
}

// Sorguyu çalıştır
$result = $conn->query($query);

$students = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $students[] = $row;
    }
}

// JSON olarak döndür
echo json_encode($students);

$conn->close();
?>
