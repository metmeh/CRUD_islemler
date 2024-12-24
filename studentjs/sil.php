<?php 
include 'db.php';


if (isset($_GET['no'])) {
    $id = $_GET['no'];
    $delete = "DELETE FROM student WHERE sid= $id";

    if ($conn->query($delete) === true) {
        echo "1";
    } else {
        echo "error";
    }
}
?>