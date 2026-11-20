const docTypeEl = document.getElementById("docType");
const currencyEl = document.getElementById("currency");
const businessNameEl = document.getElementById("businessName");
const customerNameEl = document.getElementById("customerName");
const itemNameEl = document.getElementById("itemName");
const qtyEl = document.getElementById("qty");
const amountEl = document.getElementById("amount");
const generateBtn = document.getElementById("generateBtn");
const slipPreview = document.getElementById("slipPreview");
const copyBtn = document.getElementById("copyBtn");
const totalBuyersEl = document.getElementById("totalBuyers");
const totalSalesEl = document.getElementById("totalSales");
const salesListEl = document.getElementById("salesList");
const headerBusinessTitle = document.getElementById("headerBusinessTitle");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let orders = JSON.parse(localStorage.getItem("slipquick_orders") || "[]");

const savedBusiness = localStorage.getItem("slipquick_business");
const savedCurrency = localStorage.getItem("slipquick_currency") || "R";
if (savedBusiness) {
  businessNameEl.value = savedBusiness;
  headerBusinessTitle.textContent = savedBusiness;
}
currencyEl.value = savedCurrency;

function updateDashboard() {
  const curr = currencyEl.value;
  const paidOrders = orders.filter((o) => o.type === "RECEIPT");
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.total, 0);

  totalBuyersEl.textContent = paidOrders.length;
  totalSalesEl.textContent = `${curr}${totalRevenue.toFixed(2)}`;

  if (orders.length === 0) {
    salesListEl.innerHTML = `<p class="empty-msg">No buyers recorded yet. Create your first paid slip above!</p>`;
    return;
  }

  salesListEl.innerHTML = orders
    .map(
      (order) => `
      <div class="sale-item">
        <div class="sale-info">
          <strong>${order.customer} (${order.qty}x ${order.item})</strong>
          <span>${order.date} • #${order.id}</span>
        </div>
        <div class="sale-right">
          <span class="sale-amount" style="color:${order.type === "RECEIPT" ? "#16a34a" : "#d97706"}">
            ${order.currency}${order.total.toFixed(2)}
          </span>
          ${
            order.type === "QUOTE"
              ? `<span class="badge-quote" onclick="markAsPaid('${order.id}')">Tap to Mark Paid</span>`
              : `<span style="font-size:11px;color:#16a34a;font-weight:700;">PAID ✅</span>`
          }
        </div>
      </div>
    `
    )
    .join("");
}

window.markAsPaid = function (id) {
  orders = orders.map((o) => (o.id === id ? { ...o, type: "RECEIPT" } : o));
  localStorage.setItem("slipquick_orders", JSON.stringify(orders));
  updateDashboard();
};

generateBtn.addEventListener("click", () => {
  const docType = docTypeEl.value;
  const currency = currencyEl.value;
  const business = businessNameEl.value.trim() || "My Business";
  const customer = customerNameEl.value.trim() || "Walk-in Buyer";
  const item = itemNameEl.value.trim();
  const qty = parseInt(qtyEl.value, 10) || 1;
  const price = parseFloat(amountEl.value);

  if (!item || isNaN(price) || price <= 0) {
    alert("Please enter an item name and a valid price.");
    return;
  }

  const total = qty * price;

  localStorage.setItem("slipquick_business", business);
  localStorage.setItem("slipquick_currency", currency);
  headerBusinessTitle.textContent = business;

  const slipId = "SQ-" + Math.floor(1000 + Math.random() * 9000);
  const today = new Date().toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  orders.unshift({
    id: slipId,
    type: docType,
    currency,
    customer,
    item,
    qty,
    total,
    date: today,
  });
  localStorage.setItem("slipquick_orders", JSON.stringify(orders));
  updateDashboard();

  const statusLine = docType === "RECEIPT" ? "STATUS: PAID ✅" : "STATUS: UNPAID QUOTE";

  const slipText = [
    `==============================`,
    `       ${business.toUpperCase()}`,
    `       ${docType} #${slipId}`,
    `==============================`,
    `Date:     ${today}`,
    `Buyer:    ${customer}`,
    `------------------------------`,
    `Item:     ${qty}x ${item}`,
    `Price:    ${currency}${price.toFixed(2)} each`,
    `TOTAL:    ${currency}${total.toFixed(2)}`,
    `------------------------------`,
    `${statusLine}`,
    `Thank you for your business!`,
    `==============================`,
  ].join("\n");

  slipPreview.textContent = slipText;
  slipPreview.classList.remove("hidden");
  copyBtn.classList.remove("hidden");
  copyBtn.textContent = "📲 Copy Slip for WhatsApp";

  customerNameEl.value = "";
  itemNameEl.value = "";
  qtyEl.value = "1";
  amountEl.value = "";
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(slipPreview.textContent);
    copyBtn.textContent = "Copied! Ready for WhatsApp ✅";
  } catch (err) {
    alert("Press and hold the receipt text above to copy it.");
  }
});

clearHistoryBtn.addEventListener("click", () => {
  if (confirm("Reset all buyer counts and sales history?")) {
    orders = [];
    localStorage.setItem("slipquick_orders", JSON.stringify(orders));
    updateDashboard();
  }
});

updateDashboard();
