$(function(){
    var chart;
    var chart2;
    var selectedUserId;
  
    const dateInput = document.getElementById('date-input-chart2');
  
    createDefaultChart();
   
  
    $("#userDropdown2").on("click", function(event) {
      var target = event.target;
  
      if (target.classList.contains("dropdown-item")) {
        // Tıklanan çalışanı seçili yap
        target.classList.add("active");
  
        // Seçilen çalışanın ID'sini değişkene ata
        selectedUserId = target.getAttribute("data-id");
  
        // Verileri çek ve grafikleri oluştur
        fetchDataAndCreateCharts();
      }
    });
  
    // Submit butonuna tıklama olayını dinle
    $('#submitButton1').click(function() {
      // Seçilen tarih bilgisini al
      var selectedDate = dateInput.value;
      var year = selectedDate.split('-')[0];
      var month = selectedDate.split('-')[1];
  
      // Verileri çek ve grafikleri oluştur
      fetchDataAndCreateCharts(year, month);
    });
  
    // Verileri API'den çek ve grafikleri oluştur
    function fetchDataAndCreateCharts(year, month) {
      if (chart) {
        chart.destroy(); // Eğer birinci grafik varsa, önceki grafikleri yok et
      }
      if (chart2) {
        chart2.destroy(); // Eğer ikinci grafik varsa, önceki grafikleri yok et
      }
  
      // API'den verileri al
      $.ajax({
        url: 'http://localhost:7269/Personal/process-monthly-average',
        method: 'GET',
        data: {
          Id: selectedUserId,
          month: month,
          year: year
        },
        dataType: 'json',
        success: function(response) {
          var data = response.data; // API'den gelen veri
  
          // İlk grafik verileri
          var labels = [];
          var votes = [];
  
          // Verileri döngü ile işle
          data.forEach(function(item) {
            var date2 = new Date(item.date);
            var day = date2.getDate();
            var month = date2.getMonth() + 1;
            var year = date2.getFullYear();
  
            var formattedDate = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);
            labels.push(formattedDate);
  
            var date1 = new Date('1970-01-01T' + item.averageHour);
            var hours = date1.getHours();
            var minutes = date1.getMinutes();
  
            var totalMinutes = hours * 60 + minutes;
            votes.push(totalMinutes);
          });
  
          const chartData = {
            labels: labels,
            datasets: [{
              label: 'Ortalama Çalışma Saati',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              fill: false,
              data: votes.map(Number),
            }]
          };
  
          const config = {
            type: 'bar',
            data: chartData,
            options: {
              scales: {
                y: {
                  min: 0,
                  max: 12.8
                }
              }
            }
          };
  
          chartData.datasets[0].data = chartData.datasets[0].data.map(function(minutes) {
            var hours = Math.floor(minutes / 60);
            var minutesRemainder = minutes % 60;
            var totalHours = hours + minutesRemainder / 60;
            return totalHours.toFixed(1);
          });
  
          var ctx1 = document.getElementById('chartBar1').getContext('2d');
          chart = new Chart(ctx1, config);
  
          // İkinci grafik verileri
          var labels2 = labels; // Tarihleri kullan
          var votes2 = [];
          var averageHours=[]; // Aylık verileri saklamak için bir nesne
  
          data.forEach(function(item) {
            var date2 = new Date(item.date);
            var day = date2.getDate();
            var month = date2.getMonth() + 1;
            var year = date2.getFullYear();
          
            // var formattedDate = year + "-" + ("0" + month).slice(-2) + "-" + ("0" + day).slice(-2);
            // labels2.push(formattedDate); // Tarihleri kullan
          
            // Uzaktan çalışma saatini saniyeden saate çevir
            var remoteHourInSeconds = item.remoteHour;
            var hours = Math.floor(remoteHourInSeconds / 3600); // Saat
            var minutes = Math.floor((remoteHourInSeconds % 3600) / 60); // Dakika
            var seconds = remoteHourInSeconds % 60; // Saniye
            var formattedRemoteHour = hours + minutes / 60 + seconds / 3600;
            formattedRemoteHour = formattedRemoteHour.toFixed(1);
            averageHours.push(formattedRemoteHour); // Ortalama saatleri kullan
          });
          
          // İkinci grafik verilerini hazırlayın
          const chartData2 = {
            labels: labels2, // Tarihleri kullan
            datasets: [{
              label: 'Ortalama Uzaktan Çalışma Saati',
              backgroundColor: 'rgba(255, 99, 132, 0.5)',
              borderColor: 'rgba(255, 99, 132, 1)',
              fill: false,
              data: averageHours.map(Number), // Ortalama saatleri kullan
            }]
          };
  
          const config2 = {
            type: 'bar',
            data: chartData2,
            options: {
              scales: {
                x: {
                  display: true,
                  title: {
                    display: true,
                    text: 'Ay'
                  }
                },
                yAxes: [{
                  ticks: {
                    beginAtZero: true,
                    fontSize: 10,
                    stepSize: 1,
                    max: Math.max.apply(Math, averageHours) + 1
                  },
                  display: true,
                  title: {
                    display: true,
                    text: 'Ortalama Saat'
                  },
                  position: 'bottom',
                }]
              },
              plugins: {
                tooltip: {
                  enabled: false,
                 
                }
              }
            }
          };
  
          var ctx2 = document.getElementById('chartBar2').getContext('2d');
          chart2 = new Chart(ctx2, config2);
        },
        error: function(error) {
          console.log(error);
        }
      });
    }
  
    // Sayfa yüklendiğinde varsayılan verilerle grafikleri oluştur
    //fetchDataAndCreateCharts();
  
    function createDefaultChart() {
      var emptyChartData1 = {
        labels: [],
        datasets: [{
          label: 'Ortalama Çalışma Saati',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false,
          data: [],
        }],
      };
      
      // İkinci grafik için boş veri kümesi
      var emptyChartData2 = {
        labels: [],
        datasets: [{
          label: 'Ortalama Uzaktan Çalışma Saati',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          fill: false,
          data: [],
        }],
      };
      var ctx1 = document.getElementById('chartBar1').getContext('2d');
      chart1 = new Chart(ctx1, {
        type: 'bar',
        data: emptyChartData1,
        options: {
          // Grafik ayarları buraya eklenir
        },
      });
    
      // İkinci grafik oluştur ve boş veri kümesi ile başlat
      var ctx2 = document.getElementById('chartBar2').getContext('2d');
      chart2 = new Chart(ctx2, {
        type: 'bar',
        data: emptyChartData2,
        options: {
          // Grafik ayarları buraya eklenir
        },
      });
    }
  
  });