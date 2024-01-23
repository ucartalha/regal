
        // Google Charts kütüphanesini yükleme
        google.charts.load('current', {packages: ['corechart']});
        google.charts.setOnLoadCallback(drawEmptyChart);
        // google.charts.setOnLoadCallback(fetchDataAndDraw);


        function drawEmptyChart() {
    const data = google.visualization.arrayToDataTable([
        ['Günler', 'Sayımlar'],
        ['Pazartesi', 5],
        ['Salı', 2],
        ['Çarşamba', 4],
        ['Perşembe', 9],
        ['Cuma', 3]
    ]);

    const options = {
        title: 'Hafta İçi Günlerde ProcessTemp Değerlerine Göre Sayımlar',
        hAxis: {
            title: 'Günler',
        },
        vAxis: {
            title: 'Sayım'
        },
        bars: 'vertical',
        isStacked: true,
        height: 600
    };

    const chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
    chart.draw(data, options);
    
}

        
        function fetchDataAndDraw() {
          const dateValue = document.getElementById('date-input-chart').value;
    const [year, month] = dateValue.split('-'); // Örnek değer: 2023-10

    // Hafta dropdown'ından seçili haftayı al
    const selectedWeekText = document.getElementById('weekDropdown').textContent;
    // "Hafta 2" formatındaki metinden sadece sayıyı al
    const week = parseInt(selectedWeekText.replace('Hafta ', ''), 10);

    console.log(week);
    // document.getElementById('submitButton').addEventListener('click', function() {
    //     fetchDataAndDraw(); // Butona tıklandığında bu fonksiyonu çağır
    // });
            $.ajax({
                url: `http://localhost:7269/Employee/getlates?month=${month}&week=${week}&year=${year}`,
                method: 'GET',
                dataType: 'json',
                success: function(response) {
                  originalData= response.data;
                    const processedData = processData(response.data);
                    drawChart(processedData);
                    console.log(response);
                },
                error:  function(jqXHR, textStatus, errorThrown) {
        if (jqXHR.status == 400) { // 400 HTTP status kodu BadRequest için kullanılır
            alert('Bir hata oluştu: ' + jqXHR.responseText);
        }
                }
            });
        }
        var originalData;
        var tempValues
        
        var daysOfWeek = ["Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma"];
        function processData(apiData) {
          originalData=apiData;
    const data = apiData; // Veriyi doğru yoldan al
    
    const output = [["Gün"]];

    

    for (let i = 0; i < daysOfWeek.length; i++) {
        output.push([daysOfWeek[i]]);
    }

     tempValues = new Set();
    for (const entry of data) {
        tempValues.add(entry.processTemp);
    }
    tempValues = [...tempValues].sort((a, b) => a - b);

    for (const value of tempValues) {
        output[0].push(value.toString());
    }

    const counts = {};
    for (const day of daysOfWeek) {
        counts[day] = {};
        for (const value of tempValues) {
            counts[day][value] = 0;
        }
    }

    for (const entry of data) {
        for (const employee of entry.employees) {
            const day = getDayFromFirstRecord(employee.firstRecord); 
            if (daysOfWeek.includes(day)) {
                counts[day][entry.processTemp]++;
            }
        }
    }

    for (let i = 1; i <= daysOfWeek.length; i++) {
        for (const value of tempValues) {
            output[i].push(counts[daysOfWeek[i - 1]][value]);
        }
    }
    let customTicks = [];
    for (const entry of data) {
        customTicks.push({
            v: entry.processTemp,
            f: entry.message
        });
    }
    
    console.log(output);
    console.log(tempValues);
    return{
      chartData: output,
      ticks: customTicks
    } ;
}

