document.addEventListener("DOMContentLoaded", () => {
    const artists = document.querySelectorAll('.artist');

    // Add order property to each artist element for staggered animation
    artists.forEach((artist, index) => {
        artist.style.setProperty('--order', index);
    });

    // Add load animation to each artist element
    artists.forEach((artist, index) => {
        setTimeout(() => {
            artist.style.opacity = 1;
            artist.style.transform = 'translateY(0)';
        }, index * 200); // Stagger the animations
    });

    // Add hover effect for each artist element
    artists.forEach(artist => {
        artist.addEventListener('mouseover', () => {
            artist.style.transform = 'scale(1.05)';
            artist.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
        });
        artist.addEventListener('mouseout', () => {
            artist.style.transform = 'scale(1)';
            artist.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });
    });

    // Handle search input
    document.getElementById('search').addEventListener('input', function() {
        let query = this.value;
        let xhr = new XMLHttpRequest();
        xhr.open('GET', `/search?q=${query}`, true);
        xhr.onload = function() {
            if (this.status === 200) {
                document.getElementById('results').innerHTML = this.responseText;
            }
        };
        xhr.send();
    });
});
