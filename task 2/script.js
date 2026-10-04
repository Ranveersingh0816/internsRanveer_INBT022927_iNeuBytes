


// DOCTOR DATA


const doctors = [
    {
        name: "Dr. Rajesh Sharma",
        department: "cardiology"
    },
    {
        name: "Dr. Priya Sharma",
        department: "dermatology"
    },
    {
        name: "Dr. Amit Verma",
        department: "neurology"
    }
];



// DOCTOR SEARCH


const doctorSearch = document.getElementById("doctorSearch");
const doctorCards = document.querySelectorAll(".doctor-card");

doctorSearch.addEventListener("input", function () {

    const searchValue = doctorSearch.value.toLowerCase();

    doctorCards.forEach(function (card) {

        const doctorName = card.dataset.name.toLowerCase();

        if (doctorName.includes(searchValue)) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});



// DEPARTMENT FILTER


const departmentFilter = document.getElementById("departmentFilter");

departmentFilter.addEventListener("change", function () {

    const selectedDepartment = departmentFilter.value;

    doctorCards.forEach(function (card) {

        const doctorDepartment = card.dataset.department;

        if (
            selectedDepartment === "all" ||
            doctorDepartment === selectedDepartment
        ) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }

    });

});



// APPOINTMENT FORM


const appointmentForm = document.getElementById("appointemnt");

const patientName = document.getElementById("name");
const email = document.getElementById("email");
const doctorName = document.getElementById("facultyname");
const phone = document.getElementById("number");
const message = document.getElementById("message");

const appointmentDate = document.getElementById("appointmentDate");
const appointmentTime = document.getElementById("appointmentTime");



// BOOK APPOINTMENT BUTTON


const bookButtons = document.querySelectorAll(
    ".doctorrajesh-profile > button"
);

bookButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        const card = button.closest(".doctor-card");

        const selectedDoctor =
            card.dataset.name;

        doctorName.value = selectedDoctor;

        appointmentForm.scrollIntoView({
            behavior: "smooth"
        });

    });

});



// FORM VALIDATION


appointmentForm.addEventListener("submit", function (event) {

    event.preventDefault();

    let isValid = true;


    // Patient name
    if (patientName.value.trim() === "") {

        alert("Please enter patient name");

        patientName.focus();

        isValid = false;

        return;

    }


    // Email
    if (email.value.trim() === "") {

        alert("Please enter your email");

        email.focus();

        isValid = false;

        return;

    }


    // Doctor
    if (doctorName.value.trim() === "") {

        alert("Please select a doctor");

        isValid = false;

        return;

    }


    // Phone
    if (phone.value.trim() === "") {

        alert("Please enter your phone number");

        phone.focus();

        isValid = false;

        return;

    }


    // Phone validation
    if (phone.value.length !== 10) {

        alert("Phone number must contain 10 digits");

        phone.focus();

        isValid = false;

        return;

    }


    // Date
    if (appointmentDate.value === "") {

        alert("Please select appointment date");

        appointmentDate.focus();

        isValid = false;

        return;

    }


    // Time
    if (appointmentTime.value === "") {

        alert("Please select appointment time");

        appointmentTime.focus();

        isValid = false;

        return;

    }


    // Reason
    if (message.value.trim() === "") {

        alert("Please enter reason for appointment");

        message.focus();

        isValid = false;

        return;

    }


    if (isValid) {

        createAppointmentSummary();

        alert("Appointment booked successfully!");

    }

});



// DYNAMIC APPOINTMENT SUMMARY


function createAppointmentSummary() {

    const summaryDoctor =
        document.querySelector(".doctor-details p:nth-of-type(1)");

    const summaryDepartment =
        document.querySelector(".doctor-details p:nth-of-type(2)");

    const summaryPatient =
        document.querySelector(".patient-detail p:nth-of-type(1)");

    const summaryEmail =
        document.querySelector(".patient-detail p:nth-of-type(2)");

    const summaryPhone =
        document.querySelector(".patient-detail p:nth-of-type(3)");

    const summaryDate =
        document.querySelector(".appointment-details p:nth-of-type(1)");

    const summaryTime =
        document.querySelector(".appointment-details p:nth-of-type(2)");

    const summaryReason =
        document.querySelector(".appointment-details p:nth-of-type(3)");


    // Doctor
    summaryDoctor.innerHTML =
        `<strong>Doctor:</strong> ${doctorName.value}`;


    // Department
    let department =
        "Cardiology";

    if (
        doctorName.value.toLowerCase().includes("priya")
    ) {
        department = "Dermatology";
    }

    if (
        doctorName.value.toLowerCase().includes("amit")
    ) {
        department = "Neurology";
    }

    summaryDepartment.innerHTML =
        `<strong>Department:</strong> ${department}`;


    // Patient
    summaryPatient.innerHTML =
        `<strong>Patient Name:</strong> ${patientName.value}`;


    // Email
    summaryEmail.innerHTML =
        `<strong>Email:</strong> ${email.value}`;


    // Phone
    summaryPhone.innerHTML =
        `<strong>Number:</strong> ${phone.value}`;


    // Date
    summaryDate.innerHTML =
        `<strong>Date:</strong> ${appointmentDate.value}`;


    // Time
    summaryTime.innerHTML =
        `<strong>Time:</strong> ${appointmentTime.value}`;


    // Reason
    summaryReason.innerHTML =
        `<strong>Reason:</strong> ${message.value}`;


    // Scroll to summary
    document.querySelector(".appointment-details")
        .scrollIntoView({
            behavior: "smooth"
        });

}