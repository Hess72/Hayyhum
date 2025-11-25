// ===== Themes =====
function toggleTheme() {
    const body = document.body;
    const button = document.querySelector('.theme-toggle-btn');
    
    const isDarkMode = body.classList.contains('theme-dark');
    
    if (isDarkMode) {
        body.classList.remove('theme-dark');
        localStorage.setItem('theme', 'light');
        if (button) button.textContent = '🌙 Dark Mode';
    } else {
        body.classList.add('theme-dark');
        localStorage.setItem('theme', 'dark');
        if (button) button.textContent = '☀️ Light Mode';
    }
}

function loadSavedTheme() {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('theme-dark');
        const button = document.querySelector('.theme-toggle-btn');
        if (button) button.textContent = '☀️ Light Mode';
    }
}

// ===== Go Back Up Button =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });

        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== Live Clock =====
function initLiveClock() {
    function updateClock() {
        const now = new Date();
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true 
        };
        
        const dateTimeString = now.toLocaleDateString('en-SA', options);
        const clockElement = document.getElementById('liveClock');
        if (clockElement) {
            clockElement.textContent = dateTimeString;
        }
    }

    setInterval(updateClock, 1000);
    updateClock();
}

document.addEventListener('DOMContentLoaded', function() {
    loadSavedTheme();
    initBackToTop();
    initLiveClock();
	initHamburgerNav();
});


// ===== Hamburger Navigation =====
function initHamburgerNav() {
    const nav = document.querySelector('.top-nav');
    if (!nav) return;

    const toggleBtn = nav.querySelector('.nav-toggle');
    const navLinks = nav.querySelector('.nav-links'); // the <ul>

    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', function () {
        const isOpen = navLinks.classList.toggle('open');
        toggleBtn.classList.toggle('open', isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function () {
            navLinks.classList.remove('open');
            toggleBtn.classList.remove('open');
        });
    });
}



// =========== services page  ===================

document.addEventListener("DOMContentLoaded", function () {

    document.querySelectorAll(".card-grid").forEach(grid => {
        shuffleCards(grid);
    });

  
    document.querySelectorAll(".idsortOptions").forEach(select => {
        select.addEventListener("change", function () {
            const section = this.closest(".service-section");
            const grid = section.querySelector(".card-grid");
            sortCards(grid, this.value);
        });
    });

    function shuffleCards(grid) {
        let cards = Array.from(grid.children);
        cards.sort(() => Math.random() - 0.5);
        cards.forEach(card => grid.appendChild(card));
    }


    function sortCards(grid, type) {

        let cards = Array.from(grid.children);

        cards.sort((a, b) => {

            let nameA = a.querySelector("h4").innerText.trim();
            let nameB = b.querySelector("h4").innerText.trim();

            let priceA = parseFloat(a.querySelector(".price").innerText.replace(/[^0-9.]/g, ''));
            let priceB = parseFloat(b.querySelector(".price").innerText.replace(/[^0-9.]/g, ''));

            let hasOfferA = a.querySelector(".offer-tag") ? 1 : 0;
            let hasOfferB = b.querySelector(".offer-tag") ? 1 : 0;

            switch (type) {
                case "A-Z":
                    return nameA.localeCompare(nameB);

                case "Z-A":
                    return nameB.localeCompare(nameA);

                case "low-high":
                    return priceA - priceB;

                case "high-low":
                    return priceB - priceA;

                case "offers":
                    return hasOfferB - hasOfferA;

                default:
                    return 0;
            }
        });

        cards.forEach(card => grid.appendChild(card));
    }

});

