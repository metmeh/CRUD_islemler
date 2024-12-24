<?php
include 'db.php';



$query = "SELECT * FROM student";
$result = $conn->query($query);

$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// JSON olarak döndür
echo json_encode($data);

// Bağlantıyı kapat
$conn->close();
?>
