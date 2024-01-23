var itemsPerPage = 20; // Her sayfada gösterilecek veri sayısı
var currentPage = 1; // Şu anki sayfa numarası
var searchInput = document.getElementById("search-input");
var searchButton = document.getElementById("search-button");
var filterInput = document.getElementById("filter-input");
var filterButton = document.getElementById("filter-button");

var allEmployees = []; // Tüm çalışan verilerini tutacak dizi
var filteredEmployees = []; // Filtrelenmiş çalışan verilerini tutacak dizi
var employeesData = [];

var selectedUserId = null;
var userDropdown = document.getElementById("userDropdown1");

userDropdown.addEventListener("click", function(event) {
var target = event.target;

if (target.classList.contains("dropdown-item")) {
// Tıklanan çalışanı seçili yap
target.classList.add("active");

// Seçilen çalışanın ID'sini değişkene atayın
selectedUserId = target.getAttribute("data-id");

// fetchData fonksiyonunu çağırma
fetchData();
}
});

function fetchData() {
// Seçili kullanıcının ID'sini kullanarak API isteği oluşturun
if (selectedUserId) {
var url = "http://localhost:7269/Employee/getbyname?id=" + selectedUserId;

fetch(url, {
method: 'GET',
headers: {
'Content-Type': 'application/json',
'Access-Control-Allow-Origin': '*'
// Diğer başlıkları buraya ekleyebilirsiniz
}
})
.then(response => response.json())
.then(data => {
allEmployees = data.data;
filteredEmployees = allEmployees;
// updateTableHeaders(Object.keys(allEmployees[0]));
renderTable(currentPage, filteredEmployees);
renderPagination(filteredEmployees);
})
.catch(error => {
console.log(error);
});
} else {
console.log("Lütfen bir kullanıcı seçin.");
}
}

function renderTable(page, employees) {
  var tbody = document.querySelector("#employee-table tbody");
  tbody.innerHTML = "";

  var startIndex = (page - 1) * itemsPerPage;
  var endIndex = startIndex + itemsPerPage;

  for (var i = startIndex; i < endIndex && i < employees.length; i++) {
    var employee = employees[i];
    var row = "<tr>";

    for (var key in employee) {
      if(key=='remoteEmployee' && employee[key]==null){
        row += "<td>MetropolCard</td>";
      }
      else{
        row += "<td>" + employee[key] + "</td>";
      }  
      
      
    }

    row += "</tr>";
    tbody.innerHTML += row;
  }
}
var tableHeaders = Array.from(document.querySelectorAll('#table-header-row th')).map(th => th.textContent);

function renderPagination(employees) {
  var totalPages = Math.ceil(employees.length / itemsPerPage);
  var pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  for (var i = 1; i <= totalPages; i++) {
    var link = document.createElement("a");
    link.href = "#";
    link.textContent = i;
    link.classList.add("page-link");
    if (i === currentPage) {
      link.classList.add("active");
    }
    link.addEventListener("click", function (event) {
      event.preventDefault();
      currentPage = parseInt(this.textContent);
      renderTable(currentPage, employees);
      renderPagination(employees);
    });
    pagination.appendChild(link);
  }
}

searchButton.addEventListener("click", function () {
  fetchData();
});

filterButton.addEventListener("click", applyFilter);
filterInput.addEventListener("input", applyFilter);

function applyFilter() {
var keyword = filterInput.value.trim().toLowerCase();
filteredEmployees = allEmployees.filter(function (employee) {
for (var key in employee) {
if (employee[key] && employee[key].toString().toLowerCase().includes(keyword)) {
return true;
}
}
return false;
});
renderTable(currentPage,filteredEmployees);
renderPagination(filteredEmployees);
}


var userDropdown = document.getElementById("userDropdown3");

var overshiftId = null;

document.getElementById('search-button-over').addEventListener('click', function(){
fetchDataOver(overshiftId);
});




userDropdown.addEventListener("click", function(event) {
var target = event.target;

if (target.classList.contains("dropdown-item")) {
// Tıklanan çalışanı seçili yap
target.classList.add("active");

// Seçilen çalışanın ID'sini değişkene atayın
overshiftId = target.getAttribute("data-id");

// fetchData fonksiyonunu çağırmadan önce overshiftId'nin null olmadığını kontrol edin
// if (overshiftId !== null) {
//   fetchDataOver();
// }
}
});

