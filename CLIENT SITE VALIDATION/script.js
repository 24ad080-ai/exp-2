// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

// Select Elements
const form = document.getElementById("myForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmInput = document.getElementById("confirmPassword");
const mobileInput = document.getElementById("mobile");

const nameError = document.getElementById("nameError");
const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");
const confirmError = document.getElementById("confirmError");
const mobileError = document.getElementById("mobileError");

const strengthBar = document.getElementById("strengthBar");
const submitBtn = document.getElementById("submitBtn");
const successModal = document.getElementById("successModal");
const closeModalBtn = document.getElementById("closeModalBtn");

// Helper Functions for Validation States
function showError(input, errorElement, message) {
    const group = input.closest(".input-group");
    group.classList.remove("success");
    group.classList.add("error");
    errorElement.textContent = message;
}

function showSuccess(input, errorElement) {
    const group = input.closest(".input-group");
    group.classList.remove("error");
    group.classList.add("success");
    errorElement.textContent = "";
}

function clearState(input, errorElement) {
    const group = input.closest(".input-group");
    group.classList.remove("error", "success");
    errorElement.textContent = "";
}

// ----------------------------------------------------
// Validation Logic
// ----------------------------------------------------

function validateName() {
    const value = nameInput.value.trim();
    if (value === "") {
        showError(nameInput, nameError, "Full Name is required");
        return false;
    }
    if (value.length < 2) {
        showError(nameInput, nameError, "Name must be at least 2 characters");
        return false;
    }
    const nameRegex = /^[a-zA-Z\s]+$/;
    if (!nameRegex.test(value)) {
        showError(nameInput, nameError, "Name can only contain letters");
        return false;
    }
    showSuccess(nameInput, nameError);
    return true;
}

function validateEmail() {
    const value = emailInput.value.trim();
    if (value === "") {
        showError(emailInput, emailError, "Email is required");
        return false;
    }
    // Standard robust email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
        showError(emailInput, emailError, "Please enter a valid email address");
        return false;
    }
    showSuccess(emailInput, emailError);
    return true;
}

function checkPasswordStrength(value) {
    strengthBar.className = "password-strength-bar"; // Reset
    
    if (value.length === 0) return;

    let score = 0;
    if (value.length >= 6) score++;
    if (/[A-Z]/.test(value) || /[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value) && value.length >= 8) score++;

    if (score === 1) {
        strengthBar.classList.add("weak");
    } else if (score === 2) {
        strengthBar.classList.add("medium");
    } else if (score === 3) {
        strengthBar.classList.add("strong");
    }
}

function validatePassword() {
    const value = passwordInput.value;
    checkPasswordStrength(value);

    if (value === "") {
        showError(passwordInput, passwordError, "Password is required");
        return false;
    }
    if (value.length < 6) {
        showError(passwordInput, passwordError, "Minimum 6 characters required");
        return false;
    }
    showSuccess(passwordInput, passwordError);
    return true;
}

function validateConfirmPassword() {
    const pValue = passwordInput.value;
    const cValue = confirmInput.value;

    if (cValue === "") {
        showError(confirmInput, confirmError, "Please confirm your password");
        return false;
    }
    if (cValue !== pValue) {
        showError(confirmInput, confirmError, "Passwords do not match");
        return false;
    }
    showSuccess(confirmInput, confirmError);
    return true;
}

function validateMobile() {
    const value = mobileInput.value.trim();
    if (value === "") {
        showError(mobileInput, mobileError, "Mobile number is required");
        return false;
    }
    // Match exactly 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(value)) {
        showError(mobileInput, mobileError, "Enter a valid 10-digit mobile number");
        return false;
    }
    showSuccess(mobileInput, mobileError);
    return true;
}

// ----------------------------------------------------
// Event Listeners for Live Feedback
// ----------------------------------------------------

nameInput.addEventListener("input", validateName);
emailInput.addEventListener("input", validateEmail);
passwordInput.addEventListener("input", () => {
    validatePassword();
    if (confirmInput.value !== "") {
        validateConfirmPassword();
    }
});
confirmInput.addEventListener("input", validateConfirmPassword);
mobileInput.addEventListener("input", function() {
    // Prevent typing non-digits in mobile field
    this.value = this.value.replace(/\D/g, "");
    validateMobile();
});

// Clear errors on field focus to feel less intrusive
[nameInput, emailInput, passwordInput, confirmInput, mobileInput].forEach(input => {
    input.addEventListener("focus", function() {
        const errorElement = document.getElementById(`${this.id}Error`) || document.getElementById("confirmError");
        if (this.closest(".input-group").classList.contains("error")) {
            // keep the error but dim it, or let it stay until they start typing
        }
    });
});

// ----------------------------------------------------
// Form Submission & Success Modal Flow
// ----------------------------------------------------

form.onsubmit = function(event) {
    event.preventDefault();

    // Trigger validation for all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isConfirmValid = validateConfirmPassword();
    const isMobileValid = validateMobile();

    const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmValid && isMobileValid;

    if (isFormValid) {
        // Show premium submitting state loader
        submitBtn.classList.add("loading");

        // Simulate secure validation/creation process
        setTimeout(() => {
            submitBtn.classList.remove("loading");
            
            // Show Success Modal
            successModal.classList.add("active");
            
            // Reset Form Fields and states
            form.reset();
            strengthBar.className = "password-strength-bar";
            document.querySelectorAll(".input-group").forEach(group => {
                group.classList.remove("success", "error");
            });
        }, 1500);
    } else {
        // Scroll to the first error element smoothly
        const firstError = document.querySelector(".input-group.error");
        if (firstError) {
            firstError.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }
};

// Close Modal Event Listener
closeModalBtn.addEventListener("click", () => {
    successModal.classList.remove("active");
});