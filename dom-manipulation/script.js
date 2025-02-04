document.addEventListener("DOMContentLoaded", function () {
    // DOM Elements
    const quoteDisplay = document.getElementById("quote-display");
    const newQuoteBtn = document.getElementById("new-quote-btn");
    const addQuoteBtn = document.getElementById("add-quote-btn");
    const quoteInput = document.getElementById("quote-input");
    const categoryInput = document.getElementById("category-input");
    const categoryFilter = document.getElementById("category-filter");
    const exportQuotesBtn = document.getElementById("export-quotes-btn");
    const importQuotesInput = document.getElementById("import-quotes-input");

    // Quotes Array with Categories (Load from Local Storage)
    let quotes = JSON.parse(localStorage.getItem("quotes")) || [
        { text: "The best way to predict the future is to create it.", category: "Motivation" },
        { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", category: "Success" },
        { text: "Believe you can and you're halfway there.", category: "Inspiration" },
        { text: "Happiness depends upon ourselves.", category: "Happiness" }
    ];

    // Load Categories into the Filter Dropdown
    function updateCategoryFilter() {
        let categories = ["All Categories", ...new Set(quotes.map(q => q.category))];
        categoryFilter.innerHTML = categories.map(cat => `<option value="${cat}">${cat}</option>`).join("");
    }

    // Show a Random Quote & Store in Session Storage
    function showRandomQuote() {
        let filteredQuotes = quotes.filter(q => categoryFilter.value === "All Categories" || q.category === categoryFilter.value);
        if (filteredQuotes.length === 0) {
            quoteDisplay.textContent = "No quotes available in this category.";
            return;
        }
        let randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        let selectedQuote = filteredQuotes[randomIndex];

        quoteDisplay.textContent = `"${selectedQuote.text}" - (${selectedQuote.category})`;

        // Store the last displayed quote in session storage
        sessionStorage.setItem("lastQuote", JSON.stringify(selectedQuote));
    }

    // Restore Last Viewed Quote from Session Storage
    function restoreLastQuote() {
        let lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
        if (lastQuote) {
            quoteDisplay.textContent = `"${lastQuote.text}" - (${lastQuote.category})`;
        }
    }

    // Add a New Quote & Save to Local Storage
    function addNewQuote() {
        let text = quoteInput.value.trim();
        let category = categoryInput.value.trim();

        if (text === "" || category === "") {
            alert("Please enter both a quote and a category.");
            return;
        }

        quotes.push({ text, category });
        localStorage.setItem("quotes", JSON.stringify(quotes));

        quoteInput.value = "";
        categoryInput.value = "";

        updateCategoryFilter();
        alert("Quote added successfully!");
    }

    // Export Quotes as JSON File
    function exportQuotes() {
        let dataStr = JSON.stringify(quotes, null, 2);
        let blob = new Blob([dataStr], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "quotes.json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Import Quotes from JSON File
    function importQuotes(event) {
        let file = event.target.files[0];
        if (!file) return;

        let reader = new FileReader();
        reader.onload = function (e) {
            try {
                let importedQuotes = JSON.parse(e.target.result);
                if (Array.isArray(importedQuotes)) {
                    quotes = [...quotes, ...importedQuotes];
                    localStorage.setItem("quotes", JSON.stringify(quotes));
                    updateCategoryFilter();
                    alert("Quotes imported successfully!");
                } else {
                    alert("Invalid JSON format!");
                }
            } catch (error) {
                alert("Error reading JSON file!");
            }
        };
        reader.readAsText(file);
    }

    // Event Listeners
    newQuoteBtn.addEventListener("click", showRandomQuote);
    addQuoteBtn.addEventListener("click", addNewQuote);
    categoryFilter.addEventListener("change", showRandomQuote);
    exportQuotesBtn.addEventListener("click", exportQuotes);
    importQuotesInput.addEventListener("change", importQuotes);

    // Initialize
    updateCategoryFilter();
    restoreLastQuote();
});