const rightAccounts = document.querySelector(".accounts"),
  rightFullAccountDetails = document.querySelector(".full-account-details"),
  rightCreateAccount = document.querySelector(".create-account"),
  lastNameInputElement = document.getElementById("last-name-input"),
  firstNameInputElement = document.getElementById("first-name-input"),
  middleNameInputElement = document.getElementById("middle-name-input"),
  suffixInputElement = document.getElementById("suffix-input"),
  emailAddressInputElement = document.getElementById("email-address-input"),
  passwordInputElement = document.getElementById("password-input"),
  balanceInputElement = document.getElementById("balance-input"),
  submitCreateAccountElement = document.getElementById("create-account-submit"),
  accountsTableElement = document.querySelector(".account-list-table"),
  tableRowTemplate = document.getElementById("table-row-template"),
  accountsTableBodyElement = document.querySelector(
    ".account-list-table tbody"
  ),
  accountFilterInput = document.getElementById("filter-input"),
  menuAccountsButton = document.querySelector(".menu-accounts-button"),
  menuSearchAccountButton = document.querySelector(
    ".menu-search-account-button"
  ),
  menuCreateAccountButton = document.querySelector(
    ".menu-create-account-button"
  ),
  menuDepositButton = document.querySelector(".menu-deposit-button"),
  menuWithdrawButton = document.querySelector(".menu-withdraw-button"),
  menuTransferButton = document.querySelector(".menu-transfer-button"),
  menuBudgetAppButton = document.querySelector(".menu-budget-app-button"),
  depositForm = document.getElementById("deposit-form"),
  depositLastNameInput = document.getElementById("deposit-last-name-input"),
  depositFirstNameInput = document.getElementById("deposit-first-name-input"),
  depositMiddleNameInput = document.getElementById("deposit-middle-name-input"),
  depositSuffixInput = document.getElementById("deposit-suffix-input"),
  depositAccountNumberInput = document.getElementById(
    "deposit-account-number-input"
  ),
  depositEmailAddressInput = document.getElementById(
    "deposit-email-address-input"
  ),
  depositAmountInput = document.getElementById("deposit-amount-input"),
  rightDepositSection = document.querySelector(".deposit-section"),
  withdrawForm = document.getElementById("withdraw-form"),
  withdrawLastNameInput = document.getElementById("withdraw-last-name-input"),
  withdrawFirstNameInput = document.getElementById("withdraw-first-name-input"),
  withdrawMiddleNameInput = document.getElementById(
    "withdraw-middle-name-input"
  ),
  withdrawSuffixInput = document.getElementById("withdraw-suffix-input"),
  withdrawAccountNumberInput = document.getElementById(
    "withdraw-account-number-input"
  ),
  withdrawEmailAddressInput = document.getElementById(
    "withdraw-email-address-input"
  ),
  withdrawAmountInput = document.getElementById("withdraw-amount-input"),
  rightWithdrawSection = document.querySelector(".withdraw-section"),
  rightTransferSection = document.querySelector(".transfer-section"),
  transferForm = document.getElementById("transfer-form"),
  senderLastNameInput = document.getElementById("sender-last-name-input"),
  senderFirstNameInput = document.getElementById("sender-first-name-input"),
  senderMiddleNameInput = document.getElementById("sender-middle-name-input"),
  senderSuffixInput = document.getElementById("sender-suffix-input"),
  senderAccountNumberInput = document.getElementById(
    "sender-account-number-input"
  ),
  senderEmailAddressInput = document.getElementById(
    "sender-email-address-input"
  ),
  senderAmountInput = document.getElementById("sender-amount-input"),
  receiverLastNameInput = document.getElementById("receiver-last-name-input"),
  receiverFirstNameInput = document.getElementById("receiver-first-name-input"),
  receiverMiddleNameInput = document.getElementById(
    "receiver-middle-name-input"
  ),
  receiverSuffixInput = document.getElementById("receiver-suffix-input"),
  receiverAccountNumberInput = document.getElementById(
    "receiver-account-number-input"
  ),
  receiverEmailAddressInput = document.getElementById(
    "receiver-email-address-input"
  ),
  quickTransactionForm = document.querySelector(".quick-transaction"),
  qtAccountNumberInput = document.getElementById("qt-account-number-input"),
  qtAmountInput = document.getElementById("qt-amount-input"),
  budgetAppTrTemplate = document.getElementById("budget-app-tr-template"),
  addExpenseButton = document.querySelector(".add-expense-button"),
  accountHistoryTable = document.querySelector(".table-account-history"),
  accountHistoryTableBody = document.querySelector(
    ".table-account-history tbody"
  ),
  loginDiv = document.querySelector(".login-div");

const LOCAL_STORAGE_ACCOUNTS_KEY = "accounts";

let accounts =
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_ACCOUNTS_KEY)) || [];

let filteredAccounts = [];

let currentAccount = {};

let userCreateAccount = false;

let accountActivityBalance = 0;