function fetchDataOver() {
var userDropdown = document.getElementById("userDropdown3");
var dateInput = document.getElementById('date-input');

var date = dateInput.value;

var currentDate = new Date();
var selectedDate = new Date(date);

if (selectedDate > currentDate) {
alert('İleri bir tarih girilemez!');
return;
}

var parts = date.split('-');
var month = parts[1];
var year = parts[0];

// fetchData fonksiyonunu çağırmadan önce overshiftId'nin null olmadığını kontrol edin
if (overshiftId !== null) {
var apiUrl = 'http://localhost:7269/OverShift/getovershift';

fetch(apiUrl + '?id=' + encodeURIComponent(overshiftId) + '&month=' + month + '&year=' + year)
.then(response => response.json())
.then(responseData => {
// responseData üzerinden gelen verilere erişim sağlayabilirsiniz
var data = responseData.data;

if (Array.isArray(data)) {
var tableBody = document.querySelector('#overshift-table tbody');
tableBody.innerHTML = '';

data.forEach(item => {
var remoteDate = new Date(item.remoteDate);
var officeDate = new Date(item.officeDate);

// Tarihleri daha okunabilir bir formata dönüştürün (örneğin: "25 Nisan 2023 09:30")
var formattedRemoteDate = formatDate(remoteDate);
var formattedOfficeDate = formatDate(officeDate);

var row = document.createElement('tr');
row.innerHTML = `
<td>${item.name}</td>
<td>${formattedRemoteDate}</td>
<td>${formattedOfficeDate}</td>
<td>${item.shiftHour}</td>
<td>${item.shiftDuration}</td>
<td>${item.shiftCount}</td>
`;
tableBody.appendChild(row);
});
} else {
// API hata mesajını kullanıcıya göster
var errorMessage = 'API request failed: ' + data.title;
alert(errorMessage);
}
})
.catch(error => {
console.log('API request failed:', error);
var errorMessage = 'Aranılan Kişiye dair bir kayıt bulunamadı';
alert(errorMessage);
});
} else {
console.log('Lütfen bir çalışan seçin.');
}
}




var allEmployees = []; // Tüm çalışan verilerini tutacak dizi
var selectedEmployeeId = null; // Seçilen çalışanın ID'si

var searchButton = document.getElementById('search-button-dto');

// Arama butonuna tıklama olayı ekle
searchButton.addEventListener('click', function() {
// Seçilen çalışanın ID'sini almak için seçili öğeyi bulun
var selectedUser = document.querySelector('#userDropdown .dropdown-item.active');

// Eğer seçili bir kullanıcı varsa
if (selectedUser) {
// Kullanıcının ID'sini veri-id özelliğinden alın
var employeeId = selectedUser.getAttribute('data-id');

// onUserSelected fonksiyonunu çağırarak API isteğini yapın
onUserSelected(employeeId);
} else {
alert('Lütfen bir çalışan seçin.');
}
});

// Kullanıcı seçildiğinde çalışacak fonksiyon
function onUserSelected(employeeId) {
// Seçilen kullanıcının ID'sini kullanarak yeni bir API isteği oluşturun
var apiUrl = 'http://localhost:7269/Employee/getdetails?id=' + employeeId;

// API isteğini yapın
fetch(apiUrl)
.then(response => response.json())
.then(responseData => {
// Yanıtı işleyin ve istediğiniz şekilde kullanın
console.log('Employee details:', responseData);

// İşlenmiş veriyi kullanarak tabloyu güncelleyebilirsiniz
updateTableWithEmployeeData(responseData);

})
.catch(error => {
console.error('API request failed:', error);
alert('Çalışan detayları isteği başarısız oldu');
});
}

function updateTableWithEmployeeData(employeeData) {
// İşlenmiş veriyi kullanarak tabloyu güncelleyin
// Örnek olarak, tablonun içeriğini temizlemek ve yeni veriyi eklemek için kullanabilirsiniz.
var tableBody = document.querySelector('#dto-table tbody');
tableBody.innerHTML = '';

employeeData.data.forEach(item => {
var durationInHours = secondsToHours(item.remoteDuration);


var row = document.createElement('tr');
row.innerHTML = `
<td>${item.fullName}</td>
<td>${durationInHours}</td>
<td>${item.workingHour}</td>
<td>${item.officeDate}</td>
<td>${item.remoteDate}</td>
`;

tableBody.appendChild(row);
});
} 

