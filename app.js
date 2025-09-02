// API endpoint for exchange rates
const API_URL = "https://open.er-api.com/v6/latest";

// DOM elements
const fromCurrency = document.getElementById("from-currency");
const toCurrency = document.getElementById("to-currency");
const fromFlag = document.getElementById("from-flag");
const toFlag = document.getElementById("to-flag");
const amountInput = document.getElementById("amount");
const conversionMsg = document.getElementById("conversion-msg");
const convertBtn = document.getElementById("convert-btn");
const swapBtn = document.getElementById("swap-btn");

// Country list with currency codes
const countryList = {
  AED: "AE",
  AFN: "AF",
  XCD: "AG",
  ALL: "AL",
  AMD: "AM",
  ANG: "AN",
  AOA: "AO",
  AQD: "AQ",
  ARS: "AR",
  AUD: "AU",
  AZN: "AZ",
  BAM: "BA",
  BBD: "BB",
  BDT: "BD",
  XOF: "BE",
  BGN: "BG",
  BHD: "BH",
  BIF: "BI",
  BMD: "BM",
  BND: "BN",
  BOB: "BO",
  BRL: "BR",
  BSD: "BS",
  NOK: "BV",
  BWP: "BW",
  BYR: "BY",
  BZD: "BZ",
  CAD: "CA",
  CDF: "CD",
  XAF: "CF",
  CHF: "CH",
  CLP: "CL",
  CNY: "CN",
  COP: "CO",
  CRC: "CR",
  CUP: "CU",
  CVE: "CV",
  CYP: "CY",
  CZK: "CZ",
  DJF: "DJ",
  DKK: "DK",
  DOP: "DO",
  DZD: "DZ",
  ECS: "EC",
  EEK: "EE",
  EGP: "EG",
  ETB: "ET",
  EUR: "FR",
  FJD: "FJ",
  FKP: "FK",
  GBP: "GB",
  GEL: "GE",
  GGP: "GG",
  GHS: "GH",
  GIP: "GI",
  GMD: "GM",
  GNF: "GN",
  GTQ: "GT",
  GYD: "GY",
  HKD: "HK",
  HNL: "HN",
  HRK: "HR",
  HTG: "HT",
  HUF: "HU",
  IDR: "ID",
  ILS: "IL",
  INR: "IN",
  IQD: "IQ",
  IRR: "IR",
  ISK: "IS",
  JMD: "JM",
  JOD: "JO",
  JPY: "JP",
  KES: "KE",
  KGS: "KG",
  KHR: "KH",
  KMF: "KM",
  KPW: "KP",
  KRW: "KR",
  KWD: "KW",
  KYD: "KY",
  KZT: "KZ",
  LAK: "LA",
  LBP: "LB",
  LKR: "LK",
  LRD: "LR",
  LSL: "LS",
  LTL: "LT",
  LVL: "LV",
  LYD: "LY",
  MAD: "MA",
  MDL: "MD",
  MGA: "MG",
  MKD: "MK",
  MMK: "MM",
  MNT: "MN",
  MOP: "MO",
  MRO: "MR",
  MTL: "MT",
  MUR: "MU",
  MVR: "MV",
  MWK: "MW",
  MXN: "MX",
  MYR: "MY",
  MZN: "MZ",
  NAD: "NA",
  XPF: "NC",
  NGN: "NG",
  NIO: "NI",
  NPR: "NP",
  NZD: "NZ",
  OMR: "OM",
  PAB: "PA",
  PEN: "PE",
  PGK: "PG",
  PHP: "PH",
  PKR: "PK",
  PLN: "PL",
  PYG: "PY",
  QAR: "QA",
  RON: "RO",
  RSD: "RS",
  RUB: "RU",
  RWF: "RW",
  SAR: "SA",
  SBD: "SB",
  SCR: "SC",
  SDG: "SD",
  SEK: "SE",
  SGD: "SG",
  SKK: "SK",
  SLL: "SL",
  SOS: "SO",
  SRD: "SR",
  STD: "ST",
  SVC: "SV",
  SYP: "SY",
  SZL: "SZ",
  THB: "TH",
  TJS: "TJ",
  TMT: "TM",
  TND: "TN",
  TOP: "TO",
  TRY: "TR",
  TTD: "TT",
  TWD: "TW",
  TZS: "TZ",
  UAH: "UA",
  UGX: "UG",
  USD: "US",
  UYU: "UY",
  UZS: "UZ",
  VEF: "VE",
  VND: "VN",
  VUV: "VU",
  YER: "YE",
  ZAR: "ZA",
  ZMK: "ZM",
  ZWD: "ZW",
};