class ActivityDetail {
  constructor(description, amount, balance) {
    this.id = Date.now().toString();
    this.date = new Date().toString();
    this.description = description.toUpperCase();

    if (
      (description === "withdraw" ||
        description.includes("transfer to") ||
        description !== "deposit") &&
      !description.includes("transfer from")
    ) {
      this.amount = `-${amount}`;
      let newBal = balance;
      newBal -= amount;
      this.balance = newBal;
    } else {
      this.amount = `+${amount}`;
      let newBal = balance;
      newBal += amount;
      this.balance = newBal;
    }
  }
}

class FullName {
  constructor(firstName, middleName, lastName, suffixName) {
    this.firstName = firstName;
    this.middleName = middleName;
    this.lastName = lastName;
    this.suffixName = suffixName;
  }
}

class Account {
  constructor(
    firstName,
    middleName,
    lastName,
    suffixName,
    emailAddress,
    password,
    balance
  ) {
    this.fullName = new FullName(firstName, middleName, lastName, suffixName);
    this.accountNumber = uniqueAccountNumber(Date.now().toString());
    this.emailAddress = emailAddress;
    this.password = password;
    this.balance = balance;
    // new code for additional account details 5.5.2022
    this.creationDate = new Date().toString;
    this.accountActivity = [];
  }
}

// _Functions

function getFullName(account) {
  let fullName = `${account.fullName.lastName}, ${account.fullName.firstName} ${account.fullName.suffixName} ${account.fullName.middleName}`;
  return fullName;
}

function uniqueAccountNumber(accountNum) {
  let newAccountNumber = accountNum.substring(0, 13);
  if (accounts.find((acc) => acc.accountNumber === newAccountNumber)) {
    do {
      newAccountNumber = parseInt(newAccountNumber);
      newAccountNumber += 1;
      newAccountNumber = newAccountNumber.toString();
    } while (accounts.find((acc) => acc.accountNumber === newAccountNumber));
  }
  return newAccountNumber;
}

function toLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function renderCheck() {
  if (accountFilterInput.value) {
    renderArrayToTable(filteredAccounts);
  } else {
    renderArrayToTable(accounts);
  }
}

function renderArrayToTable(array) {
  array.forEach((account) => {
    const tableRowElement = document.importNode(tableRowTemplate.content, true);
    const tableRow = tableRowElement.querySelector(".account-detail"),
      accountNumber = tableRowElement.querySelector(".td-account-number"),
      lastName = tableRowElement.querySelector(".td-last-name"),
      firstName = tableRowElement.querySelector(".td-first-name"),
      middleName = tableRowElement.querySelector(".td-middle-name"),
      suffix = tableRowElement.querySelector(".td-suffix"),
      emailAddress = tableRowElement.querySelector(".td-email-address"),
      password = tableRowElement.querySelector(".td-password"),
      balance = tableRowElement.querySelector(".td-balance");

    tableRow.id = account.accountNumber;
    accountNumber.append(account.accountNumber.match(/.{1,4}/g).join("-"));
    lastName.append(account.fullName.lastName);
    firstName.append(account.fullName.firstName);
    middleName.append(account.fullName.middleName);
    suffix.append(account.fullName.suffixName);
    emailAddress.append(account.emailAddress);
    password.append(account.password);
    balance.append(account.balance);

    accountsTableBodyElement.appendChild(tableRowElement);
  });
}

function deleteAccountTableRow(e) {
  if (e.target.getAttribute("class") === "fa-solid fa-trash-can") {
    let selectedRowID = e.target.closest("tr").getAttribute("id");
    if (currentAccount.accountNumber === selectedRowID) {
      currentAccount = {};
      if (document.querySelector(".account-number p").textContent) {
        document.querySelector(".account-number p").textContent = "";
        document.querySelector(".last-name p").textContent = "";
        document.querySelector(".first-name p").textContent = "";
        document.querySelector(".middle-name p").textContent = "";
        document.querySelector(".suffix p").textContent = "";
        document.querySelector(".complete-name p").textContent = "";
        document.querySelector(".email-address p").textContent = "";
        document.querySelector(".password p").textContent = "";
        document.querySelector(".balance p").textContent = "";
        clearElement(accountHistoryTableBody);
      }
    }
    accounts = accounts.filter(
      (account) => account.accountNumber !== selectedRowID
    );
    filteredAccounts = filteredAccounts.filter(
      (account) => account.accountNumber !== selectedRowID
    );

    toLocalStorage(LOCAL_STORAGE_ACCOUNTS_KEY, accounts);
    clearElement(accountsTableBodyElement);
    renderCheck();
  }
}

