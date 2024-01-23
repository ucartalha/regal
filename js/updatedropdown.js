document.addEventListener("DOMContentLoaded", function() {
    // var userDropdown = document.getElementById("userDropdown3");
    // var employeeSearch = document.getElementById("employee-search");
    // var overshiftId = null;
    // var dropdownToggled = false;
   const dropdowns = [
      { id: "userDropdown1", searchInputId: "employee-search1" },
      { id: "userDropdown3", searchInputId: "employee-search" },
      { id: "userDropdown2", searchInputId: "employee-search-2"},
      // Diğer dropdownlar buraya eklenir
    ];
  
    dropdowns.forEach((dropdownData) => {
      const userDropdown = document.getElementById(dropdownData.id);
      const employeeSearch = document.getElementById(dropdownData.searchInputId);
      let overshiftId = null;
      let dropdownToggled = false;
    function fetchData() {
      // API isteğini burada gerçekleştirin veya başka bir fonksiyon çağırın
    }
  
    function updateDropdown() {
      fetch("http://localhost:7269/Personal/get-all-employees")
        .then(response => response.json())
        .then(data => {
          if (data && Array.isArray(data.data)) {
            userDropdown.innerHTML = "";
            var searchQuery = employeeSearch.value.toLowerCase(); // Arama terimini alın
  
            data.data.forEach(employee => {
              var fullName = capitalizeFirstLetter(employee.firstName) + " " + capitalizeFirstLetter(employee.lastName);
  
              // Arama terimine göre çalışanları filtrele
              if (fullName.toLowerCase().includes(searchQuery)) {
                var employeeItem = document.createElement("li");
                var employeeLink = document.createElement("a");
                employeeLink.classList.add("dropdown-item");
                employeeLink.href = "#";
                employeeLink.textContent = fullName;
                employeeLink.setAttribute("data-id", employee.id);
  
                employeeLink.addEventListener("click", function() {
                  var employees = userDropdown.querySelectorAll(".dropdown-item");
                  employees.forEach(employee => {
                    employee.classList.remove("active");
                  });
  
                  this.classList.add("active");
                  overshiftId = this.getAttribute("data-id");
                  fetchData();
                });
  
                employeeItem.appendChild(employeeLink);
                userDropdown.appendChild(employeeItem);
              }
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
    }
    userDropdown.addEventListener("click", function(event) {
      if (!dropdownToggled) {
        userDropdown.classList.add("show");
        dropdownToggled = true;
      }
      event.stopPropagation(); // Belgeye tıklamayı engelle
    });
  
    // ...
  
    // Document üzerinde tıklanınca dropdownu kapat
    document.addEventListener("click", function(event) {
      if (dropdownToggled && !userDropdown.contains(event.target)) {
        userDropdown.classList.remove("show");
        dropdownToggled = false;
      }
    });
    // Arama kutusuna herhangi bir değişiklik olduğunda dropdown'ı güncelle
    employeeSearch.addEventListener("input", function() {
        // Arama kutusuna yazıldığında dropdown'ı aç
        userDropdown.classList.add("show");
        updateDropdown();
      });
      // document.addEventListener("click", function(event) {
      //   if (!userDropdown.contains(event.target)) {
      //     userDropdown.classList.remove("show");
      //     dropdownToggled = false;
      //   }
      // });
      employeeSearch.addEventListener("input", function() {
    // Arama kutusuna yazıldığında dropdown'ı aç
    if (employeeSearch.value.trim() === "") {
      userDropdown.classList.remove("show");
    } else {
      userDropdown.classList.add("show");
      updateDropdown();
    }
  });
    // İlk başlangıçta dropdown'ı yükle
    updateDropdown();
  });
  });