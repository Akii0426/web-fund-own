// --- 1. Sidebar & Theme Logic ---
const menuBtn = document.getElementById("menuBtn");
const closeBtn = document.getElementById("closeBtn");
const sideMenu = document.getElementById("sideMenu");
const themeToggle = document.getElementById("themeToggle");

function applyTheme(isLightMode) {
    document.body.classList.toggle("light-mode", isLightMode);
    if (themeToggle) {
        themeToggle.checked = isLightMode;
    }
    localStorage.setItem("themePreference", isLightMode ? "light" : "dark");
}

const savedTheme = localStorage.getItem("themePreference");
const prefersLightMode = savedTheme ? savedTheme === "light" : window.matchMedia("(prefers-color-scheme: light)").matches;
applyTheme(prefersLightMode);

if (menuBtn) menuBtn.addEventListener("click", () => sideMenu.classList.add("open"));
if (closeBtn) closeBtn.addEventListener("click", () => sideMenu.classList.remove("open"));

if (themeToggle) {
    themeToggle.addEventListener("change", () => {
        applyTheme(themeToggle.checked);
    });
}


// --- 2. Game Data ---
const featuredGames = [
    {
        title: "Dragon Age™: Origins - Ultimate",
        badge: "CLASSIC",
        discount: "-60%",
        oldPrice: "$19.99",
        newPrice: "$7.99",
        rating: "4.5",
        reviews: "3726 reviews",
        mainImage: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Neon Phantom: Overdrive",
        badge: "NEW RELEASE",
        discount: "-20%",
        oldPrice: "$59.99",
        newPrice: "$47.99",
        rating: "4.8",
        reviews: "1.2k reviews",
        mainImage: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=1000&auto=format&fit=crop"
    },
    {
        title: "Stellar Drifters",
        badge: "TRENDING",
        discount: "-40%",
        oldPrice: "$39.99",
        newPrice: "$23.99",
        rating: "4.9",
        reviews: "8.5k reviews",
        mainImage: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop"
    }
];

const gameList = [
    { title: "Neon Phantom", genre: "FPS", platform: "Windows", price: 23.99, description: "A fast-paced cyberpunk shooter set in neon-soaked arenas.", rating: "4.8", posReviews: "12,450", negReviews: "340" },
    { title: "Omega Strike", genre: "FPS", platform: "Windows", price: 20.00, description: "Intense team-based tactical combat in futuristic space stations.", rating: "4.5", posReviews: "8,200", negReviews: "950" },
    { title: "Apex Protocol", genre: "FPS", platform: "Mac", price: 13.50, description: "Hunt or be hunted in this high-stakes extraction shooter.", rating: "4.0", posReviews: "3,100", negReviews: "1,200" },
    { title: "Against the Storm", genre: "RPG", platform: "Windows", price: 8.99, description: "Fantasy, Strategy, Management, City builder.", rating: "4.6", posReviews: "9,050", negReviews: "420" },
    { title: "Skyrim Anniversary", genre: "RPG", platform: "Windows", price: 16.49, description: "Open World, RPG, Dragons, Magic.", rating: "4.9", posReviews: "350k+", negReviews: "12k" },
    { title: "Hollow Echoes", genre: "RPG", platform: "Mac", price: 13.99, description: "Uncover the mysteries of a hauntingly beautiful cavern system.", rating: "4.4", posReviews: "4,600", negReviews: "530" },
    { title: "Colony Builder", genre: "Simulation", platform: "Windows", price: 16.99, description: "Manage resources and survive on a harsh alien planet.", rating: "4.2", posReviews: "5,100", negReviews: "890" },
    { title: "Aero Flight", genre: "Simulation", platform: "Windows", price: 53.99, description: "The most realistic civilian flight simulator ever created.", rating: "4.7", posReviews: "18,200", negReviews: "1,100" }
];


// --- 3. Hero Carousel Logic ---
let currentFeature = 0;

window.nextFeature = function() {
    currentFeature = (currentFeature + 1) % featuredGames.length;
    renderFeatured();
};

window.prevFeature = function() {
    currentFeature = (currentFeature - 1 + featuredGames.length) % featuredGames.length;
    renderFeatured();
};

window.goToFeature = function(index) {
    currentFeature = index;
    renderFeatured();
};

function renderFeatured() {
    const container = document.getElementById("featuredContainer");
    if (!container) return;
    
    const game = featuredGames[currentFeature];
    
    let dotsHTML = '';
    for (let i = 0; i < featuredGames.length; i++) {
        dotsHTML += `<span class="dot ${i === currentFeature ? 'active' : ''}" onclick="goToFeature(${i})"></span>`;
    }

    container.innerHTML = `
        <div class="hero-banner" style="background-image: url('${game.mainImage}');">
            <div class="hero-gradient"></div>
            <div class="hero-badge">${game.badge}</div>
            
            <button class="nav-arrow left-arrow" onclick="prevFeature()">‹</button>

            <div class="hero-content">
                <h2 class="hero-title">${game.title}</h2>
                <div class="hero-meta">
                    <span class="hero-rating" style="color: var(--accent);">★ ${game.rating}</span>
                    <span class="hero-reviews">${game.reviews}</span>
                </div>
                
                <div class="pricing-block">
                    <span class="discount-tag">${game.discount}</span>
                    <div class="price-stack">
                        <span class="old-price">${game.oldPrice}</span>
                        <span class="new-price">${game.newPrice}</span>
                    </div>
                    <button class="icon-btn">♡</button>
                    <button class="cart-btn">🛒 Buy Now</button>
                </div>
            </div>

            <button class="nav-arrow right-arrow" onclick="nextFeature()">›</button>

            <div class="hero-pagination">
                ${dotsHTML}
            </div>
        </div>
    `;
}


