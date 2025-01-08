// Function to render a table row based on the provided configuration
function DataTable(config) {
  if (config.apiUrl !== undefined) {
    let response = getData(config.apiUrl);
    response.then((response) => {
      let tableName = config.parent.slice(1);
      let targetTable = document.getElementById(tableName);
      targetTable.innerHTML = `
    <table class="response-table">
    <thead>
        <tr class="response-tr">
            ${config.columns
              .map(
                (element) => `<th class="response-th">${element.title}</th>\n`
              )
              .join("")}
              <th class="response-th">Дії</th>
        </tr>
    </thead>
    <tbody>
    ${Object.entries(response.data)
      .map(([key, obj], index) => {
        const row = [];
        obj.id = key; // add id to every obj

        row.push(
          ...config.columns.map((column) => {
            if (typeof column.value === "function") {
              return `<td class="response-td">${
                column.value(obj) || ""
              }</td>\n`;
            } else {
              return `<td class="response-td">${
                obj[column.value] || ""
              }</td>\n`;
            }
          })
        );
        row.push(
          `<td class="response-td"><button data-id="${key}" class="btn-remove" onclick="deleteItem('${config.apiUrl}', '${tableName}', this)">Видалити</button></td>\n`
        );

        return `<tr class="response-tr" id="${
          tableName + "-" + key
        }">\n${row.join("")}</tr>\n`;
      })
      .join("")}
    </tbody>
    </table>`;
    });
  }
}

// Asynchronous function to delete an item from the server and remove its corresponding row from the table if the request is successful
function deleteItem(url, table, btn) {
  let itemId = btn.getAttribute("data-id");
  fetch(url + "/" + itemId, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        // Remove the table row associated with the deleted item
        document.getElementById(table + "-" + itemId).remove();
      } else {
        console.error("Failed to delete the item:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error during deletion:", error);
    });
}

// Asynchronous function to fetch data from a given URL and return the parsed JSON response
async function getData(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

// Function to calculate the age in years, months, and days from a given date
function getAge(fromDate) {
  const today = new Date();
  const birthDate = new Date(fromDate);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (months < 0) {
    years--;
    months += 12;
  }

  if (days < 0) {
    months--;
    const previousMonth = (today.getMonth() - 1 + 12) % 12;
    const daysInPreviousMonth = new Date(
      today.getFullYear(),
      previousMonth + 1,
      0
    ).getDate();
    days += daysInPreviousMonth;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return `${years} years, ${months} months, ${days} days`;
}

// Function to generate an HTML string for a div element with a specified background color and text color
function getColorLabel(color) {
  return `<div style="background-color: ${color}; color: ${checkColor(
    color
  )}" class="color">${color}</div>`;
}

// Function to determine the appropriate text color (black or white) based on the background color
function checkColor(color) {
  return /^#([defc])/i.test(color) ? "#000000" : "#ffffff";
}

const config1 = {
  parent: "#usersTable",
  columns: [
    { title: "Ім’я", value: "name" },
    { title: "Прізвище", value: "surname" },
    { title: "Вік", value: (user) => getAge(user.birthday) },
    {
      title: "Фото",
      value: (user) =>
        `<img src="https://i.pravatar.cc/50?img=${user.id}" alt="${user.name} ${user.surname}"/>`,
    },
  ],
  apiUrl: "https://mock-api.shpp.me/anemeritskyy/users",
};

DataTable(config1);

const config2 = {
  parent: "#productsTable",
  columns: [
    { title: "Назва", value: "title" },
    {
      title: "Ціна",
      value: (product) => `${product.price} ${product.currency}`,
    },
    { title: "Колір", value: (product) => getColorLabel(product.color) },
  ],
  apiUrl: "https://mock-api.shpp.me/anemeritskyy/products",
};

DataTable(config2);