function setFirstAccounts(e) {
  accounts = [
    {
      fullName: {
        firstName: "John",
        middleName: "Middleton",
        lastName: "Doe",
        suffixName: "III",
      },
      accountNumber: "1234567890120",
      balance: 10000,
      emailAddress: "john.doeIII@email.com",
      password: "1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Blip",
        middleName: "Horton",
        lastName: "Malones",
        suffixName: "Jr",
      },
      accountNumber: "1234567890121",
      balance: 500000,
      emailAddress: "blip.malonesjr@email.com",
      password: "golshsteter",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Lloyd",
        middleName: "Estrenger",
        lastName: "Valenciaga",
        suffixName: "",
      },
      accountNumber: "1234567890122",
      balance: 0,
      emailAddress: "lloyd.valenciaga@email.com",
      password: "lloyd12345",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Cecilia",
        middleName: "Maria",
        lastName: "Cecilia",
        suffixName: "",
      },
      accountNumber: "1234567890123",
      balance: 5000,
      emailAddress: "ma.cecilia@email.com",
      password: "iloveblackandblue",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Bob",
        middleName: "Hinge",
        lastName: "Sy",
        suffixName: "Sr",
      },
      accountNumber: "1234567890124",
      balance: 3000000,
      emailAddress: "Bob.HingeSr@email.com",
      password: "r@nd0mpass",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Ekalam",
        middleName: "Blue",
        lastName: "Sobra",
        suffixName: "",
      },
      accountNumber: "1234567890125",
      balance: 10000,
      emailAddress: "ekalam.hehe@email.com",
      password: "s0br@nah",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Lisa",
        middleName: "Test",
        lastName: "Ann",
        suffixName: "",
      },
      accountNumber: "1234567890126",
      balance: 11500000,
      emailAddress: "lisa.ann@email.com",
      password: "alt#4352",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Gerald",
        middleName: "Miko",
        lastName: "Anderson",
        suffixName: "",
      },
      accountNumber: "1234567890127",
      balance: 620300,
      emailAddress: "geraldonlyfans312@email.com",
      password: "geraldforlyf44",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Cliff",
        middleName: "Knot",
        lastName: "Hanger",
        suffixName: "II",
      },
      accountNumber: "1234567890128",
      balance: 522000,
      emailAddress: "cliffer.not@email.com",
      password: "cliffcliffcliff",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Mio",
        middleName: "Tetsuka",
        lastName: "Kawashima",
        suffixName: "",
      },
      accountNumber: "1234567890129",
      balance: 13000,
      emailAddress: "mio.mio@email.com",
      password: "h@ltp@ss52",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Alps",
        middleName: "Kol",
        lastName: "Coup",
        suffixName: "",
      },
      accountNumber: "1234567890130",
      balance: 1000,
      emailAddress: "alp.coup@email.com",
      password: "weiiiiiire",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Mathis",
        middleName: "Achille",
        lastName: "Royer",
        suffixName: "",
      },
      accountNumber: "1234567890131",
      balance: 500,
      emailAddress: "Mathis.Achille@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Favreau",
        middleName: "Giroux",
        lastName: "Evonne",
        suffixName: "",
      },
      accountNumber: "1234567890132",
      balance: 100000,
      emailAddress: "Favreau.Evonne@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Felicienne",
        middleName: "Médée",
        lastName: "Bonhomme",
        suffixName: "",
      },
      accountNumber: "1234567890133",
      balance: 100000,
      emailAddress: "Felicienne.Bonhomme@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Vivienne",
        middleName: "Perrot",
        lastName: "Lémieux",
        suffixName: "",
      },
      accountNumber: "1234567890134",
      balance: 100000,
      emailAddress: "Vivienne.Perrot@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Maximilien",
        middleName: "Grégoire",
        lastName: "Dubois",
        suffixName: "V",
      },
      accountNumber: "1234567890135",
      balance: 100000,
      emailAddress: "Maximilien.Grégoire@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Nathalie",
        middleName: "Adrien",
        lastName: "Noel",
        suffixName: "",
      },
      accountNumber: "1234567890136",
      balance: 100000,
      emailAddress: "Nathalie.Noel@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Urbano",
        middleName: "Ria",
        lastName: "Blasco",
        suffixName: "",
      },
      accountNumber: "1234567890137",
      balance: 100000,
      emailAddress: "Urbano.Blasco@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Vayo",
        middleName: "Eloisa",
        lastName: "Manrique",
        suffixName: "",
      },
      accountNumber: "1234567890138",
      balance: 100000,
      emailAddress: "Vayo.Manrique@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Cruz",
        middleName: "Velazco",
        lastName: "Inocencio",
        suffixName: "Sr",
      },
      accountNumber: "1234567890139",
      balance: 100000,
      emailAddress: "Cruz.Inocencio@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Segundo",
        middleName: "Fallas",
        lastName: "Delfina",
        suffixName: "",
      },
      accountNumber: "1234567890140",
      balance: 100000,
      emailAddress: "Segundo.Delfina@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Jacinta",
        middleName: "Yniguez",
        lastName: "Pío",
        suffixName: "",
      },
      accountNumber: "1234567890141",
      balance: 30000,
      emailAddress: "Jacinta.Yniguez@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Vega",
        middleName: "Alfredo",
        lastName: "Cobos",
        suffixName: "",
      },
      accountNumber: "1234567890142",
      balance: 30000,
      emailAddress: "Vega.Cobos@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Gregorio",
        middleName: "Avelino",
        lastName: "Pierpoint",
        suffixName: "II",
      },
      accountNumber: "1234567890143",
      balance: 30000,
      emailAddress: "Gregorio.Pierpoint@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Eda",
        middleName: "Aiken",
        lastName: "Newton",
        suffixName: "",
      },
      accountNumber: "1234567890144",
      balance: 30000,
      emailAddress: "Eda.Newton@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Scott",
        middleName: "Thalia",
        lastName: "Pierce",
        suffixName: "",
      },
      accountNumber: "1234567890145",
      balance: 40000,
      emailAddress: "Scott.Pierce@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Harding",
        middleName: "Ned",
        lastName: "Greenwood",
        suffixName: "",
      },
      accountNumber: "1234567890146",
      balance: 40000,
      emailAddress: "Harding.Greenwood@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Ohta",
        middleName: "Nishihara",
        lastName: "Tetsuya",
        suffixName: "",
      },
      accountNumber: "1234567890147",
      balance: 40000,
      emailAddress: "Ohta.Tetsuya@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Tyrone",
        middleName: "Fleming",
        lastName: "Russ",
        suffixName: "",
      },
      accountNumber: "1234567890148",
      balance: 40000,
      emailAddress: "Tyrone.Russ@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Nichols",
        middleName: "Manfred",
        lastName: "Cummings",
        suffixName: "",
      },
      accountNumber: "1234567890149",
      balance: 50000,
      emailAddress: "Nichols.Cummings@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Sadie",
        middleName: "Parkinson",
        lastName: "Priscilla",
        suffixName: "",
      },
      accountNumber: "1234567890150",
      balance: 50000,
      emailAddress: "Sadie.Priscilla@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
    {
      fullName: {
        firstName: "Kiyabu",
        middleName: "Mino",
        lastName: "Haruki",
        suffixName: "",
      },
      accountNumber: "1234567890151",
      balance: 50000,
      emailAddress: "Kiyabu.Haruki@email.com",
      password: "test1234",
      creationDate: new Date().toString(),
      accountActivity: [],
    },
  ];
  toLocalStorage(LOCAL_STORAGE_ACCOUNTS_KEY, accounts);
  clearElement(accountsTableBodyElement);
  renderArrayToTable(accounts);
}

