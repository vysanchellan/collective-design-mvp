// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Form submission handler (MVP functionality)
document.getElementById('inquiryForm').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevents the page from reloading
    
    // In a real app, you would send this data to a backend or service like Formspree
    const name = document.getElementById('name').value;
    
    // Change button text temporarily
    const btn = document.querySelector('.form-submit');
    const originalText = btn.innerText;
    btn.innerText = 'Sending...';
    
    setTimeout(() => {
        alert(`Thank you, ${name}! Your inquiry has been received. We will be in touch shortly.`);
        this.reset(); // Clear the form
        btn.innerText = originalText;
    }, 1000);
});