function secondsToHours(seconds) {
// Verilen saniyeyi saat ve dakika olarak çevir
var hours = Math.floor(seconds / 3600);
var minutes = Math.floor((seconds % 3600) / 60);
var seconds = seconds % 60;

// Sonuçları birleştirerek saat olarak formatla
var result = hours.toString().padStart(2, '0') + ':' +
minutes.toString().padStart(2, '0') + ':' +
seconds.toString().padStart(2, '0');

return result;
}





function capitalizeFirstLetter(str) {
return str.charAt(0).toUpperCase() + str.slice(1);
}
// Dropdownları seç
var userDropdowns = document.querySelectorAll(".user-dropdown");

// Her bir dropdown için aynı işlemleri yap
userDropdowns.forEach(userDropdown => {
fetch("http://localhost:7269/Personal/get-all-employees")
.then(response => response.json())
.then(data => {
if (data && Array.isArray(data.data)) { // Data bir dizi mi kontrolü
userDropdown.innerHTML = ""; // "Loading..." öğesini temizle

data.data.forEach(employee => {
var employeeItem = document.createElement("li");
var employeeLink = document.createElement("a");
employeeLink.classList.add("dropdown-item");
employeeLink.href = "#";
employeeLink.textContent = capitalizeFirstLetter(employee.firstName) + " " + capitalizeFirstLetter(employee.lastName);

// Çalışanın ID'sini veri-id özelliğine ekle
employeeLink.setAttribute("data-id", employee.id);

employeeLink.addEventListener("click", function() {
// Tüm çalışanları seçili olmayan duruma getir
var employees = userDropdown.querySelectorAll(".dropdown-item");
employees.forEach(employee => {
employee.classList.remove("active");
});

// Tıklanan çalışanı seçili yap
this.classList.add("active");

// Çalışan ID'sini kullanarak API isteği yapabilirsiniz
var selectedEmployeeId = this.getAttribute("data-id");
// API isteğini burada gerçekleştirin veya başka bir fonksiyon çağırın
});

employeeItem.appendChild(employeeLink);
userDropdown.appendChild(employeeItem);
});
} else {
console.error("Invalid data format:", data);
userDropdown.innerHTML = "<li><a class='dropdown-item' href='#'>Error loading data</a></li>";
}
})
.catch(error => {
console.error("An error occurred:", error);
userDropdown.innerHTML = "<li><a class='dropdown-item' href='#'>Error loading data</a></li>";
});
});

function filterTableDto() {
var filterInputDto = document.getElementById('filter-input-dto'); // Filtre giriş alanı
var filterKeywordDto = filterInputDto.value.trim().toLowerCase(); // Filtre anahtarı

var tableBodyDto = document.querySelector('#dto-table tbody'); // Tablo gövdesini al
var rowsDto = tableBodyDto.getElementsByTagName('tr'); // Tüm tablo satırlarını al

// Tüm satırları dön
for (var i = 0; i < rowsDto.length; i++) {
var rowDto = rowsDto[i];
var columnsDto = rowDto.getElementsByTagName('td'); // Satırın sütunlarını al

var foundDto = false; // Eşleşme bulunup bulunmadığını kontrol etmek için bir bayrak

// Sütunlarda filtre anahtarını ara
for (var j = 0; j < columnsDto.length; j++) {
var columnDto = columnsDto[j];
if (columnDto) {
var cellTextDto = columnDto.textContent || columnDto.innerText;
if (cellTextDto.toLowerCase().indexOf(filterKeywordDto) > -1) {
foundDto = true; // Eşleşme bulundu
break; // Daha fazla sütunu kontrol etmeye gerek yok
}
}
}

// Eşleşme yoksa satırı gizle, varsa göster
if (foundDto) {
rowDto.style.display = ''; // Satırı göster
} else {
rowDto.style.display = 'none'; // Satırı gizle
}
}
}
