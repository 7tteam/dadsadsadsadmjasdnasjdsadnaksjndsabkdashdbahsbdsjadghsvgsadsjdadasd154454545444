// Simple main.js file for NutroCloud
document.addEventListener('DOMContentLoaded', function() {
    const headerElement = document.getElementById('header');
    const footerElement = document.getElementById('footer');

    // Load header
    if (headerElement) {
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                headerElement.innerHTML = data;
            })
            .catch(error => console.log('Header could not be loaded:', error));
    }

    // Load footer
    if (footerElement) {
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                footerElement.innerHTML = data;

                // Dynamically load the script that defines setupSidebarEvents
                const script = document.createElement('script');
                script.src = 'setupSidebarEvents.js';
                script.onload = () => {
                    if (typeof setupSidebarEvents === 'function') {
                        setupSidebarEvents();
                    }
                };
                script.onerror = () => {
                    console.warn('setupSidebarEvents.js could not be loaded.');
                };
                document.body.appendChild(script);
            })
            .catch(error => console.log('Footer could not be loaded:', error));
    }

    console.log('NutroCloud main.js loaded successfully');
});
