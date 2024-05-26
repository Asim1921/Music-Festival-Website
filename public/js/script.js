// Animation for form elements
TweenMax.staggerFrom(".form-group", 1, {
    delay: 0.2,
    opacity: 0,
    y: 20,
    ease: Expo.easeInOut
}, 0.2);

TweenMax.staggerFrom(".contact-info-container > *", 1, {
    delay: 0,
    opacity: 0,
    y: 20,
    ease: Expo.easeInOut
}, 0.1);


document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('contact-form');
    const responseMessage = document.getElementById('response-message');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(form);

        // Debug: Log form data to console
        for (let [key, value] of formData.entries()) {
            console.log(key, value);
        }

        fetch('/contact', {
            method: 'POST',
            body: new URLSearchParams(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                responseMessage.innerHTML = '<p class="success-message">Your message has been sent successfully!</p>';
                form.reset();
            } else {
                responseMessage.innerHTML = '<p class="error-message">An error occurred. Please try again.</p>';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            responseMessage.innerHTML = '<p class="error-message">An error occurred. Please try again.</p>';
        });
    });
});