// =========== services provider page ===================
document.addEventListener("DOMContentLoaded", function () {

    // =================== ADD SERVICE PAGE ===================
    if (document.querySelector(".form-page-main")) {

        const form = document.querySelector("form");
        const photoInput = document.getElementById("photoUpload");

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            let category = document.getElementById("service-category")?.value;
            let name = document.getElementById("service-name").value.trim();
            let price = document.getElementById("service-price").value.trim();
            let desc = document.getElementById("description").value.trim();
            let city = document.getElementById("service-city").value.trim();
            let photoFile = photoInput.files[0];

            if (!category) {
                alert("Please select a service category.");
                return;
            }

            if (!name || !price || !desc || !city) {
                alert("Please fill ALL fields.");
                form.reportValidity();
                return;
            }

            if (!photoFile) {
                alert("Please upload a service photo.");
                photoInput.reportValidity();
                return;
            }

            if (!isNaN(name.charAt(0))) {
                alert("Service name cannot start with a number.");
                return;
            }

            if (isNaN(price)) {
                alert("Price must be a NUMBER.");
                return;
            }

            if (!isNaN(city)) {
                alert("City name cannot contain numbers.");
                return;
            }

            let reader = new FileReader();
            reader.onload = function () {

                let newService = {
                    category: category,
                    name: name,
                    price: price,
                    desc: desc,
                    city: city,
                    photo: reader.result
                };

                let services = JSON.parse(localStorage.getItem("providerServices")) || [];

                services.push(newService);

                localStorage.setItem("providerServices", JSON.stringify(services));

                alert(`Service "${name}" added successfully!`);

                form.reset();
            };

            reader.readAsDataURL(photoFile);
        });
    }


    // =================== PROVIDER DASHBOARD ===================
    if (document.querySelector(".provider-dashboard-main")) {

        let services = JSON.parse(localStorage.getItem("providerServices")) || [];

        let expContainer   = document.getElementById("expContainer");
        let hotelContainer = document.getElementById("hotelContainer");
        let restContainer  = document.getElementById("restContainer");

        // Add all services
        services.forEach(service => {

            let card = document.createElement("article");
            card.classList.add("card");

            card.innerHTML = `
                <div class="image-wrap">
                    <img class="card-img" src="${service.photo}" alt="Service Photo">
                </div>

                <div class="card-body">
                    <div class="title-row">
                        <h4>${service.name}</h4>
                        <span class="price">${service.price} SAR</span>
                    </div>
                    <p class="desc">${service.desc}</p>

                    <div class="city">
                        <img src="images/location.png" alt="Location Icon" class="location-icon"> ${service.city}
                    </div>
                </div>
            `;

            if (service.category === "experience") {
                expContainer.appendChild(card);
            }
            else if (service.category === "hotel") {
                hotelContainer.appendChild(card);
            }
            else if (service.category === "restaurant") {
                restContainer.appendChild(card);
            }
        });

        
        function showEmptyMessage(container, msg) {
            if ([...container.children].filter(c => c.nodeType === 1).length === 0) {
                container.innerHTML = `<p class="empty-msg">${msg}</p>`;
            }
        }

        showEmptyMessage(expContainer, "No experiences added yet.");
        showEmptyMessage(hotelContainer, "No hotels added yet.");
        showEmptyMessage(restContainer, "No restaurants added yet.");
    }

});


// =========== Manage Staff Member page =============

