document.addEventListener("DOMContentLoaded", function() {
    
    // IMPORTANT: Paste your N8N Production Webhook URL here
    const N8N_WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL_HERE";

    // Function to handle form submission
    const handleFormSubmit = (formId, messageId) => {
        const form = document.getElementById(formId);
        const messageDiv = document.getElementById(messageId);

        if (!form) return;

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(form);
            const email = formData.get('email');
            
            // Prepare data for N8N
            const data = {
                email: email,
                source: formId // e.g., 'waitlist-form-hero' or 'waitlist-form-footer'
            };

            // Display "Sending..." message to the user
            messageDiv.innerHTML = "Sending...";
            messageDiv.style.color = "#555";
            messageDiv.classList.remove('success', 'error');

            try {
                // Send the data to your N8N webhook
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                
                // Check if the request was successful (HTTP status 200-299)
                if (response.ok) {
                    messageDiv.innerHTML = "Success! You're on the list. Welcome, hero!";
                    messageDiv.classList.add('success');
                    form.reset();
                } else {
                    // Handle server-side errors
                    const errorResult = await response.json();
                    console.error("Submission error:", errorResult);
                    messageDiv.innerHTML = "Oops! Something went wrong on our end.";
                    messageDiv.classList.add('error');
                }
            } catch (error) {
                // Handle network errors (e.g., no internet connection)
                console.error("Fetch error:", error);
                messageDiv.innerHTML = "Oops! A network error occurred. Please try again.";
                messageDiv.classList.add('error');
            }
        });
    };

    // Initialize both forms
    handleFormSubmit('waitlist-form-hero', 'form-message-hero');
    handleFormSubmit('waitlist-form-footer', 'form-message-footer');
});
