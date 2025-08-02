// This script handles the form submission using JavaScript to prevent page reload
// and provides feedback to the user.

document.addEventListener("DOMContentLoaded", function() {
    
    // Function to handle form submission
    const handleFormSubmit = (formId, messageId) => {
        const form = document.getElementById(formId);
        const messageDiv = document.getElementById(messageId);

        if (!form) return;

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const object = {};
            formData.forEach((value, key) => {
                object[key] = value;
            });
            const json = JSON.stringify(object);

            messageDiv.innerHTML = "Sending...";
            messageDiv.style.color = "#555";
            messageDiv.classList.remove('success', 'error');

            try {
                const response = await fetch("https://api.web3forms.com/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    body: json,
                });
                
                const result = await response.json();

                if (result.success) {
                    messageDiv.innerHTML = "Success! You're on the list. We'll be in touch!";
                    messageDiv.classList.add('success');
                    form.reset();
                } else {
                    console.error("Submission error:", result);
                    messageDiv.innerHTML = result.message || "Oops! Something went wrong.";
                    messageDiv.classList.add('error');
                }
            } catch (error) {
                console.error("Fetch error:", error);
                messageDiv.innerHTML = "Oops! An error occurred. Please try again.";
                messageDiv.classList.add('error');
            }
        });
    };

    // Initialize both forms
    handleFormSubmit('waitlist-form-hero', 'form-message-hero');
    handleFormSubmit('waitlist-form-footer', 'form-message-footer');
});