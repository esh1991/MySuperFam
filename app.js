document.addEventListener("DOMContentLoaded", function() {
    
    // ======== N8N FORM SUBMISSION LOGIC ========
    // IMPORTANT: Paste your N8N Production Webhook URL here
    const N8N_WEBHOOK_URL = "YOUR_N8N_WEBHOOK_URL_HERE";

    const handleFormSubmit = (formId, messageId) => {
        const form = document.getElementById(formId);
        const messageDiv = document.getElementById(messageId);

        if (!form) return;

        form.addEventListener("submit", async function (e) {
            e.preventDefault();
            
            const formData = new FormData(form);
            const email = formData.get('email');
            
            const data = {
                email: email,
                source: formId
            };

            messageDiv.innerHTML = "Sending...";
            messageDiv.style.color = "#555";
            messageDiv.classList.remove('success', 'error');

            try {
                const response = await fetch(N8N_WEBHOOK_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                
                if (response.ok) {
                    messageDiv.innerHTML = "Success! You're on the list. Welcome, hero!";
                    messageDiv.classList.add('success');
                    form.reset();
                } else {
                    const errorResult = await response.json();
                    console.error("Submission error:", errorResult);
                    messageDiv.innerHTML = "Oops! Something went wrong on our end.";
                    messageDiv.classList.add('error');
                }
            } catch (error) {
                console.error("Fetch error:", error);
                messageDiv.innerHTML = "Oops! A network error occurred. Please try again.";
                messageDiv.classList.add('error');
            }
        });
    };

    handleFormSubmit('waitlist-form-hero', 'form-message-hero');
    handleFormSubmit('waitlist-form-footer', 'form-message-footer');


    // ======== CAROUSEL LOGIC ========
    const carousel = document.querySelector('.story-worlds-carousel');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    if (carousel && prevBtn && nextBtn) {
        const firstCard = carousel.querySelector('.story-world-card');
        const scrollAmount = firstCard.offsetWidth + 30;

        const updateArrowVisibility = () => {
            prevBtn.disabled = carousel.scrollLeft < 10;
            const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
            nextBtn.disabled = carousel.scrollLeft >= maxScrollLeft - 10;
        };

        prevBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        nextBtn.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        carousel.addEventListener('scroll', updateArrowVisibility);
        
        // Also check on window resize
        window.addEventListener('resize', updateArrowVisibility);

        // Initial check when the page loads
        updateArrowVisibility();
    }
});
