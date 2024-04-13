// Function to load content dynamically
function loadPage(page) {
    fetch(`/${page}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById('content').innerHTML = data;
            if (page === 'read') {
                fetch('/read')
                    .then(response => response.json())
                    .then(data => displayEmployeeData(data))
                    .catch(error => console.error('Error fetching employee data:', error));
            }
        })
        .catch(error => {
            console.error('Error loading page:', error);
        });
}


// Function to display employee data in a table
function displayEmployeeData(employees) {
    let tableHtml = '<table border="1">';
    tableHtml += '<tr><th>Name</th><th>Employee ID</th><th>Experience</th><th>Designation</th><th>Company</th><th>Salary</th></tr>';
    employees.forEach(employee => {
        tableHtml += `<tr><td>${employee.name}</td><td>${employee.empid}</td><td>${employee.experience}</td><td>${employee.designation}</td><td>${employee.company}</td><td>${employee.salary}</td></tr>`;
    });
    tableHtml += '</table>';
    document.getElementById('content').innerHTML = tableHtml;
}

// Function to submit the create form
function createEmployee() {
    const form = document.getElementById('createForm');
    const formData = new FormData(form);
    fetch('/create', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Display response message
        // Optionally, you can load the read page after successful creation
        loadPage('read');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to submit the update form
function updateEmployee() {
    const form = document.getElementById('updateForm');
    const formData = new FormData(form);
    fetch('/update', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Display response message
        // Optionally, you can load the read page after successful update
        loadPage('read');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to submit the delete form
function deleteEmployee() {
    const form = document.getElementById('deleteForm');
    const formData = new FormData(form);
    fetch('/delete', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        alert(data); // Display response message
        // Optionally, you can load the read page after successful deletion
        loadPage('read');
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

$(document).ready(function() {
    $('.menu-container ul li').click(function() {
        var id = $(this).attr('id');
        $('#' + id + '-detail').slideToggle();
    });
  
    function blinkHeading() {
        $('#blinking-heading').fadeOut(500, function() {
            $(this).fadeIn(500);
        });
    }
  
    $(document).ready(function() {
    $('.menu-item').click(function() {
        var target = $(this).data('target');
        $('#' + target).slideDown();
    });
  });
  
    setInterval(blinkHeading, 1000);
  
    $('#color-selector').change(function() {
        var selectedColor = $(this).val();
        $('body').css('background-color', selectedColor);
    });
  
    $(document).ready(function(){
      $("#flip").click(function(){
        $("#panel").slideDown("slow");
      });
    });
  
   
  
  $(document).ready(function(){
    $("#flip1").click(function(){
     $("#panel1").slideDown("slow");
  });
  });
  
  $(document).ready(function(){
    $("#flip2").click(function(){
     $("#panel2").slideDown("slow");
  });
  });
  
  });
  
  document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const email = formData.get('email');
    const dob = formData.get('dob');

    fetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email, dob }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        // Display profile data
        displayProfile(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function displayProfile(data) {
    const profileContainer = document.getElementById('profile-container');
    const profile = document.getElementById('profile');

    profile.innerHTML = '';
    for (const key in data) {
        if (data.hasOwnProperty(key)) {
            const element = document.createElement('div');
            element.innerHTML = `<strong>${key}:</strong> ${data[key]}`;
            profile.appendChild(element);
        }
    }

    profileContainer.style.display = 'block';
}
