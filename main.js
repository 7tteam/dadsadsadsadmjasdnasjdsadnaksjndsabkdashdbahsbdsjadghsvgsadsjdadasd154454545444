// Simple main.js file for NutroCloud
document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer if they exist
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');
    
    if (headerElement) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                if (headerElement) {
                    headerElement.innerHTML = data;
                }
            })
            .catch(error => {
                console.log('Header could not be loaded:', error);
            });
    }
    
    if (footerElement) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.text();
            })
            .then(data => {
                if (footerElement) {
                    footerElement.innerHTML = data;
                }
            })
            .catch(error => {
                console.log('Footer could not be loaded:', error);
            });
    }
    
    console.log('NutroCloud main.js loaded successfully');
});