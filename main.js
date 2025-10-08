// Wait for the DOM to fully load before running the script
document.addEventListener('DOMContentLoaded', function() {
    // Get references to form elements
    const form = document.getElementById('registration-form');
    const ageInput = document.getElementById('age');
    const ageConsentCheckbox = document.getElementById('age-consent');
    const submitButton = form.querySelector('button[type="submit"]');

    // Function to validate age
    function validateAge() {
        const age = parseInt(ageInput.value);
        if (isNaN(age) || age < 18) {
            ageInput.style.borderColor = '#ff6b6b'; // Red border for error
            ageInput.setCustomValidity('You must be 18 or older to participate.');
            return false;
        } else {
            ageInput.style.borderColor = '#4ecdc4'; // Green border for success
            ageInput.setCustomValidity('');
            return true;
        }
    }

    // Function to check if checkbox is selected
    function validateConsent() {
        if (!ageConsentCheckbox.checked) {
            ageConsentCheckbox.style.outline = '2px solid #ff6b6b'; // Red outline for error
            return false;
        } else {
            ageConsentCheckbox.style.outline = 'none';
            return true;
        }
    }

    // Add real-time validation on age input change
    ageInput.addEventListener('input', validateAge);

    // Add real-time validation on checkbox change
    ageConsentCheckbox.addEventListener('change', validateConsent);

    // Handle form submission
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        // Run validations
        const isAgeValid = validateAge();
        const isConsentValid = validateConsent();

        // Check if all fields are filled
        const requiredFields = form.querySelectorAll('input[required]');
        let allFieldsFilled = true;
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = '#ff6b6b';
                allFieldsFilled = false;
            } else {
                field.style.borderColor = '#ddd';
            }
        });

        if (isAgeValid && isConsentValid && allFieldsFilled) {
            // Simulate successful submission
            alert('Registration successful! You\'ll receive a confirmation SMS soon. Get ready to game!');
            
            // Reset form after success
            form.reset();
            
            // Reset styles
            ageInput.style.borderColor = '#ddd';
            ageConsentCheckbox.style.outline = 'none';
        } else {
            alert('Please fix the errors above and try again. Remember, you must be 18+ and agree to the terms!');
        }
    });

    // fun hover effect to the submit button (already styled in CSS, but enhance with JS)
    submitButton.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    });

    submitButton.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});