document.addEventListener("DOMContentLoaded", function () {

    const deleteBtn = document.getElementById("delete-staff-btn");
    const staffForm = document.getElementById("staff-list-form");
    const addForm = document.querySelector(".form-page-main form");

    function createStaffCard(staffObj, index) {
        if (!staffForm) return;

        const wrapper = document.createElement("div");
        wrapper.className = "staff-member";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.name = "staffDynamic" + index;

        const img = document.createElement("img");
        img.src = "images/beige_pfp.jpg"; 
        img.alt = staffObj.firstName + " " + staffObj.lastName;
        img.className = "avatar";

        const infoDiv = document.createElement("div");
        infoDiv.className = "info";

        const nameSpan = document.createElement("span");
        nameSpan.className = "name";
        nameSpan.textContent = staffObj.firstName + " " + staffObj.lastName;

        const posSpan = document.createElement("span");
        posSpan.className = "position";
        
        posSpan.textContent =
            staffObj.expertiseLabel || staffObj.expertise || "Staff Member";

        infoDiv.appendChild(nameSpan);
        infoDiv.appendChild(posSpan);

        wrapper.appendChild(checkbox);
        wrapper.appendChild(img);
        wrapper.appendChild(infoDiv);

        staffForm.appendChild(wrapper);
    }

    function renderStoredStaff() {
        if (!staffForm) return;
        const staffArray = JSON.parse(localStorage.getItem("staffMembers")) || [];
        staffArray.forEach((staff, i) => createStaffCard(staff, i));
    }

    renderStoredStaff();

    if (deleteBtn && staffForm) {
        deleteBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const checked = staffForm.querySelectorAll('input[type="checkbox"]:checked');

            if (checked.length === 0) {
                alert("Please select at least one staff member.");
                return;
            }

            const confirmDel = confirm("Are you sure you want to delete the selected staff members?");
            if (!confirmDel) return;

            checked.forEach(function (box) {
                const memberDiv = box.closest(".staff-member");
                if (memberDiv) memberDiv.remove();
            });
        });
    }

    if (addForm) {
        addForm.addEventListener("submit", function (e) {
            e.preventDefault();

            let first = document.getElementById("firstName").value.trim();
            let last = document.getElementById("lastName").value.trim();
            let dob = document.getElementById("dob").value.trim();
            let email = document.getElementById("email").value.trim();

            const expertiseSelect = document.getElementById("expertise");
            let expertiseValue = expertiseSelect.value;
            let expertiseLabel = expertiseSelect.options[expertiseSelect.selectedIndex].textContent;

            let skills = document.getElementById("skills").value.trim();
            let education = document.getElementById("education").value;
            let photo = document.getElementById("photoUpload").files[0];

            if (!first || !last || !dob || !email || !expertiseValue || !skills || !education) {
                alert("Please fill ALL required fields.");
                return;
            }

            if (!isNaN(first.charAt(0)) || !isNaN(last.charAt(0))) {
                alert("Name cannot start with a number.");
                return;
            }

            if (!email.includes("@") || !email.includes(".")) {
                alert("Please enter a valid email.");
                return;
            }

            if (!photo) {
                alert("Please upload a profile photo.");
                return;
            }

            let staffArray = JSON.parse(localStorage.getItem("staffMembers")) || [];

            let staffObj = {
                firstName: first,
                lastName: last,
                dob: dob,
                email: email,
                expertise: expertiseValue,
                expertiseLabel: expertiseLabel, 
                skills: skills,
                education: education,
                photoName: photo.name
            };

            staffArray.push(staffObj);
            localStorage.setItem("staffMembers", JSON.stringify(staffArray));

            createStaffCard(staffObj, staffArray.length - 1);

            alert(first + " " + last + " has been added successfully!");

            addForm.reset();
        });
    }
});

  
// ======================= MANAGE OFFERS PAGE ==========================
document.addEventListener("DOMContentLoaded", function () {

    
    const deleteOffersBtn = document.getElementById("delete-offers-btn");
    if (deleteOffersBtn) {
        deleteOffersBtn.addEventListener("click", function (e) {
            e.preventDefault();

            const checkedBoxes = document.querySelectorAll(".offer-checkbox:checked");

            if (checkedBoxes.length === 0) {
                alert("Please select at least one offer.");
                return;
            }

            const confirmDelete = confirm("Are you sure you want to delete the selected offers?");
            if (!confirmDelete) return;

            checkedBoxes.forEach(box => {
                const offerCard = box.closest(".offer-card");
                if (offerCard) offerCard.remove();
            });
        });
    }

    const addOfferForm = document.querySelector(".form-page-main form");

    if (addOfferForm) {
        addOfferForm.addEventListener("submit", function (e) {
            e.preventDefault();

            // Inputs
            let title = document.getElementById("offer-title").value.trim();
            let category = document.getElementById("service-category").value;
            let discount = document.getElementById("offer-discount").value.trim();

            // VALIDATION
            if (!title || !category || !discount) {
                alert("Please fill ALL fields.");
                return;
            }

            if (!isNaN(title.charAt(0))) {
                alert("Offer title cannot start with a number.");
                return;
            }

            if (discount < 0 || discount > 100) {
                alert("Discount must be between 0% and 100%.");
                return;
            }

            let oldPrice = 500; 
            let newPrice = Math.floor(oldPrice * (1 - discount / 100));

            let newOffer = {
                title: title,
                category: category,
                discount: discount,
                oldPrice: oldPrice + " SAR",
                newPrice: newPrice + " SAR",
                img: "images/Offer.png" 
            };

            let offers = JSON.parse(localStorage.getItem("offersList")) || [];
            offers.push(newOffer);
            localStorage.setItem("offersList", JSON.stringify(offers));

            addOfferToUI(newOffer);

            alert(title + " offer added successfully!");
            addOfferForm.reset();
        });
    }


    function addOfferToUI(offer) {
        let section;

        if (offer.category === "experience") {
            section = document.querySelectorAll(".offer-list")[0];
        } else if (offer.category === "hotel") {
            section = document.querySelectorAll(".offer-list")[1];
        } else if (offer.category === "restaurant") {
            section = document.querySelectorAll(".offer-list")[2];
        }

        if (!section) return;

        const emptyDiv = section.querySelector(".no-offers");
        if (emptyDiv) emptyDiv.parentElement.remove();
			
		
		

        const card = document.createElement("article");
        card.className = "offer-card";

        card.innerHTML = `
            <div class="offer-check">
                <label class="check-label">
                    <input type="checkbox" class="offer-checkbox">
                    <span class="visually-hidden">Select offer</span>
                </label>
            </div>

            <img src="${offer.img}" class="offer-img">

            <div class="offer-body">
                <h3>${offer.title}</h3>
                <p class="desc">Special discounted offer added by provider.</p>

                <div class="price-row">
                    <span class="old-price">${offer.oldPrice}</span>
                    <span class="new-price">${offer.newPrice}</span>
                </div>
            </div>
        `;

        section.appendChild(card);
    }


    function loadOffersFromStorage() {
        let offers = JSON.parse(localStorage.getItem("offersList")) || [];
        offers.forEach(offer => addOfferToUI(offer));
    }

    loadOffersFromStorage();

});


