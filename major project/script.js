// 1. Book Appointment
const appointmentSection = document.querySelector("#appointments");

appointmentSection.querySelector("button").addEventListener("click", function () {
    const patient = prompt("Enter patient name:");

    if (!patient || patient.trim() === "") {
        alert("Please enter patient name.");
        return;
    }

    const doctor = prompt("Enter doctor name:");

    if (!doctor || doctor.trim() === "") {
        alert("Please enter doctor name.");
        return;
    }

    const date = prompt("Enter appointment date (e.g. 15 Oct 2026):");

    if (!date || date.trim() === "") {
        alert("Please enter appointment date.");
        return;
    }

    const time = prompt("Enter appointment time:");

    if (!time || time.trim() === "") {
        alert("Please enter appointment time.");
        return;
    }

    const table = appointmentSection.querySelector("tbody");
    const row = table.insertRow();

    const values = [
        "A" + Date.now().toString().slice(-5),
        patient.trim(),
        doctor.trim(),
        "General Medicine",
        date.trim(),
        time.trim(),
        "Pending"
    ];

    values.forEach(function (value) {
        const cell = row.insertCell();
        cell.textContent = value;
    });

    const actionCell = row.insertCell();

    ["View", "Edit", "Cancel"].forEach(function (action) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action;
        actionCell.appendChild(button);
    });

    alert("Appointment booked successfully!");
});


// 2. Add Doctor
const doctorSection = document.querySelector("#doctors");

doctorSection.querySelector("button").addEventListener("click", function () {
    const name = prompt("Enter doctor name:");
    if (!name || name.trim() === "") return;

    const specialization = prompt("Enter specialization:");
    if (!specialization || specialization.trim() === "") return;

    const department = prompt("Enter department:");
    if (!department || department.trim() === "") return;

    const table = doctorSection.querySelector("tbody");
    const row = table.insertRow();

    [name, specialization, department, "0 Years", "Available"]
        .forEach(function (value) {
            row.insertCell().textContent = value.trim();
        });

    const actionCell = row.insertCell();

    ["Edit", "Delete"].forEach(function (action) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action;
        actionCell.appendChild(button);
    });

    alert("Doctor added successfully!");
});


// 3. Add Patient
const patientSection = document.querySelector("#patients");

patientSection.querySelector("button").addEventListener("click", function () {
    const name = prompt("Enter patient name:");
    if (!name || name.trim() === "") return;

    const age = prompt("Enter patient age:");

    if (age === null || age.trim() === "" ||
        !Number.isInteger(Number(age)) ||
        Number(age) < 0 || Number(age) > 130) {
        alert("Enter a valid age.");
        return;
    }

    const table = patientSection.querySelector("tbody");
    const row = table.insertRow();

    const values = [
        "P" + Date.now().toString().slice(-5),
        name.trim(),
        age,
        "Not specified",
        "Not specified",
        "Not specified",
        "Not assigned",
        "Active"
    ];

    values.forEach(function (value) {
        row.insertCell().textContent = value;
    });

    const actionCell = row.insertCell();

    ["View", "Edit", "Delete"].forEach(function (action) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action;
        actionCell.appendChild(button);
    });

    alert("Patient added successfully!");
});


// 4. Add Medicine
const medicineSection = document.querySelector("#medicines");

medicineSection.querySelector("button").addEventListener("click", function () {
    const name = prompt("Enter medicine name:");
    if (!name || name.trim() === "") return;

    const quantity = prompt("Enter medicine quantity:");

    if (quantity === null || quantity.trim() === "" ||
        !Number.isInteger(Number(quantity)) || Number(quantity) < 0) {
        alert("Enter a valid quantity.");
        return;
    }

    const table = medicineSection.querySelector("tbody");
    const row = table.insertRow();

    const values = [
        "M" + Date.now().toString().slice(-5),
        name.trim(),
        "Tablet",
        quantity,
        "Not specified",
        "Not specified",
        "Not specified",
        Number(quantity) > 0 ? "Available" : "Out of Stock"
    ];

    values.forEach(function (value) {
        row.insertCell().textContent = value;
    });

    const actionCell = row.insertCell();

    ["Edit", "Delete"].forEach(function (action) {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = action;
        actionCell.appendChild(button);
    });

    alert("Medicine added successfully!");
});


// 5. Handle View, Edit, Delete and Cancel
document.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button) return;

    const action = button.textContent.trim();
    const row = button.closest("tr");

    // Delete or cancel a record
    if (action === "Delete" || action === "Cancel") {
        if (!row) return;

        const confirmed = confirm("Are you sure you want to continue?");

        if (confirmed) {
            if (action === "Cancel" && row.closest("#appointments")) {
                row.cells[6].textContent = "Cancelled";
            } else {
                row.remove();
            }
        }
    }

    // View record details
    if (action === "View" && row) {
        const details = Array.from(row.cells)
            .slice(0, -1)
            .map(function (cell) {
                return cell.textContent;
            })
            .join("\n");

        alert(details);
    }

    // Edit a record
    if (action === "Edit" && row) {
        const cells = Array.from(row.cells);
        const editableCells = cells.slice(0, -1);

        editableCells.forEach(function (cell) {
            const newValue = prompt("Edit value:", cell.textContent);

            if (newValue !== null && newValue.trim() !== "") {
                cell.textContent = newValue.trim();
            }
        });

        alert("Record updated.");
    }
});


// 6. Print Bill
document.addEventListener("click", function (event) {
    if (event.target.textContent.trim() === "Print") {
        window.print();
    }
});


// 7. Create Bill
const billingSection = document.querySelector("#billing");

billingSection.querySelector("button").addEventListener("click", function () {
    alert("Bill creation form will be added in the next step.");
});


// 8. Admin Profile
const profileSection = document.querySelector("#profile");
const profileButtons = profileSection.querySelectorAll("button");

profileButtons[0].addEventListener("click", function () {
    const email = prompt("Enter new email:");

    if (email && email.trim() !== "") {
        profileSection.querySelector("p").textContent =
            "Email: " + email.trim();

        alert("Email updated.");
    }
});

profileButtons[1].addEventListener("click", function () {
    alert("Connect this feature to a secure authentication system.");
});

profileButtons[2].addEventListener("click", function () {
    alert("A login system is required for logout.");
});


// 9. Check JavaScript
console.log("MediCare Dashboard is running!");
