$(function(){
var optionsBarOrder = {
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true,
          display: false,
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }],
      xAxes: [{
        ticks: {
          beginAtZero: true,
          display: false,
        },
        gridLines: {
          display: false,
          drawBorder: false
        }
      }]
    },
    legend: {
      display: false
    },
    elements: {
      point: {
        radius: 0
      }
    },
    tooltips: {
      enabled: false
    }
  };
  
  // API'den veriyi almak için bir istek gönder
  fetch('http://localhost:7269/Personal/TopPersonalLastMonth?month=8&year=2023')  
    .then(response => response.json())
    .then(data => {
      if ($("#orders").length) {
        var barChartCanvas = $("#orders").get(0).getContext("2d");
        var ctx = document.getElementById("orders");
        ctx.height = 60;
  
        // Gelen veriden etiketleri ve değerleri çıkar
        var labels = data.data.map(item => item.name);
        var values = data.data.map(item => item.averageHour);
  
        // Veriyi kullanarak bar grafiği oluştur
        var barChart = new Chart(barChartCanvas, {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [{
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }]
          },
          options: optionsBarOrder
        });
      }
    })
    .catch(error => console.error('API isteği sırasında hata oluştu:', error));
});