async function fetchAndRenderWatches() {
    try {
        const response = await fetch('/upload');
        const watches = await response.json();

        const watchContainer = document.getElementById('watchContainer');

        watches.forEach(watch => {
            const watchCard = document.createElement('div');
            watchCard.classList.add('watch-card');
            watchCard.innerHTML = `
                <h3>${watch.title}</h3>
                <p>${watch.description}</p>
                <p>Price: $${watch.price}</p>
               
                <button class="delete-button" onclick="deleteWatch('${watch._id}')">Delete</button>
            `;
            watchContainer.appendChild(watchCard);
        });
    } catch (error) {
        console.error('Error fetching watch data:', error);
    }
}

async function deleteWatch(watchId) {
    try {
        const response = await fetch(`/delete/${watchId}`, { // Updated endpoint
            method: 'DELETE',
        });
        const data = await response.json();
        console.log('Watch deleted:', data);
        // Remove the deleted watch card from the UI
        const watchCard = document.querySelector(`.watch-card[data-id="${watchId}"]`);
        if (watchCard) {
            watchCard.remove();
        }
        // Optionally, provide feedback to the user that the watch was deleted
    } catch (error) {
        console.error('Error deleting watch:', error);
        // Optionally, provide feedback to the user about the error
    }
}

fetchAndRenderWatches();
