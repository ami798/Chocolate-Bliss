// Cake data with proper images
const cakes = [
  {
    id: 1,
    name: "Chocolate Dream",
    description: "Rich and moist chocolate cake layered with ganache.",
    price: 24.99,
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop",
    category: "chocolate",
    tags: ["chocolate", "ganache", "rich"]
  },
  {
    id: 2,
    name: "Strawberry Delight",
    description: "Light sponge cake topped with fresh strawberries and cream.",
    price: 22.99,
    image: "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=600&h=400&fit=crop",
    category: "fruit",
    tags: ["strawberry", "cream", "light"]
  },
  {
    id: 3,
    name: "Velvety Cheesecake",
    description: "Smooth and creamy cheesecake with a graham cracker crust.",
    price: 26.99,
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&h=400&fit=crop",
    category: "cheesecake",
    tags: ["cheesecake", "cream", "graham"]
  },
  {
    id: 4,
    name: "Red Velvet Classic",
    description: "Classic red velvet cake with cream cheese frosting.",
    price: 25.99,
    image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=600&h=400&fit=crop",
    category: "classic",
    tags: ["red velvet", "cream cheese", "classic"]
  },
  {
    id: 5,
    name: "Carrot Cake",
    description: "Moist carrot cake with walnuts and cream cheese frosting.",
    price: 23.99,
    image: "https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=600&h=400&fit=crop",
    category: "classic",
    tags: ["carrot", "walnuts", "cream cheese"]
  },
  {
    id: 6,
    name: "Tiramisu",
    description: "Italian coffee-flavored dessert with mascarpone cream.",
    price: 27.99,
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=400&fit=crop",
    category: "coffee",
    tags: ["coffee", "mascarpone", "italian"]
  }
];

// DOM Elements
const searchInput = document.getElementById('search');
const searchInputMobile = document.getElementById('searchMobile');
const cakeGrid = document.getElementById('cakeGrid');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');


function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


function showLoading() {
  cakeGrid.innerHTML = `
    <div class="col-span-full text-center py-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
      <p class="mt-4 text-gray-600">Searching for delicious cakes...</p>
    </div>
  `;
}

// error state
function showError(message) {
  cakeGrid.innerHTML = `
    <div class="col-span-full text-center py-8">
      <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p class="text-red-600">${message}</p>
    </div>
  `;
}

// Render cake card
function renderCakeCard(cake) {
  return `
    <div class="cake-card group flex flex-col bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-xl">
      <div class="relative overflow-hidden aspect-4-3">
        <img src="${cake.image}" alt="${cake.name}" 
             class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
             loading="lazy">
        <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300"></div>
      </div>
      <div class="p-4 sm:p-6">
        <h3 class="text-lg sm:text-xl font-medium mb-2">${cake.name}</h3>
        <p class="text-sm sm:text-base text-gray-600 mb-4">${cake.description}</p>
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <span class="text-lg font-medium text-pink-600">$${cake.price.toFixed(2)}</span>
          <button class="w-full sm:w-auto bg-pink-600 text-white px-6 py-2 rounded-full hover:bg-pink-700 transition-colors text-sm sm:text-base"
                  onclick="addToCart(${cake.id})">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  `;
}

// Search functionality
const searchCakes = debounce(function(query) {
  try {
    if (!query) {
      renderCakeGrid(cakes);
      return;
    }

    showLoading();
    
    setTimeout(() => {
      const searchResults = cakes.filter(cake => {
        const searchString = query.toLowerCase();
        return (
          cake.name.toLowerCase().includes(searchString) ||
          cake.description.toLowerCase().includes(searchString) ||
          cake.tags.some(tag => tag.toLowerCase().includes(searchString))
        );
      });

      if (searchResults.length === 0) {
        showError("No cakes found matching your search. Try different keywords!");
      } else {
        renderCakeGrid(searchResults);
      }
    }, 300); // Simulate loading
  } catch (error) {
    console.error("Search error:", error);
    showError("An error occurred while searching. Please try again.");
  }
}, 300);

// Render cake grid
function renderCakeGrid(cakesToRender) {
  cakeGrid.innerHTML = cakesToRender.map(cake => renderCakeCard(cake)).join('');
}

// Add to cart functionality
function addToCart(cakeId) {
  const cake = cakes.find(c => c.id === cakeId);
  if (cake) {
    // Add animation to button
    const button = event.target;
    button.classList.add('scale-95');
    setTimeout(() => button.classList.remove('scale-95'), 200);

    // Show notification
    showNotification(`${cake.name} added to cart!`);
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'fixed bottom-4 right-4 bg-pink-600 text-white px-6 py-3 rounded-full shadow-lg transform translate-y-full opacity-0 transition-all duration-300';
  notification.textContent = message;
  document.body.appendChild(notification);

  // Trigger animation
  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
    notification.style.opacity = '1';
  }, 100);

  // Remove notification
  setTimeout(() => {
    notification.style.transform = 'translateY(full)';
    notification.style.opacity = '0';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  renderCakeGrid(cakes);

  // Search event listeners
  searchInput.addEventListener('input', (e) => searchCakes(e.target.value));
  searchInputMobile.addEventListener('input', (e) => searchCakes(e.target.value));

  // Mobile menu toggle
  mobileMenuBtn.addEventListener('click', () => {
    // Add mobile menu functionality here
    console.log('Mobile menu clicked');
  });
});
