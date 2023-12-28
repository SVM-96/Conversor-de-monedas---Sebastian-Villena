document.addEventListener("DOMContentLoaded", () => {
  fetchCurrencyValues();
  document
    .getElementById("convert")
    .addEventListener("click", performConversion);
});

async function fetchCurrencyValues() {
  try {
    const response = await fetch("https://www.mindicador.cl/api");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    populateCurrencySelect(data);
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

function populateCurrencySelect(data) {
  const currencySelect = document.getElementById("currencySelect");
  // Iteramos sobre cada propiedad del objeto, excepto las primeras tres que no son indicadores
  for (const key in data) {
    if (
      data.hasOwnProperty(key) &&
      !["version", "autor", "fecha"].includes(key)
    ) {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = data[key].nombre;
      currencySelect.appendChild(option);
    }
  }
}

function performConversion() {
  const amount = parseFloat(document.getElementById("amount").value);
  const selectedCurrencyKey = document.getElementById("currencySelect").value;
  fetchCurrencyValue(selectedCurrencyKey, amount);
}

async function fetchCurrencyValue(currencyKey, amount) {
  if (!currencyKey) return;

  try {
    const response = await fetch(
      `https://www.mindicador.cl/api/${currencyKey}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const currencyValue = data.serie[0].valor;
    const conversionResult = amount / currencyValue;
    document.getElementById("result").textContent = conversionResult.toFixed(2);
  } catch (error) {
    console.error("Error fetching currency value: ", error);
  }
}