// Populate dropdowns with currencies
function populateDropdowns() {
  for (let currencyCode in countryList) {
    // Add to from dropdown
    const fromOption = document.createElement("option");
    fromOption.value = currencyCode;
    fromOption.textContent = currencyCode;
    if (currencyCode === "USD") fromOption.selected = true;
    fromCurrency.appendChild(fromOption);

    // Add to to dropdown
    const toOption = document.createElement("option");
    toOption.value = currencyCode;
    toOption.textContent = currencyCode;
    if (currencyCode === "INR") toOption.selected = true;
    toCurrency.appendChild(toOption);
  }

  // Update flags based on initial selections
  updateFlag(fromCurrency, fromFlag);
  updateFlag(toCurrency, toFlag);
}

// Update flag based on currency selection
function updateFlag(selectElement, flagElement) {
  const currencyCode = selectElement.value;
  const countryCode = countryList[currencyCode];
  flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
}

// Fetch exchange rate from API
async function fetchExchangeRate(from, to) {
  try {
    const response = await fetch(`${API_URL}/${from}`);
    const data = await response.json();

    if (data && data.rates && data.rates[to]) {
      return data.rates[to];
    } else {
      throw new Error("Exchange rate not available");
    }
  } catch (error) {
    console.error("Error fetching exchange rate:", error);
    throw error;
  }
}

// Update conversion message with current rates
async function updateConversionMessage() {
  const from = fromCurrency.value;
  const to = toCurrency.value;

  try {
    conversionMsg.innerHTML = '<span class="loader"></span> Loading...';

    const rate = await fetchExchangeRate(from, to);
    const reverseRate = await fetchExchangeRate(to, from);

    const formattedRate = rate >= 1 ? rate.toFixed(4) : rate.toFixed(6);
    const formattedReverseRate =
      reverseRate >= 1 ? reverseRate.toFixed(4) : reverseRate.toFixed(6);

    conversionMsg.innerHTML = `1 ${from} = ${formattedRate} ${to}<br>1 ${to} = ${formattedReverseRate} ${from}`;
    conversionMsg.classList.add("highlight");

    setTimeout(() => {
      conversionMsg.classList.remove("highlight");
    }, 1000);
  } catch (error) {
    conversionMsg.textContent =
      "Error fetching exchange rates. Please try again.";
  }
}

// Convert currency based on amount input
async function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (isNaN(amount) || amount <= 0) {
    updateConversionMessage();
    return;
  }

  try {
    conversionMsg.innerHTML = '<span class="loader"></span> Converting...';

    const rate = await fetchExchangeRate(from, to);
    const result = (amount * rate).toFixed(2);

    conversionMsg.textContent = `${amount} ${from} = ${result} ${to}`;
    conversionMsg.classList.add("highlight");

    setTimeout(() => {
      conversionMsg.classList.remove("highlight");
    }, 1000);
  } catch (error) {
    conversionMsg.textContent = "Error converting currency. Please try again.";
  }
}

// Swap currencies
function swapCurrencies() {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;

  updateFlag(fromCurrency, fromFlag);
  updateFlag(toCurrency, toFlag);
  updateConversionMessage();
}

// Initialize app
function init() {
  populateDropdowns();
  updateConversionMessage();

  fromCurrency.addEventListener("change", () => {
    updateFlag(fromCurrency, fromFlag);
    updateConversionMessage();
  });

  toCurrency.addEventListener("change", () => {
    updateFlag(toCurrency, toFlag);
    updateConversionMessage();
  });

  amountInput.addEventListener("input", convertCurrency);
  convertBtn.addEventListener("click", (e) => {
    e.preventDefault();
    convertCurrency();
  });

  swapBtn.addEventListener("click", swapCurrencies);
}

document.addEventListener("DOMContentLoaded", init);
