let kayit = []; // PHP'den gelen tüm kayıtlar
let guncel = 1;
const sayfa = 5;
let siralamaYon = 1; // 1: Artan, -1: Azalan

// Veriyi yükle
window.onload = function () {
    fetch('getData.php')
        .then((response) => response.json())
        .then((data) => {
            kayit = data;
            renderTable();
            renderPagination();
        });
};

// Sıralama
function sortTable(columnIndex) {
    const collator = new Intl.Collator('tr', { sensitivity: 'base' }); // Türkçe sıralama için

    kayit.sort((a, b) => {
        const keyA = Object.values(a)[columnIndex];
        const keyB = Object.values(b)[columnIndex];

        // Tarih sıralaması
        if (columnIndex === 4) {
            const dateA = new Date(keyA);
            const dateB = new Date(keyB);
            return (dateA - dateB) * siralamaYon;
        }

        // ID sıralaması (sayısal olarak)
        if (columnIndex === 0) {
            return (parseInt(keyA) - parseInt(keyB)) * siralamaYon;
        }

        // Metin sıralaması (Türkçe karakter duyarlı)
        return collator.compare(keyA, keyB) * siralamaYon;
    });

    siralamaYon *= -1; // Sıralama yönünü değiştir
    renderTable();
}


function renderTable() {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    // Şu anki sayfada gösterilecek kayıtları al
    const start = (guncel - 1) * sayfa;
    const end = start + sayfa;
    const pagekayit = kayit.slice(start, end);

    // Tabloya verileri ekle
    pagekayit.forEach((record) => {
        const row = document.createElement('tr');
        row.id = `student-${record.sid}`;
        row.innerHTML = `
    <td>${record.sid}</td>
    <td>${record.fname}</td>
    <td>${record.lname}</td>
    <td>${record.birthpalace}</td>
    <td>${record.birthdate}</td>
    <td><button onclick="sil(${record.sid})">Sil</button></td>
    <td><button onclick="guncelle('${record.sid}')">Güncelle</button></td> `;
        tableBody.appendChild(row);
    });
}
// Sayfalama

function renderPagination() {
    const totalPages = Math.ceil(kayit.length / sayfa);
    const paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    

    // İlk sayfa ve önceki sayfa linkleri
    if (guncel > 1) {
        paginationDiv.innerHTML += `<a href="#" onclick="changePage(1)">İlk Sayfa <<  </a>`;
        paginationDiv.innerHTML += `<a href="#" onclick="changePage(${guncel - 1})"> Önceki <  </a>`;
    }

    // Önceki 3 sayfa
    for (let i = Math.max(1, guncel - 3); i < guncel; i++) {
        paginationDiv.innerHTML += `<a href="" onclick="changePage(${i})">${i} </a>`;
    }

    // Şimdiki sayfa
    paginationDiv.innerHTML += `<span>[${guncel}]</span>`;

    // Sonraki 3 sayfa
    for (let i = guncel + 1; i <= Math.min(totalPages, guncel + 3); i++) {
        paginationDiv.innerHTML += `<a href="#" onclick="changePage(${i})"> ${i}</a>`;
    }

    // Sonraki sayfa ve son sayfa linkleri
    if (guncel < totalPages) {
        paginationDiv.innerHTML += `<a href="#" onclick="changePage(${guncel + 1})">  > Sonraki </a>`;
        paginationDiv.innerHTML += `<a href="#" onclick="changePage(${totalPages})">   >> Son Sayfa </a>`;
    }
}

// Sayfayı değiştir
function changePage(pageNumber) {
    guncel = pageNumber;
    renderTable();
    renderPagination();
}


function ara() {
    const sid = document.getElementById("sidSearch").value;
    const fname = document.getElementById("fnameSearch").value;
    const lname = document.getElementById("lnameSearch").value;
    const birthpalace = document.getElementById("birthpalaceSearch").value;
    const birthdate = document.getElementById("birthdateSearch").value;

    // AJAX isteği gönderiyoruz
    const xhr = new XMLHttpRequest();
    xhr.open("GET", `bul.php?sid=${sid}&fname=${fname}&lname=${lname}&birthpalace=${birthpalace}&birthdate=${birthdate}`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            kayit = response;  // Gelen veriyi kaydediyoruz

            if (kayit.length === 0) {
                alert("Kayıt bulunamadı.");
            } else {
                guncel = 1;  // Arama sonrası ilk sayfayı göster
                renderTable();
                renderPagination();
            }
        } else {
            alert("Veri getirilirken bir hata oluştu.");
        }
    };
    xhr.send();
}


function guncelle(sid) {
    // İlgili satırı bul
    const row = document.getElementById(`student-${sid}`);

    // Satırdaki hücreleri al
    const fname = row.cells[1].innerText;
    const lname = row.cells[2].innerText;
    const birthpalace = row.cells[3].innerText;
    const birthdate = row.cells[4].innerText;

    // Hücreleri input kutucuklarıyla değiştir
    row.cells[1].innerHTML = `<input type="text" id="fname-${sid}" value="${fname}">`;
    row.cells[2].innerHTML = `<input type="text" id="lname-${sid}" value="${lname}">`;
    row.cells[3].innerHTML = `<input type="text" id="birthpalace-${sid}" value="${birthpalace}">`;
    row.cells[4].innerHTML = `<input type="date" id="birthdate-${sid}" value="${birthdate}">`;

    // Güncelle butonunu Kaydet butonuna değiştir
    row.cells[5].innerHTML = '';// Sil butonunu gizle
    row.cells[6].innerHTML = `<button onclick="sakla(${sid})">SAKLA</button>`;
}


