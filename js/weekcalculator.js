
    document.addEventListener("DOMContentLoaded", function() {
        document.getElementById('date-input-chart').addEventListener('change', function() {
            const dateValue = document.getElementById('date-input-chart').value;
            const [year, month] = dateValue.split('-');
    
            const weeks = getTotalWeeksOfMonth(year, month);
    
            console.log(`Yıl: ${year}, Ay: ${month} için ${weeks} hafta var.`);
            
            updateWeekDropdown(weeks);
        });
    
        function getWeekRangesOfMonth(year, month) {
            const weekdays = getWeekdaysOfMonth(year, month);
            const weekRanges = [];
            let startOfWeek = weekdays[0];
    
            for (let i = 1; i <= weekdays.length; i++) {
                const currentDay = weekdays[i] || new Date(year, month, 0);
    
                if (currentDay.getDay() === 5 || i === weekdays.length) {
                    weekRanges.push({ start: startOfWeek, end: currentDay });
                    startOfWeek = weekdays[i + 1];
                }
            }
    
            return weekRanges;
        }
    
        function updateWeekDropdown(weeks) {
            const dropdownMenu = document.getElementById("weekDropdownMenu");
            dropdownMenu.innerHTML = '';
    
            for (let i = 1; i <= weeks; i++) {
                const weekItem = document.createElement("a");
                weekItem.className = "dropdown-item";
                weekItem.href = "#";
                weekItem.textContent = `Hafta ${i}`;
                dropdownMenu.appendChild(weekItem);
            }
        }
    
        function getWeekdaysOfMonth(year, month) {
            const weekdays = [];
            const daysInMonth = new Date(year, month, 0).getDate();
    
            for (let day = 1; day <= daysInMonth; day++) {
                const dayOfWeek = new Date(year, month - 1, day).getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                    weekdays.push(new Date(year, month - 1, day));
                }
            }
    
            return weekdays;
        }
    
        function getTotalWeeksOfMonth(year, month) {
            const weekdays = getWeekdaysOfMonth(year, month);
            let totalWeeks = 0;
            let currentWeekDay = weekdays[0].getDay();
    
            for (let i = 0; i < weekdays.length; i++) {
                if (currentWeekDay === 5 || i === weekdays.length - 1) {
                    totalWeeks++;
                    currentWeekDay = 1;
                } else {
                    currentWeekDay++;
                } 
            }
    
            if (weekdays[weekdays.length - 1].getDay() === 1) {
                totalWeeks++;
            }
    
            return totalWeeks;
        }
    
        document.getElementById("weekDropdownMenu").addEventListener("click", function(event) {
            if (event.target && event.target.matches("a.dropdown-item")) {
                const weekIndex = parseInt(event.target.textContent.split(" ")[1]) - 1;
                const selectedYear = new Date().getFullYear();
                const selectedMonth = new Date().getMonth() + 1;
                const weekRange = getWeekRangesOfMonth(selectedYear, selectedMonth)[weekIndex];
    
                document.getElementById("weekDropdown").textContent = event.target.textContent;
    
                if (weekRange) {
                    document.getElementById("selectedWeekRange").textContent = `${weekRange.start.toISOString().slice(0, 10)} - ${weekRange.end.toISOString().slice(0, 10)}`;
                }
                else{
                    console.error("selectedWeekRange elementi bulunamadı.");
                }
            }
        });
    });