// =========== customer dashboard page ===================

// =========== 1.request form page ===================

document.addEventListener('DOMContentLoaded', () => {

    var addedRequests = []; 
    var ERROR_COLOR = 'red';
    var NORMAL_COLOR = '#ccc'; 

 
    var requestForm = document.getElementById('requestForm'); 
    if (requestForm) {
        
        var dueDateInput = document.getElementById('due-date');
        if (dueDateInput) {
            var today = new Date().toISOString().split('T')[0];
            dueDateInput.setAttribute('min', today); 
        }
        
        requestForm.addEventListener('submit', function(event) {
            event.preventDefault(); 
            
            var validationResult = validateRequestForm();

            if (validationResult.isValid) {
                
                var serviceName = validationResult.data.serviceName;
                var customerName = validationResult.data.customerName;
                var dueDate = validationResult.data.dueDate;
                var requestDescription = validationResult.data.requestDescription;

                var stayOnPage = confirm(
                    `Request for "${serviceName}" sent successfully.\n` +
                    `Do you want to stay on this page or return to the Customer Dashboard? (OK to Stay / Cancel to Dashboard)`
                );

                if (stayOnPage) {
                    var newRequest = {
                        serviceName: serviceName,
                        customerName: customerName,
                        dueDate: dueDate,
                        requestDescription: requestDescription
                    };
                    addedRequests.push(newRequest); 
                    
                    if (!document.getElementById('requests-display-area')) {
                        createAndInsertDisplayArea();
                    }
                    
                    displayRequests(); 
                    this.reset(); 

                } else {
                    window.location.href = this.action; 
                }
            } else {
                alert(validationResult.message);
            }
        });
        
        function createAndInsertDisplayArea() {
            var formContainerDiv = document.querySelector('.form-container'); 
            if (!formContainerDiv) return;

            var newDiv = document.createElement('div');
            newDiv.id = 'requests-display-area';
            
            newDiv.style.maxWidth = '600px'; 
            newDiv.style.margin = '20px auto'; 
            newDiv.style.padding = '20px';
            newDiv.style.backgroundColor = '#EEEFE0'; 
            newDiv.style.borderRadius = '8px';
            newDiv.style.display = 'none'; 

            newDiv.innerHTML = '<h3>Recently Added Requests</h3><style>.request-display{border:1px solid #4B6043;padding:15px;margin-bottom:10px;border-radius:5px;}</style>'; 
            
            if (formContainerDiv.parentElement) {
                 formContainerDiv.parentElement.insertBefore(newDiv, formContainerDiv);
            }
        }
        
        function displayRequests() {
            var displayArea = document.getElementById('requests-display-area');
            
            if (!displayArea) return; 
            
			displayArea.innerHTML = '<h3>Recently Added Requests</h3><style>#requests-display-area h3{color: #2D392B;}.request-display h4{color: #2D392B;}.request-display{border:1px solid #4B6043;padding:15px;margin-bottom:10px;border-radius:5px;color: #2D392B;}</style>';            
            if (addedRequests.length === 0) {
                displayArea.style.display = 'none';
                return;
            }
            
            displayArea.style.display = 'block';

            addedRequests.forEach(function(req) {
                var requestDiv = document.createElement('div');
                requestDiv.className = 'request-display';
                requestDiv.innerHTML = `
                    <h4>Service: <strong>${req.serviceName}</strong></h4>
                    <p>Customer: <strong>${req.customerName}</strong></p>
                    <p>Due Date: <strong>${req.dueDate}</strong></p>
                    <p>Description: ${req.requestDescription}</p>
                `;
                displayArea.appendChild(requestDiv);
            });
        }
    }

    function validateRequestForm() {
        let isValid = true; 
        let message = '';
        var form = document.getElementById('requestForm');
        
        var setError = function(element, msg) {
            element.style.border = '2px solid ' + ERROR_COLOR;
            element.style.backgroundColor = '#ffe6e6'; 
            message += `- ${msg}\n`;
            isValid = false;
        };
        var clearError = function(element) {
            element.style.border = '';
            element.style.backgroundColor = '';
        };

        var serviceSelect = form.querySelector('#service-select');
        var firstName = form.querySelector('#first-name');
        var lastName = form.querySelector('#last-name');
        var dueDateInput = form.querySelector('#due-date');
        var description = form.querySelector('#request-description');
        
        clearError(serviceSelect);
        if (serviceSelect.value === "") {
            setError(serviceSelect, "Service selection is required.");
        }
        
        var nameRegex = /^[A-Za-z\u0621-\u064A\s]+$/; 
        
        clearError(firstName);
        clearError(lastName);
        
        if (!nameRegex.test(firstName.value.trim())) { 
            setError(firstName, "First Name must be letters/spaces only.");
        }
        if (!nameRegex.test(lastName.value.trim())) {
            setError(lastName, "Last Name must be letters/spaces only.");
        }
        
        var today = new Date();
        var minDueDate = new Date();
        minDueDate.setDate(today.getDate() + 3); 
        minDueDate.setHours(0, 0, 0, 0); 
        var selectedDate = new Date(dueDateInput.value);

        clearError(dueDateInput);
        if (dueDateInput.value === "" || selectedDate < minDueDate) { 
            setError(dueDateInput, "Due Date is too soon. It must be at least 3 days in the future.");
        }

        var MIN_CHARS = 100;
        clearError(description);
        if (description.value.trim().length < MIN_CHARS) {
            setError(description, `Request description must be at least ${MIN_CHARS} characters.`);
        }

        var serviceText = serviceSelect.options[serviceSelect.selectedIndex].text;
        var fullName = firstName.value.trim() + " " + lastName.value.trim();

        return {
            isValid: isValid,
            message: message,
            data: {
                serviceName: serviceText,
                customerName: fullName,
                dueDate: dueDateInput.value,
                requestDescription: description.value.trim()
            }
        };
    }
});