function filterAccounts(e) {
  let enteredCharacter = accountFilterInput.value;

  filteredAccounts = accounts.filter((account) => {
    let allAccountValues = `${getFullName(account).toLowerCase()} ${
      account.accountNumber
    } ${account.emailAddress.toLowerCase()} ${account.balance}`;
    return allAccountValues.includes(enteredCharacter.toLowerCase());
  });
  clearElement(accountsTableBodyElement);
  renderArrayToTable(filteredAccounts);
}

function submitAccountForm(e) {
  e.preventDefault();
  const lastName = lastNameInputElement.value,
    firstName = firstNameInputElement.value,
    middleName = middleNameInputElement.value,
    emailAddress = emailAddressInputElement.value,
    password = passwordInputElement.value;

  if (
    lastName.match(/[0-9]/g) ||
    firstName.match(/[0-9]/g) ||
    middleName.match(/[0-9]/g)
  ) {
    alert("Entered name has numbers");
    return;
  }

  let balance = 0,
    suffix = suffixInputElement.value;

  if (balanceInputElement.value !== "")
    balance = parseInt(balanceInputElement.value);

  if (
    suffix.toLowerCase() === "senior" ||
    suffix.toLowerCase().replace(/\./g, "") === "sr"
  ) {
    suffix = "Sr";
  } else if (
    suffix.toLowerCase() === "junior" ||
    suffix.toLowerCase().replace(/\./g, "") === "jr"
  ) {
    suffix = "Jr";
  } else {
    suffix = suffixInputElement.value.toUpperCase();
  }

  if (
    lastName === "" ||
    firstName === "" ||
    middleName === "" ||
    emailAddress === "" ||
    password === ""
  ) {
    return;
  } else if (
    accounts.find(
      (account) =>
        getFullName(account).toLowerCase() ===
        `${lastName}, ${firstName} ${suffix} ${middleName}`.toLowerCase()
    )
  ) {
    alert("You already have an account.");
    return;
  } else if (
    accounts.find((account) => account.emailAddress === emailAddress)
  ) {
    alert("This email address is already in use");
    return;
  } else {
    const newAccount = new Account(
      firstName,
      middleName,
      lastName,
      suffix,
      emailAddress,
      password,
      balance
    );

    accounts.push(newAccount);
    toLocalStorage(LOCAL_STORAGE_ACCOUNTS_KEY, accounts);

    lastNameInputElement.value = null;
    firstNameInputElement.value = null;
    middleNameInputElement.value = null;
    suffixInputElement.value = null;
    emailAddressInputElement.value = null;
    passwordInputElement.value = null;
    balanceInputElement.value = null;

    clearElement(accountsTableBodyElement);

    renderCheck();
  }
  if (userCreateAccount === true) {
    hideAllExcept(loginDiv);
    document.querySelector("main").style.display = "none";
    userCreateAccount = false;
  } else {
    return;
  }
}

