document.addEventListener('DOMContentLoaded', function () {
    const userInput = document.getElementById('userInput');
    const submitButton = document.getElementById('submitButton');
    const showMoreButton = document.getElementById('show-more');
    const galleryContainer = document.querySelector('.gallery-container');

    // Function to fetch images from Unsplash API
    async function fetchImages(query) {
        const accessKey = 'BldYgpjlfPAdhsKgicV3GPCxe-UIN_28C6PR7_tZirE'; 
        const apiUrl = `https://api.unsplash.com/photos/random?query=${query}&count=6&client_id=${accessKey}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error fetching images: ${response.status} - ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    }

    // Function to display images in the gallery
    function displayImages(images) {
        galleryContainer.innerHTML = '';

        if (images.length === 0) {
            showNotFoundMessage();
            return;
        }

        images.forEach((image) => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery');

            const imageLink = document.createElement('a');
            imageLink.href = image.links.html;
            imageLink.target = '_blank';

            const imgElement = document.createElement('img');
            imgElement.src = image.urls.regular;
            imgElement.alt = image.alt_description;
            imgElement.width = 600;
            imgElement.height = 400;

            const descElement = document.createElement('div');
            descElement.classList.add('desc');
            descElement.textContent = image.description || 'No description available';

            imageLink.appendChild(imgElement);
            galleryItem.appendChild(imageLink);
            galleryItem.appendChild(descElement);

            galleryContainer.appendChild(galleryItem);
        });
    }

    // Function to show a "not found" message
    function showNotFoundMessage() {
        document.getElementById("notfound").innerHTML = '<p class="not-found">No images found. Please try a different search term.</p>';
        userInput.style.borderColor = 'red';
        galleryContainer.style.display='none';
        showMoreButton.style.display = 'none';
    }

    // Event listener for the submit button
    submitButton.addEventListener('click', async function () {
        const query = userInput.value.trim();

        if (query === '') {
            document.getElementById("notfound").innerHTML = '<p class="not-found">Fill in the blank</p>';
            userInput.style.borderColor = 'red';
            return;
        }
        else {
            // Reset input field border color to default
            document.getElementById("notfound").innerHTML = '<p class="not-found"></p>';
            userInput.style.borderColor = '#ccc';
        }

        try {
            const images = await fetchImages(query);
            displayImages(images);
            showMoreButton.style.display = 'block'; // Show the "Show more" button
        } catch (error) {
            showNotFoundMessage();
        }
    });

    // Event listener for the "Show more" button
    showMoreButton.addEventListener('click', async function () {
        const query = userInput.value.trim();

        if (query === '') {
            alert('Please enter a search query.'); 
            return;
        }

        try {
            const additionalImages = await fetchImages(query);
            displayImages(additionalImages);
        } catch (error) {
            showNotFoundMessage();
        }
    });
});
