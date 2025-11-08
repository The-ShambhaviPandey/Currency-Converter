
const BASE_URL = "https://api.frankfurter.app/latest?from=USD&to=INR";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Default selections
    if (select.name === "from" && currCode === "USD") newOption.selected = true;
    if (select.name === "to" && currCode === "INR") newOption.selected = true;

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag image
const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Update exchange rate
const updateExchangeRate = async () => {
  const amountInput = document.querySelector(".amount input");
  let amtVal = Number(amountInput.value);

  if (!amtVal || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const URL = `${BASE_URL}?base=${fromCurr.value}&symbols=${toCurr.value}`;

  try {
    const response = await fetch(URL);
    const data = await response.json();

    // DEBUG: check API response
    console.log("API data:", data);

    const rate = data.rates[toCurr.value];

    if (!rate) {
      msg.innerText = "Rate not available for selected currency.";
      return;
    }

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    console.error(err);
    msg.innerText = "Error fetching exchange rate.";
  }
};

// Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault(); // stop form from refreshing
  updateExchangeRate();
});

// Update flags and rate on page load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});