function showAccountActivity() {
  clearElement(accountHistoryTableBody);
  currentAccount.accountActivity.forEach((activity) => {
    const budgetAppTrElement = document.importNode(
      budgetAppTrTemplate.content,
      true
    );
    const tableRow = budgetAppTrElement.querySelector(".activity-detail"),
      dateTd = budgetAppTrElement.querySelector(".budget-app-date"),
      descriptionTd = budgetAppTrElement.querySelector(
        ".budget-app-description"
      ),
      amountTd = budgetAppTrElement.querySelector(".budget-app-amount"),
      balanceTd = budgetAppTrElement.querySelector(".budget-app-balance"),
      actionTd = budgetAppTrElement.querySelector(".budget-app-action");

    tableRow.id = activity.id;
    dateTd.append(activity.date);
    descriptionTd.append(activity.description);
    amountTd.append(activity.amount);
    balanceTd.append(activity.balance);
    if (
      activity.description.includes("DEPOSIT") ||
      activity.description.includes("WITHDRAW") ||
      activity.description.includes("TRANSFER")
    ) {
      clearElement(actionTd);
      actionTd.textContent = "N/A";
    }

    accountHistoryTableBody.prepend(budgetAppTrElement);
  });
}

function showFullAccountDetails(e) {
  let selectedRowID = e.target.closest("tr").id;
  currentAccount = accounts.find(
    (account) => account.accountNumber === selectedRowID
  );

  document.querySelector(".account-number p").textContent =
    currentAccount.accountNumber.match(/.{1,4}/g).join("-");
  document.querySelector(".last-name p").textContent =
    currentAccount.fullName.lastName;
  document.querySelector(".first-name p").textContent =
    currentAccount.fullName.firstName;
  document.querySelector(".middle-name p").textContent =
    currentAccount.fullName.middleName;
  if (currentAccount.fullName.suffixName === "") {
    document.querySelector(".suffix p").textContent = "N/A";
  } else {
    document.querySelector(".suffix p").textContent =
      currentAccount.fullName.suffixName;
  }
  document.querySelector(".complete-name p").textContent =
    getFullName(currentAccount);
  document.querySelector(".email-address p").textContent =
    currentAccount.emailAddress;
  document.querySelector(".password p").textContent = currentAccount.password;
  document.querySelector(".balance p").textContent = currentAccount.balance;
}

function updateAccountActivity(
  account,
  transaction,
  amount,
  balance,
  receiverAccount
) {
  if (transaction === "deposit" || transaction === "withdraw") {
    let createdActivity = new ActivityDetail(transaction, amount, balance);
    account.accountActivity.push(createdActivity);
  } else {
    let activityForSender = new ActivityDetail(
      `transfer to ${getFullName(
        receiverAccount
      )} (${receiverAccount.accountNumber.match(/.{1,4}/g).join("-")})`,
      amount,
      balance
    );
    let activityForReceiver = new ActivityDetail(
      `transfer from ${getFullName(account)} (${account.accountNumber
        .match(/.{1,4}/g)
        .join("-")})`,
      amount,
      receiverAccount.balance
    );
    account.accountActivity.push(activityForSender);
    receiverAccount.accountActivity.push(activityForReceiver);
  }
}

function proceedTransaction(transaction, account, amount, receiverAccount) {
  if (transaction === "deposit") {
    updateAccountActivity(account, transaction, amount, account.balance);
    account.balance += amount;
    alert("Transaction Successful!");
  } else if (transaction === "withdraw") {
    if (amount > account.balance) {
      alert(`Insufficient balance`);
      return;
    }
    updateAccountActivity(account, transaction, amount, account.balance);
    account.balance -= amount;
    alert("Transaction Successful!");
  } else if (transaction === "transfer") {
    if (account.balance < amount) {
      alert("Insufficient balance");
      return;
    } else {
      updateAccountActivity(
        account,
        transaction,
        amount,
        account.balance,
        receiverAccount
      );
      account.balance -= amount;
      receiverAccount.balance += amount;
      alert("Transaction Successful!");
    }
  }
}