document.addEventListener("DOMContentLoaded", function() {
  document.getElementById('submitButton').addEventListener('click', function() {
    fetchDataAndDraw(); // Butona tıklandığında bu fonksiyonu çağır
});
});
function getDayFromFirstRecord(dateTimeStr) {
    const parts = dateTimeStr.split('T');
    const dateParts = parts[0].split('-');
    const timeParts = parts[1].split(':');
    
    const year = parseInt(dateParts[0], 10);
    const month = parseInt(dateParts[1], 10) - 1;  // JavaScript ayları 0'dan başlatıyor
    const day = parseInt(dateParts[2], 10);
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const second = parseInt(timeParts[2], 10);

    const date = new Date(year, month, day, hour, minute, second);
    const days = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
    return days[date.getDay()];
}

  
        function drawChart(dataObject) {
            var data = google.visualization.arrayToDataTable(dataObject.chartData);
            var series = {};

for(let i = 0; i < dataObject.ticks.length; i++) {
    series[i] = { 
        visibleInLegend: true, 
        labelInLegend: dataObject.ticks[i].f 
    };
}


            var options = {
                title: 'Hafta İçi Günlerde ProcessTemp Değerlerine Göre Sayımlar',
                hAxis: {
                    title: 'Günler',
                    ticks: dataObject.ticks
                },
                vAxis: {
                    title: 'Sayım'
                },
                bars: 'vertical',
                isStacked: true,
                series:series,
                legend: {
        position: 'top', // veya 'bottom', 'top' vb.
        textStyle: {
            color: 'black', // metin rengi
            fontSize: 12
        }
    },
    animation: {
        duration: 1000,
        easing: 'out',
        startup: true
    },
    height:600
            };
            var chart = new google.visualization.ColumnChart(document.getElementById('chart_div'));
            


            google.visualization.events.addListener(chart, 'select', function() {
    var selection = chart.getSelection();
    if (selection.length > 0) {
        var column = selection[0].column - 1; 
        var row = selection[0].row;

        var day = daysOfWeek[row];  // row değerini kullanarak hangi güne tıklanıldığını alıyoruz
        var status = tempValues[column];  

        var selectedLabel = dataObject.ticks[column].f.toUpperCase();

        var filteredEmployees = [];
        originalData.forEach(item => {
            if (item.processTemp === status) {
                item.employees.forEach(employee => {
                    if (getDayFromFirstRecord(employee.firstRecord) === day) {
                        filteredEmployees.push(employee);
                    }
                });
            }
        });
        console.log("Seçilen Gün:", day);
        console.log("Seçilen processTemp:", status);
        console.log("Filtrelenen Çalışanlar:", filteredEmployees);
        console.log("row değeri:", row);
        var tableContent = "";
filteredEmployees.forEach(item => {
    tableContent += "<tr>";
    tableContent += "<td>" + item.fullName.toUpperCase() + "</td>";
    tableContent += "<td>" + item.firstRecord + "</td>";
    tableContent += "<td>" + item.lastRecord + "</td>";
    tableContent += "<td>" + item.workingHour + "</td>";
    tableContent += "</tr>";
});
document.getElementById("tableContent").innerHTML = tableContent;
document.getElementById("infoModalLabel").textContent = selectedLabel;
document.getElementById("infoModalLabel").style.fontWeight = "bold";
if ($.fn.dataTable.isDataTable('#employeesTable')) {
    $('#employeesTable').DataTable().destroy();
}

// Tablo içeriğini güncelleyin
document.getElementById("tableContent").innerHTML = tableContent;

// DataTables'ı tekrar başlatın
$('#employeesTable').DataTable();
        
        $('#infoModal').modal('show');
    }
});




            chart.draw(data, options);
            console.log(dataObject.ticks);
            

            updateRatioInfo(originalData);
            console.log("oroji: " + JSON.stringify(originalData, null, 2));
        }
        function showModalWithInfo(info) {
    // Örnek: basit bir modal pencere gösterme işlemi
    alert(info);
}
console.log("orji data"+originalData)
function updateRatioInfo(originalData) {
    if (!originalData || !originalData.length) return;  // Eğer veri yoksa işlem yapma

    let totalEmployees = 0;
    const counts = {};

    // processTemp değerlerine göre çalışan sayılarını toplama
    originalData.forEach(item => {
    totalEmployees += item.employees.length;
    counts[item.processTemp] = counts[item.processTemp] || { count: 0, message: item.message };
    counts[item.processTemp].count += item.employees.length;
});

    const chartData = [['ProcessTemp', 'Percentage']];

    Object.keys(counts).forEach(processTemp => {
    const ratio = (counts[processTemp].count / totalEmployees) * 100;
    chartData.push([counts[processTemp].message, ratio]);
});


let originalTableData = [];
let isDataTableVisible = false; 

function initDataTable(apiData) {
    let tableData = [];
    apiData.forEach(category => {
        category.employees.forEach(employee => {
            let row = [
                employee.fullName,
                employee.firstRecord,
                employee.lastRecord,
                employee.workingHour,
                employee.isLate ? 'Geç Kaldı' : 'Zamanında Geldi',
                employee.isFullWork ? 'Tam Çalıştı' : 'Tam Çalışmadı'
            ];

            // Geç kalan veya tam çalışmayanları belirleyen sınıflar ekleyelim
            if (employee.isLate || !employee.isFullWork) {
                row.push('highlight-row'); // Örnek sınıf adı 'highlight-row'
            } else {
                row.push(''); // Eğer şart sağlanmıyorsa boş sınıf adı
            }

            tableData.push(row);
        });
    });

    if ($.fn.dataTable.isDataTable('#uniqueDataTable')) {
        $('#uniqueDataTable').DataTable().clear().rows.add(tableData).draw();
    } else {
        $('#uniqueDataTable').DataTable({
            data: tableData,
            columns: [
                { title: "İsim" },
                { title: "İlk Kayıt" },
                { title: "Son Kayıt" },
                { title: "Çalışma Saati" },
                { title: "Geç Kaldı Mı" },
                { title: "Tam Çalıştı Mı" }
            ],
            lengthMenu: [10, 25, 50, 100],
            pageLength: 10,
            createdRow: function(row, data) {
                // 'highlight-row' sınıfına sahip satırları işaretleyelim
                if (data[data.length - 1] === 'highlight-row') {
                    $(row).addClass('highlight-row');
                }
            }
        });
    }
}


document.getElementById('showAllEmployeesBtn').addEventListener('click', function() {
    const tableContainer = document.getElementById('uniqueDataTableContainer');
    console.log("Butona tıklandı!");
    
    if (tableContainer.style.display === 'none' || tableContainer.style.display === '') {
        initDataTable(originalData); // Tabloyu başlat
        tableContainer.style.display = 'block'; // Tabloyu göster
    } else {
        tableContainer.style.display = 'none'; // Tabloyu gizle
    }
});

document.getElementById('closeTableBtn').addEventListener('click', function() {
    const tableContainer = document.getElementById('uniqueDataTableContainer');
    tableContainer.style.display = 'none';
});


    // PieChart'ı çiz
    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChartPie);

    function drawChartPie() {
        const data = google.visualization.arrayToDataTable(chartData);
        const options = {
            title: 'Oranlar',
            titleTextStyle: {
            fontSize: 24,
            bold: true
        },
        subtitle: 'Çalışanların ProcessTemp Dağılımı',
        subtitleTextStyle: {
            fontSize: 14
        },
        animation: {
            duration: 1000,
            startup: true
        },
        
        height: 600,
        colors: ['#3366CC', '#DC3912', '#FF9900', '#109618', '#990099'],  // Özelleştirilmiş renkler
        legend: {
            position: 'right',
            alignment: 'center',
            textStyle: {
                fontSize: 12
            }
        },
        is3D: true  // 3D efektini etkinleştir
    
        };
        const chart = new google.visualization.PieChart(document.getElementById('piechart'));
        chart.draw(data, options);

        
    }
}
function filterDataAndUpdateChart(employeeId) {
        // Original data'dan seçilen çalışanın ID'sine göre veriyi filtreleyin
        const filteredData = originalData.filter(item => {
            // Bu şarta göre filtreleme yapın. Eğer veri yapınız farklıysa, bu şartı güncellemeniz gerekebilir.
            return item.employees.some(employee => employee.id === employeeId);
        });

        // Filtrelenen veri ile grafiği güncelle
        const processedData = processData(filteredData);
        drawChart(processedData);
    }

    document.addEventListener("DOMContentLoaded", function() {
        const customDropdown = document.getElementById("custom-userDropdown");
        const customEmployeeSearch = document.getElementById("custom-employee-search");
        let customOvershiftId = null;
        let customDropdownToggled = false;

        customEmployeeSearch.addEventListener("input", function() {
            // ... [Önceki kodlarınız]
        });

        document.addEventListener("click", function(event) {
            // ... [Önceki kodlarınız]
        });

        const userDropdownLinks = customDropdown.querySelectorAll(".dropdown-item");
        userDropdownLinks.forEach(employeeLink => {
            employeeLink.addEventListener("click", function() {
                userDropdownLinks.forEach(employee => {
                    employee.classList.remove("active");
                });

                this.classList.add("active");
                const employeeId = this.getAttribute("data-id");
                filterDataAndUpdateChart(employeeId);
            });
        });

        document.getElementById('submitButton').addEventListener('click', function() {
            fetchDataAndDraw();
        });
    });
