function formatDate(date) {
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    
    var formattedDate = `${day} ${monthNames[month - 1]} ${year} ${hours}:${minutes}`;
    return formattedDate;
  }
  
  // Ay adlarını saklayan bir dizi
  var monthNames = [
    'Ocak',
    'Şubat',
    'Mart',
    'Nisan',
    'Mayıs',
    'Haziran',
    'Temmuz',
    'Ağustos',
    'Eylül',
    'Ekim',
    'Kasım',
    'Aralık'
  ];