function transactionType(transaction) {
  let depositAccountNumber = depositAccountNumberInput.value.replace(/\D/g, "");
  if (transaction === "deposit") {
    let amountEntered = parseInt(depositAmountInput.value);
    if (!amountEntered) {
      alert("Please enter a valid amount");
      return;
    }
    if (depositAccountNumber) {
      let specifiedAccount = accounts.find(
        (account) => account.accountNumber === depositAccountNumber
      );
      if (!specifiedAccount) {
        alert("This account number does not have an account");
        return;
      }
      proceedTransaction(transaction, specifiedAccount, amountEntered);
    } else if (depositEmailAddressInput.value) {
      let specifiedAccount = accounts.find(
        (account) => account.emailAddress === depositEmailAddressInput.value
      );
      if (!specifiedAccount) {
        alert("This email address does not have an account");
        return;
      }
      proceedTransaction(transaction, specifiedAccount, amountEntered);
    } else if (depositLastNameInput.value) {
      let depositFullName = `${depositLastNameInput.value}, ${depositFirstNameInput.value} ${depositSuffixInput.value} ${depositMiddleNameInput.value}`;
      let specifiedAccount = accounts.find(
        (account) =>
          getFullName(account).toLowerCase() === depositFullName.toLowerCase()
      );
      if (!specifiedAccount) {
        alert("This name does not have an account");
        return;
      }
      proceedTransaction(transaction, specifiedAccount, amountEntered);
    } else {
      alert("Please enter the account number, email address, or complete name");
    }
  } else if (transaction === "withdraw") {
    let withdrawAccountNumber = withdrawAccountNumberInput.value.replace(
      /\D/g,
      ""
    );
    let amountEntered = parseInt(withdrawAmountInput.value);
    if (!amountEntered) {
      alert("Please enter a valid amount");
      return;
    }
    if (withdrawAccountNumber) {
      let specifiedAccount = accounts.find(
        (account) => account.accountNumber === withdrawAccountNumber
      );
      if (!specifiedAccount) {
        alert("This account number does not have an account");
        return;
      }
      proceedTransaction(transaction, specifiedAccount, amountEntered);
    } else if (withdrawEmailAddressInput.value) {
      let specifiedAccount = accounts.find(
        (account) => account.emailAddress === withdrawEmailAddressInput.value
      );
      if (!specifiedAccount) {
        alert("This email address does not have an account");
        return;
      }
      proceedTransaction(transaction, specifiedAccount, amountEntered);
    } else if (withdrawLastNameInput.value) {
      let withdrawFullName = `${withdrawLastNameInput.value}, ${withdrawFirstNameInput.value} ${withdrawSuffixInput.value} ${withdrawMiddleNameInput.value}`;
      let specifiedAccount = accounts.find(
        (account) =>
          getFullName(account).toLowerCase() === withdrawFullName.toLowerCase()
      );
      if (!specifiedAccount) {
        alert("This name does not have an account");
        return;
      }
      proceedTransaction(transaction, specifiedAccount, amountEntered);
    } else {
      alert("Please enter the account number, email address, or complete name");
    }
  } else if (transaction === "transfer") {
    let amountEntered = parseInt(senderAmountInput.value);
    let senderAccountNumber = senderAccountNumberInput.value.replace(/\D/g, "");

    if (!amountEntered) {
      alert("Please enter a valid amount");
      return;
    }

    if (senderAccountNumber) {
      let specifiedSenderAccount = accounts.find(
        (account) => account.accountNumber === senderAccountNumber
      );
      let specifiedReceiverAccount = determineReceiver();

      if (!specifiedSenderAccount) {
        alert("The sender does not have an account");
        return;
      }
      if (!specifiedReceiverAccount) {
        alert("The receiver does not have an account");
        return;
      }
      if (specifiedSenderAccount.balance < amountEntered) {
        alert("Insufficient balance");
        return;
      } else {
        proceedTransaction(
          transaction,
          specifiedSenderAccount,
          amountEntered,
          specifiedReceiverAccount
        );
      }
    } else if (senderEmailAddressInput.value) {
      let specifiedSenderAccount = accounts.find(
        (account) => account.emailAddress === senderEmailAddressInput.value
      );
      let specifiedReceiverAccount = determineReceiver();

      if (!specifiedSenderAccount) {
        alert("The sender does not have an account");
        return;
      }
      if (!specifiedReceiverAccount) {
        alert("The receiver does not have an account");
        return;
      }
      if (specifiedSenderAccount.balance < amountEntered) {
        alert("Insufficient balance");
        return;
      } else {
        proceedTransaction(
          transaction,
          specifiedSenderAccount,
          amountEntered,
          specifiedReceiverAccount
        );
      }
    } else if (senderLastNameInput.value) {
      let senderFullName = `${senderLastNameInput.value}, ${senderFirstNameInput.value} ${senderSuffixInput.value} ${senderMiddleNameInput.value}`;
      let specifiedSenderAccount = accounts.find(
        (account) =>
          getFullName(account).toLowerCase() === senderFullName.toLowerCase()
      );
      let specifiedReceiverAccount = determineReceiver();

      if (!specifiedSenderAccount) {
        alert("The sender does not have an account");
        return;
      }
      if (!specifiedReceiverAccount) {
        alert("The receiver does not have an account");
        return;
      }
      if (specifiedSenderAccount.balance < amountEntered) {
        alert("Insufficient balance");
        return;
      } else {
        proceedTransaction(
          transaction,
          specifiedSenderAccount,
          amountEntered,
          specifiedReceiverAccount
        );
      }
    } else {
      alert("Please enter the account number, email address, or complete name");
    }
  }
}

function determineReceiver() {
  let receiverAccountNumber = receiverAccountNumberInput.value.replace(
    /\D/g,
    ""
  );
  let receiverFullName =
    `${receiverLastNameInput.value}, ${receiverFirstNameInput.value} ${receiverSuffixInput.value} ${receiverMiddleNameInput.value}`.toLowerCase();
  let receiverAccount =
    accounts.find(
      (account) => account.accountNumber === receiverAccountNumber
    ) ||
    accounts.find(
      (account) => account.emailAddress === receiverEmailAddressInput.value
    ) ||
    accounts.find(
      (account) => getFullName(account).toLowerCase() === receiverFullName
    );

  return receiverAccount;
}

