const docTypeEl = document.getElementById("docType");
const currencyEl = document.getElementById("currency");
const businessNameEl = document.getElementById("businessName");
const customerNameEl = document.getElementById("customerName");
const itemNameEl = document.getElementById("itemName");
const amountEl = document.getElementById("amount");
const generateBtn = document.getElementById("generateBtn");
const slipPreview = document.getElementById("slipPreview");
const copyBtn = document.getElementById("copyBtn");

// Load saved business name and currency if the seller used SlipQuick before
const savedBusiness = localStorage.getItem("slipquick_business");
const savedCurrency = localStorage.getItem("slipquick_currency");
if (savedBusiness) businessNameEl.value = savedBusiness;
if (savedCurrency) currencyEl.value = savedCurrency;

generateBtn.addEventListener("click", () => {
  const docType = docTypeEl.value;
  const currency = currencyEl.value;
  const business = businessNameEl.value.trim() || "My Business";
  const customer = customerNameEl.value.trim() || "Valued Customer";
  const item = itemNameEl.value.trim();
  const amount = parseFloat(amountEl.value);

  if (!item || isNaN(amount) || amount <= 0) {
    alert("Please enter an item description and a valid amount.");
    return;
  }

  // Save seller's business name and currency for next time
  localStorage.setItem("slipquick_business", business);
  localStorage.setItem("slipquick_currency", currency);

  const slipNumber = "SQ-" + Math.floor(1000 + Math.random() * 9000);
  const today = new Date().toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const statusLine = docType === "RECEIPT" ? "STATUS: PAID ✅" : "STATUS: QUOTE / ESTIMATE";

  const slipText = [
    `==============================`,
    `       ${business.toUpperCase()}`,
    `       ${docType} #${slipNumber}`,
    `==============================`,
    `Date:     ${today}`,
    `Customer: ${customer}`,
    `------------------------------`,
    `Item:     ${item}`,
    `Total:    ${currency}${amount.toFixed(2)}`,
    `------------------------------`,
    `${statusLine}`,
    `Thank you for your business!`,
    `==============================`,
  ].join("\n");

  slipPreview.textContent = slipText;
  slipPreview.classList.remove("hidden");
  copyBtn.classList.remove("hidden");
  copyBtn.textContent = "Copy for WhatsApp";
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(slipPreview.textContent);
    copyBtn.textContent = "Copied! Paste in WhatsApp ✅";
  } catch (err) {
    alert("Press and hold the receipt text above to copy it.");
  }
});