// =========== 2.evaluation form page ===================

document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector(".evaluation-form");
    if (!form) return;

    const serviceSelect = document.getElementById("service-select");
    const ratingInputs = document.querySelectorAll("input[name='rating']");
    const feedback = document.getElementById("feedback");
    const ratingGroup = document.querySelector(".rating-group");

  
    ratingInputs.forEach(radio => {
        radio.addEventListener("change", () => {
            ratingGroup.classList.remove("rating-error");
        });
        radio.addEventListener("mouseenter", () => {
            ratingGroup.classList.remove("rating-error");
        });
    });

    form.addEventListener("submit", function (e) {

        let valid = true;

        // Reset styles
        serviceSelect.classList.remove("input-error");
        feedback.classList.remove("input-error");
        ratingGroup.classList.remove("rating-error");

        if (!serviceSelect.value) {
            serviceSelect.classList.add("input-error");
            valid = false;
        }

        const ratingSelected = [...ratingInputs].some(r => r.checked);
        if (!ratingSelected) {
            ratingGroup.classList.add("rating-error");
            valid = false;
        }

        if (feedback.value.trim() === "") {
            feedback.classList.add("input-error");
            valid = false;
        }

        if (!valid) {
            e.preventDefault();
            return;
        }


        let chosenRating = +[...ratingInputs].find(r => r.checked).value;

        if (chosenRating >= 4) {
            alert("Thank you for your positive review!");
        } else {
            alert("We apologize that your experience was not perfect. We will work to improve!");
        }

    
        window.location.href = "CustomerDashboard.html";

    });

});


// =========== AboutUs page  ===================


document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.join-form');
  const firstNameInput = document.getElementById('first');
  const lastNameInput = document.getElementById('last');
  const dobInput = document.getElementById('dob');
  const photoInput = document.getElementById('photoUpload');

  form.addEventListener('submit', function (e) {
    if (!form.checkValidity()) {
      e.preventDefault();
      form.reportValidity();
      return;
    }

    const startsWithNumber = /^[0-9]/;
    const first = firstNameInput.value.trim();
    const last = lastNameInput.value.trim();

    if (startsWithNumber.test(first) || startsWithNumber.test(last)) {
      e.preventDefault();
      alert('First and last names cannot start with a number.');
      return;
    }

    const enteredDate = new Date(dobInput.value);
    const maxDate = new Date('2008-12-31');
    if (enteredDate > maxDate) {
      e.preventDefault();
      alert('Date of birth must be in 2008 or earlier.');
      return;
    }

    if (photoInput.files.length > 0) {
      const file = photoInput.files[0];
      if (!file.type.startsWith('image/')) {
        e.preventDefault();
        alert('Photo must be an image file.');
        return;
      }
    }

    alert(`Thank you, ${first} ${last}! Your application has been submitted.`);
  });
});