function hideAllExcept(elementOne, elementTwo) {
  loginDiv.style.display = "none";
  rightFullAccountDetails.style.display = "none";
  rightAccounts.style.display = "none";
  rightCreateAccount.style.display = "none";
  rightDepositSection.style.display = "none";
  rightWithdrawSection.style.display = "none";
  rightTransferSection.style.display = "none";
  elementOne.style.display = "block";
  if (elementOne === loginDiv) {
    loginDiv.style.display = "flex";
  } else {
    // rightAccounts.style.gridRow = "2 / 9";
  }
  if (elementTwo) {
    elementTwo.style.display = "block";
  } else {
    return;
  }
}

function saveAccountsAndRender() {
  toLocalStorage(LOCAL_STORAGE_ACCOUNTS_KEY, accounts);
  clearElement(accountsTableBodyElement);
  renderCheck();
}

function updateFullDetailBalance() {
  document.querySelector(".balance p").textContent = currentAccount.balance;
}

// _Event Listeners

menuAccountsButton.addEventListener("click", (e) => {
  hideAllExcept(rightAccounts);
});

menuCreateAccountButton.addEventListener("click", (e) => {
  hideAllExcept(rightCreateAccount, rightAccounts);
});

menuDepositButton.addEventListener("click", (e) => {
  hideAllExcept(rightDepositSection, rightAccounts);
});

menuWithdrawButton.addEventListener("click", (e) => {
  hideAllExcept(rightWithdrawSection, rightAccounts);
});

menuTransferButton.addEventListener("click", (e) => {
  hideAllExcept(rightTransferSection, rightAccounts);
});

menuBudgetAppButton.addEventListener("click", (e) => {
  hideAllExcept(rightFullAccountDetails, rightAccounts);
});

accountFilterInput.addEventListener("keyup", filterAccounts);
submitCreateAccountElement.addEventListener("click", submitAccountForm);
accountsTableElement.addEventListener("click", deleteAccountTableRow);
accountsTableElement.addEventListener("click", (e) => {
  if (
    e.target.getAttribute("class") === "fa-solid fa-arrow-right-to-bracket" ||
    e.ctrlKey
  ) {
    hideAllExcept(rightFullAccountDetails, rightAccounts);
    showFullAccountDetails(e);
    showAccountActivity();
    addExpenseButton.style.display = "block";
  }
});

depositForm.addEventListener("submit", (e) => {
  e.preventDefault();
  transactionType("deposit");
  saveAccountsAndRender();
});

withdrawForm.addEventListener("submit", (e) => {
  e.preventDefault();
  transactionType("withdraw");
  saveAccountsAndRender();
});

transferForm.addEventListener("submit", (e) => {
  e.preventDefault();
  transactionType("transfer");
  saveAccountsAndRender();
});

quickTransactionForm.addEventListener("click", (e) => {
  e.preventDefault();
  let receiverAccount = accounts.find(
      (account) =>
        account.accountNumber === qtAccountNumberInput.value.replace(/\D/g, "")
    ),
    amountEntered = parseInt(qtAmountInput.value);
  if (e.target.getAttribute("class") === "form-btn qt-withdraw-button") {
    if (qtAmountInput.value == null || qtAmountInput.value == "") {
      alert("Please enter an amount");
      return;
    }
    proceedTransaction("withdraw", currentAccount, amountEntered);
    updateFullDetailBalance();
  } else if (e.target.getAttribute("class") === "form-btn qt-deposit-button") {
    if (qtAmountInput.value == null || qtAmountInput.value == "") {
      alert("Please enter an amount");
      return;
    }
    proceedTransaction("deposit", currentAccount, amountEntered);
    updateFullDetailBalance();
  } else if (e.target.getAttribute("class") === "form-btn qt-transfer-button") {
    if (qtAmountInput.value == null || qtAmountInput.value == "") {
      alert("Please enter an amount");
      return;
    }
    if (
      currentAccount.accountNumber ===
      qtAccountNumberInput.value.replace(/\D/g, "")
    ) {
      alert("Invalid transaction");
      return;
    } else if (!qtAccountNumberInput.value.replace(/\D/g, "")) {
      alert(`Please enter the receiver's account number`);
      return;
    }
    proceedTransaction(
      "transfer",
      currentAccount,
      amountEntered,
      receiverAccount
    );
  }
  updateFullDetailBalance();
  saveAccountsAndRender();
  showAccountActivity();
});