// --- 4. Catalogue Search, Filter & Sort Logic ---
const searchInput = document.getElementById("searchInput");
const genreFilter = document.getElementById("genreFilter");
const platformFilter = document.getElementById("platformFilter");
const sortSelect = document.getElementById("sortSelect");
const catalogueGrid = document.getElementById("catalogueGrid");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");

function updateCatalogue() {
    if (!catalogueGrid) return;

    const query = searchInput ? searchInput.value.toLowerCase() : "";
    const genre = genreFilter ? genreFilter.value : "all";
    const platform = platformFilter ? platformFilter.value : "all";
    const sortBy = sortSelect ? sortSelect.value : "default";

    // Filter games
    let filteredGames = gameList.filter(game => {
        const matchesTitle = game.title.toLowerCase().includes(query);
        const matchesGenre = genre === "all" || game.genre === genre;
        const matchesPlatform = platform === "all" || game.platform === platform;
        return matchesTitle && matchesGenre && matchesPlatform;
    });

    // Sort games
    if (sortBy === "price-asc") filteredGames.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") filteredGames.sort((a, b) => b.price - a.price);
    if (sortBy === "title-asc") filteredGames.sort((a, b) => a.title.localeCompare(b.title));
    if (sortBy === "title-desc") filteredGames.sort((a, b) => b.title.localeCompare(a.title));

    // Render results
    catalogueGrid.innerHTML = "";
    
    if (filteredGames.length === 0) {
        catalogueGrid.style.display = "none";
        if (emptyState) emptyState.style.display = "block";
        if (resultsCount) resultsCount.innerText = "0 results found.";
    } else {
        catalogueGrid.style.display = "grid";
        if (emptyState) emptyState.style.display = "none";
        if (resultsCount) resultsCount.innerText = `Showing ${filteredGames.length} result${filteredGames.length > 1 ? 's' : ''}.`;
        
        filteredGames.forEach(game => {
            const displayPrice = game.price === 0 ? "Free" : "$" + game.price.toFixed(2);
            catalogueGrid.innerHTML += `
                <div class="game-card">
                    <div class="card-image-wrapper">
                        <img src="https://placehold.co/400x250/1E293B/0EA5E9?text=${game.title.replace(/ /g, '+')}" alt="${game.title}" class="game-image">
                        <span class="genre-badge">${game.genre}</span>
                    </div>
                    <div class="game-info">
                        <h3 class="game-title">${game.title}</h3>
                        <div class="game-bottom-row">
                            <span class="game-price">${displayPrice}</span>
                            <!-- Updated to the new modern view button class -->
                            <button class="view-btn" onclick="openModal('${game.title}')">View</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
}

if (searchInput) searchInput.addEventListener("input", updateCatalogue);
if (genreFilter) genreFilter.addEventListener("change", updateCatalogue);
if (platformFilter) platformFilter.addEventListener("change", updateCatalogue);
if (sortSelect) sortSelect.addEventListener("change", updateCatalogue);


// --- 5. Modal Pop-Up Logic ---
window.openModal = function(gameTitle) {
    const game = gameList.find(g => g.title === gameTitle);
    if(!game) return;

    document.getElementById("modalTitle").innerText = game.title;
    document.getElementById("modalGenre").innerText = game.genre;
    document.getElementById("modalDesc").innerText = game.description;
    document.getElementById("modalRating").innerText = `★ ${game.rating}`;
    document.getElementById("modalPos").innerText = game.posReviews;
    document.getElementById("modalNeg").innerText = game.negReviews;
    document.getElementById("modalPrice").innerText = game.price === 0 ? "Free" : "$" + game.price.toFixed(2);
    document.getElementById("modalImage").src = `https://placehold.co/600x400/1E293B/0EA5E9?text=${game.title.replace(/ /g, '+')}`;

    document.getElementById("gameModal").classList.add("active");
};

window.closeModal = function() {
    const modal = document.getElementById("gameModal");
    if (modal) modal.classList.remove("active");
};

const closeModalBtn = document.getElementById("closeModalBtn");
if (closeModalBtn) closeModalBtn.addEventListener("click", closeModal);

window.addEventListener("click", function(event) {
    const modal = document.getElementById("gameModal");
    if (event.target === modal) {
        closeModal();
    }
});


// --- 6. Initialize Page ---
renderFeatured();
updateCatalogue();