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