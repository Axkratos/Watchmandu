async function fetchAndRenderWatches() {
    try {
        const response = await fetch('http://localhost:3000/upload');
        const watches = await response.json();

        const watchContainer = document.getElementById('watchContainer');

        watches.forEach(watch => {
            const watchCard = document.createElement('div');
            watchCard.classList.add('watch-card');
            watchCard.innerHTML = `
            <img src="data:image/jpeg;base64,${watch.photo}" alt="Watches Photo" class="watch-image">
                <h3>${watch.title}</h3>
                <p>${watch.description}</p>
                <p>Price: $${watch.price}</p>
                <button class="buy-button" onclick="redirectToCart()">Buy</button>
            `;
            watchContainer.appendChild(watchCard);
        });
    } catch (error) {
        console.error('Error fetching watch data:', error);
    }
}

function redirectToCart() {
    window.location.href = '../Cart/cart.html';
}


fetchAndRenderWatches();