addExpenseButton.addEventListener("click", (e) => {
  if (!currentAccount.accountNumber) return;
  addExpenseButton.style.display = "none";
  const budgetAppTrElement = document.importNode(
    budgetAppTrTemplate.content,
    true
  );
  const tableRow = budgetAppTrElement.querySelector(".activity-detail"),
    dateTd = budgetAppTrElement.querySelector(".budget-app-date"),
    descriptionTd = budgetAppTrElement.querySelector(".budget-app-description"),
    amountTd = budgetAppTrElement.querySelector(".budget-app-amount"),
    balanceTd = budgetAppTrElement.querySelector(".budget-app-balance"),
    actionTd = budgetAppTrElement.querySelector(".budget-app-action");

  let descriptionInputElement = document.createElement("input");
  descriptionInputElement.id = "description-input-element";
  let amountInputElement = document.createElement("input");
  amountInputElement.id = "amount-input-element";
  amountInputElement.setAttribute("type", "number");
  let submitButton = document.createElement("button");
  submitButton.id = "submit-expense-element";
  submitButton.classList.add("form-btn");
  submitButton.textContent = "Submit";

  descriptionTd.append(descriptionInputElement);
  amountTd.append(amountInputElement);
  clearElement(actionTd);
  actionTd.append(submitButton);

  accountHistoryTableBody.prepend(budgetAppTrElement);
});

accountHistoryTable.addEventListener("click", (e) => {
  if (
    e.target.id === "submit-expense-element" &&
    document.getElementById("description-input-element").value &&
    document.getElementById("amount-input-element").value
  ) {
    let descriptionEntered = document.getElementById(
        "description-input-element"
      ).value,
      amountEntered = document.getElementById("amount-input-element").value;

    if (amountEntered.value <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    let newActivity = new ActivityDetail(
      descriptionEntered,
      amountEntered,
      currentAccount.balance
    );
    let targetAccount = accounts.find(
      (account) => account.accountNumber === currentAccount.accountNumber
    );
    targetAccount.accountActivity.push(newActivity);
    targetAccount.balance -= amountEntered;

    saveAccountsAndRender();
    showAccountActivity();
    updateFullDetailBalance();

    addExpenseButton.style.display = "block";
  }
});

accountHistoryTable.addEventListener("click", (e) => {
  if (e.target.getAttribute("class") === "form-btn delete-expense-button") {
    let selectedRowId = e.target.closest("tr").id;
    let selectedAccount = accounts.find(
      (account) => account.accountNumber === currentAccount.accountNumber
    );
    let selectedActivity = selectedAccount.accountActivity.find(
      (activity) => activity.id === selectedRowId
    );

    selectedAccount.balance += parseInt(
      selectedActivity.amount.replace(/\D/g, "")
    );

    selectedAccount.accountActivity = selectedAccount.accountActivity.filter(
      (activity) => activity.id !== selectedRowId
    );
    saveAccountsAndRender();
    showAccountActivity();
    updateFullDetailBalance();
  }
});

document.querySelector(".login-form").addEventListener("submit", (e) => {
  e.preventDefault();
  let emailEntered = document.getElementById("login-email-input").value;
  let passwordEntered = document.getElementById("login-password-input").value;
  let selectedAccount = accounts.find(
    (account) => account.emailAddress === emailEntered
  );

  if (emailEntered === "admin" && passwordEntered === "admin") {
    hideAllExcept(rightAccounts);
    document.querySelector("main").style.display = "flex";
    document.querySelector("header").style.display = "block";
  } else if (
    selectedAccount === null ||
    selectedAccount === undefined ||
    selectedAccount === ""
  ) {
    alert("The email does not have an account");
  } else {
    if (selectedAccount.password !== passwordEntered) {
      alert("Incorrect password");
      return;
    } else {
      currentAccount = selectedAccount;
      hideAllExcept(rightFullAccountDetails);

      document.querySelector("main").style.display = "flex";
      document.querySelector(".left").style.display = "none";
      document.querySelector(".right-container").style.height = "1400px";
      document.querySelector(".right-container").style.overflowY = "none";

      document.querySelector(".account-number p").textContent =
        currentAccount.accountNumber.match(/.{1,4}/g).join("-");
      document.querySelector(".last-name p").textContent =
        currentAccount.fullName.lastName;
      document.querySelector(".first-name p").textContent =
        currentAccount.fullName.firstName;
      document.querySelector(".middle-name p").textContent =
        currentAccount.fullName.middleName;
      if (currentAccount.fullName.suffixName === "") {
        document.querySelector(".suffix p").textContent = "N/A";
      } else {
        document.querySelector(".suffix p").textContent =
          currentAccount.fullName.suffixName;
      }
      document.querySelector(".complete-name p").textContent =
        getFullName(currentAccount);
      document.querySelector(".email-address p").textContent =
        currentAccount.emailAddress;
      document.querySelector(".password p").textContent =
        currentAccount.password;
      document.querySelector(".balance p").textContent = currentAccount.balance;

      showAccountActivity();
    }
  }
});

document.querySelector(".signup-button").addEventListener("click", (e) => {
  userCreateAccount = true;
  hideAllExcept(rightCreateAccount);

  document.querySelector("main").style.display = "block";
  document.querySelector(".left").style.display = "none";
  rightCreateAccount.style.margin = "1rem auto";
  rightCreateAccount.style.width = "800px";
});

document
  .getElementById("initial-accounts")
  .addEventListener("click", setFirstAccounts);

renderArrayToTable(accounts);
hideAllExcept(loginDiv);
