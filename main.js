
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});
});

// Form validation and AJAX submission
document.addEventListener('DOMContentLoaded', function() {
const form = document.getElementById('registration-form');
const ageInput = document.getElementById('age');
const ageConsentCheckbox = document.getElementById('age-consent');
const submitBtn = document.getElementById('submit-btn');
const btnText = document.getElementById('btn-text');
const btnLoader = document.getElementById('btn-loader');
const alertMessage = document.getElementById('alert-message');

function showAlert(message, type) {
    alertMessage.textContent = message;
    alertMessage.className = 'alert ' + type + ' show';
    
    // Scroll to alert
    alertMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Hide after 5 seconds
    setTimeout(() => {
        alertMessage.classList.remove('show');
    }, 5000);
}

function validateAge() {
    const age = parseInt(ageInput.value);
    if (isNaN(age) || age < 18) {
        ageInput.style.borderColor = '#ff6b6b';
        ageInput.setCustomValidity('You must be 18 or older to participate.');
        return false;
    } else {
        ageInput.style.borderColor = '#4ecdc4';
        ageInput.setCustomValidity('');
        return true;
    }
}

function validateConsent() {
    return ageConsentCheckbox.checked;
}

ageInput.addEventListener('input', validateAge);
ageConsentCheckbox.addEventListener('change', validateConsent);

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const isAgeValid = validateAge();
    const isConsentValid = validateConsent();
    
    const requiredFields = form.querySelectorAll('input[required]');
    let allFieldsFilled = true;
    requiredFields.forEach(field => {
        if (!field.value.trim() && field.type !== 'checkbox') {
            field.style.borderColor = '#ff6b6b';
            allFieldsFilled = false;
        } else if (field.type !== 'checkbox') {
            field.style.borderColor = '#4ecdc4';
        }
    });

    if (!isAgeValid || !isConsentValid || !allFieldsFilled) {
        showAlert('⚠️ Please fix the errors above and try again. Remember, you must be 18+ and agree to the terms!', 'error');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoader.style.display = 'inline-block';

    // Prepare form data
    const formData = new FormData(form);

    // Send AJAX request to PHP
    fetch('register.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Hide loading state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';

        if (data.success) {
            showAlert('🎉 ' + data.message + ' Your registration ID is #' + data.registration_id, 'success');
            
            // Reset form
            form.reset();
            
            // Reset all field borders
            requiredFields.forEach(field => {
                if (field.type !== 'checkbox') {
                    field.style.borderColor = '#ddd';
                }
            });

            // Optional: Redirect to admin page after 3 seconds
            // setTimeout(() => {
            //     window.location.href = 'view_registrations.php';
            // }, 3000);
        } else {
            showAlert('❌ ' + data.message, 'error');
        }
    })
    .catch(error => {
        // Hide loading state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
        
        console.error('Error:', error);
        showAlert('❌ An error occurred. Please make sure your PHP server is running and try again.', 'error');
    });
});

// Enhanced button hover effect
submitBtn.addEventListener('mouseover', function() {
    if (!this.disabled) {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    }
});

submitBtn.addEventListener('mouseout', function() {
    this.style.transform = 'translateY(0) scale(1)';
});
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
const currentScroll = window.pageYOffset;

if (currentScroll > 100) {
    navbar.style.background = 'rgba(26, 26, 46, 1)';
    navbar.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.5)';
} else {
    navbar.style.background = 'rgba(26, 26, 46, 0.95)';
    navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
}

lastScroll = currentScroll;
});

// Animate elements on scroll
const observerOptions = {
threshold: 0.1,
rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
entries.forEach(entry => {
    if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
    }
});
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
section.style.opacity = '0';
section.style.transform = 'translateY(30px)';
section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
observer.observe(section);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
let start = 0;
const increment = target / (duration / 16);

const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
        element.textContent = target;
        clearInterval(timer);
    } else {
        element.textContent = Math.floor(start);
    }
}, 16);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
        entry.target.classList.add('animated');
        const numbers = entry.target.querySelectorAll('.stat-number');
        numbers.forEach(num => {
            const text = num.textContent;
            const value = parseInt(text.replace(/\D/g, ''));
            if (value && !isNaN(value)) {
                num.textContent = '0';
                setTimeout(() => {
                    animateCounter(num, value);
                }, 200);
            }
        });
    }
});
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
statsObserver.observe(statsSection);
}

// Add ripple effect to buttons
document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(button => {
button.addEventListener('click', function(e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s ease-out';
    ripple.style.pointerEvents = 'none';
    
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
});
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

console.log('✅ Enhanced gaming event website with PHP database integration loaded successfully!');