function sakla(sid) {
    const fname = document.getElementById(`fname-${sid}`).value;
    const lname = document.getElementById(`lname-${sid}`).value;
    const birthpalace = document.getElementById(`birthpalace-${sid}`).value;
    const birthdate = document.getElementById(`birthdate-${sid}`).value;

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `guncelle.php?sid=${sid}&ad=${fname}&soyad=${lname}&dtarih=${birthdate}&dyer=${birthpalace}`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            if (xhr.responseText.trim() === "1") {
                // Güncelleme başarılı
                const row = document.getElementById(`student-${sid}`);
                row.cells[1].innerHTML = fname;
                row.cells[2].innerHTML = lname;
                row.cells[3].innerHTML = birthpalace;
                row.cells[4].innerHTML = birthdate;

                row.cells[5].innerHTML = `<button onclick="sil(${sid})">Sil</button>`;
                row.cells[6].innerHTML = `<button onclick="guncelle(${sid})">Güncelle</button>`;

                alert("Güncelleme işlemi başarılı.");
            } else {
                alert("Güncelleme işlemi başarısız." + xhr.responseText);
            }
        } else {
            alert("Güncelleme sırasında bir hata oluştu. " + xhr.responseText);
        }
    };

    xhr.onerror = function () {
        alert("AJAX isteği sırasında bir hata oluştu.");
    };

    xhr.send();
}


function yeni() {
    const fname = document.getElementById("fnameInput").value;
    const lname = document.getElementById("lnameInput").value;
    const birthpalace = document.getElementById("birthpalaceInput").value;
    const birthdate = document.getElementById("birthdateInput").value;

    if (fname === "" || lname === "" || birthpalace === "" || birthdate === "") {
        alert("Lütfen tüm alanları doldurun!");
        return;
    }

    $.ajax({
        url: `yeni.php?ad=${fname}&soyad=${lname}&dtarih=${birthdate}&dyer=${birthpalace}`,
        method: "GET", // method belirtmek iyi bir uygulamadır
        dataType: "text", // Beklenen veri tipini belirtin
        success: function(result) {
            if (result !== "error") {
                const newRecord = {
                    sid: result, // result artık sunucudan dönen ID
                    fname: fname,
                    lname: lname,
                    birthpalace: birthpalace,
                    birthdate: birthdate
                };

                kayit.push(newRecord);
                guncel = Math.ceil(kayit.length / sayfa);
                renderTable();
                renderPagination();

                // Formu temizle
                document.getElementById("fnameInput").value = "";
                document.getElementById("lnameInput").value = "";
                document.getElementById("birthpalaceInput").value = "";
                document.getElementById("birthdateInput").value = "";

                alert("Kayıt İşlemi Başarılı.");
            } else {
                alert("Öğrenci eklenirken bir hata oluştu.");
            }
        },
        error: function(jqXHR, textStatus, errorThrown) {
            alert("AJAX hatası: " + textStatus + " - " + errorThrown); // Daha detaylı hata mesajı
        }
    });

    
  /*  const xhr = new XMLHttpRequest();
    xhr.open("GET", `yeni.php?ad=${fname}&soyad=${lname}&dtarih=${birthdate}&dyer=${birthpalace}`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            if (xhr.responseText !== "error") {
                const newRecord = {
                    sid: xhr.responseText,
                    fname: fname,
                    lname: lname,
                    birthpalace: birthpalace,
                    birthdate: birthdate
                };

                kayit.push(newRecord);  // Yeni kaydı kaydediyoruz
                guncel = Math.ceil(kayit.length / sayfa);  // Son sayfaya geçiş
                renderTable();
                renderPagination();

                // Formu temizle
                document.getElementById("fnameInput").value = "";
                document.getElementById("lnameInput").value = "";
                document.getElementById("birthpalaceInput").value = "";
                document.getElementById("birthdateInput").value = "";

                alert("Kayıt İşlemi Başarılı.");
            } else {
                alert("Öğrenci eklenirken bir hata oluştu.");
            }
        }
    };
    xhr.send();
    */
}


function sil(sid) {
    $ajax({
        url:`sil.php?no=${sid}`,
        method:"GET",
        dataType:"text",
        success:function(result){
            if (result === "1") {
                // Silme başarılı ise ilgili satırı DOM'dan siliyoruz
                const row = document.getElementById(`student-${sid}`);
                row.parentNode.removeChild(row);
                kayit = kayit.filter(record => record.sid != sid);
                alert("Silme işlemi başarılı.");
            } else {
                alert("Silme işlemi başarısız.");
            }
        },
    });
   /* const xhr = new XMLHttpRequest();
    xhr.open("GET", `sil.php?no=${sid}`, true);

    xhr.onload = function () {
        if (xhr.status === 200) {
            if (xhr.responseText === "1") {
                // Silme başarılı ise ilgili satırı DOM'dan siliyoruz
                const row = document.getElementById(`student-${sid}`);
                row.parentNode.removeChild(row);
                kayit = kayit.filter(record => record.sid != sid);
                alert("Silme işlemi başarılı.");
            } else {
                alert("Silme işlemi başarısız.");
            }
        }

    };
    xhr.send();*/
}