document.addEventListener("DOMContentLoaded", () => {
    const stages = document.querySelectorAll('.stage');

    // Add load animation to each stage element
    stages.forEach((stage, index) => {
        stage.style.opacity = 0;
        stage.style.transform = 'translateY(20px)';
        setTimeout(() => {
            stage.style.transition = 'all 0.5s ease';
            stage.style.opacity = 1;
            stage.style.transform = 'translateY(0)';
        }, index * 200); // Stagger the animations
    });

    // Add hover effect for each stage element
    stages.forEach(stage => {
        stage.addEventListener('mouseover', () => {
            stage.style.transform = 'scale(1.05)';
            stage.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        });
        stage.addEventListener('mouseout', () => {
            stage.style.transform = 'scale(1)';
            stage.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
        });
    });

    // Handle search input
    document.getElementById('search').addEventListener('input', function() {
        let query = this.value;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/stage-search?q=${query}`, true);
        xhr.onload = function() {
            if (this.status === 200) {
                document.getElementById('results').innerHTML = this.responseText;
            } else {
                document.getElementById('results').innerHTML = ''; // Clear results if no match
            }
        };
        xhr.send();
    });
});
