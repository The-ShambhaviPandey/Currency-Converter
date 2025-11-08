const BASE_URL = "https://api.frankfurter.app/latest";

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

  const URL = `${BASE_URL}?from=${fromCurr.value}&to=${toCurr.value}`;

  try {
    const response = await fetch(URL);

    // Handle HTTP errors
    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    console.log("API data:", data);

    const rate = data.rates?.[toCurr.value];

    if (!rate) {
      msg.innerText = "Exchange rate not available — API might be temporarily down.";
      return;
    }

    const finalAmount = (amtVal * rate).toFixed(2);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    console.error(err);
    msg.innerText = "Unable to fetch data. The API might be unavailable at the moment.";
  }
};

// Button click
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// Update flags and rate on page load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
