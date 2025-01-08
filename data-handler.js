// Function to render a table row based on the provided configuration
function DataTable(config) {
  if (config.apiUrl !== undefined) {
    let response = getData(config.apiUrl);
    response.then((response) => {
      let tableName = config.parent.slice(1);
      let targetTable = document.getElementById(tableName);
      let addItemModalWindow = getModalWindow(config, tableName);
      targetTable.innerHTML =
        addItemModalWindow +
        `
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
          `<td class="response-td"><button data-id="${key}" class="btn btn-remove" onclick="deleteItem('${config.apiUrl}', '${tableName}', this)">Видалити</button></td>\n`
        );

        return `<tr class="response-tr" id="${
          tableName + "-" + key
        }">\n${row.join("")}</tr>\n`;
      })
      .join("")}
    </tbody>
    </table>`;
      addModalListener(tableName);
      addFormListener(tableName, config);
    });
  }
}

// Creates a modal window with a form for adding new items to the table, using config for dynamic field generation
function getModalWindow(config, tableName) {
  return `
  <button class="btn btn-add" id="btnAdd${tableName}">Додати</button>
  <div id="addModal${tableName}" class="modal">
    <div class="modal-content">
      <span class="close ${tableName}">&times;</span>
      <form id="${tableName}-form">
      <table>
        <tbody>
        ${config.columns
          .map(
            (column) => `
          <tr>
          <td class="add-title">${column.title}</td>
          <td class="add-title">${getElementForItem(
            column.input,
            column.name,
            column.title,
            column.value
          )}</td>
          </tr>
          `
          )
          .join("")}
        </tbody>
      </table>
      </form>
    </div>
  </div>
  `;
}

// Adds a listener to handle form submission on pressing Enter, validating required fields,
// collecting form data, and sending it as a JSON POST request to the provided API URL.
function addFormListener(tableName, config) {
  document
    .getElementById(`${tableName}-form`)
    .addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        const requiredFields = this.querySelectorAll(
          "input[required], select[required], textarea[required]"
        );

        let allFilled = true;
        requiredFields.forEach((field) => {
          if (!field.value.trim()) {
            allFilled = false;
            field.style.borderColor = "red";
          } else {
            field.style.borderColor = "";
          }
        });

        if (allFilled) {
          const formData = new FormData(this);
          let object = {};

          formData.forEach((value, key) => {
            const inputElement = this.querySelector(`[name="${key}"]`);

            if (inputElement.type === "number") {
              object[key] = value.trim() !== "" ? parseFloat(value) : null;
            } else {
              object[key] = value;
            }
          });

          let json = JSON.stringify(object);

          fetch(config.apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          })
            .then((response) => {
              response.json();
              if (response.ok) {
                let modal = document.getElementById("addModal" + tableName);
                modal.style.display = "none";
                DataTable(config);
              }
            })
            .then((data) => {
              console.log("Success:", data);
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        }
      }
    });
}

// Generates form input elements (e.g., text inputs, selects) based on the provided configuration, supporting both single and multiple inputs.
function getElementForItem(
  elementInput,
  elementName,
  columnLabel,
  parrentName
) {
  if (Array.isArray(elementInput)) {
    return elementInput
      .map((input) => {
        if (input.type === "select") {
          return `
            <label for="${elementName}">${input.label}</label>
            <select name="${input.name}">
              ${input.options
                .map((option) => `<option value="${option}">${option}</option>`)
                .join("")}
            </select>
          `;
        } else {
          return `
    ${
      input.label !== columnLabel
        ? `<label for="${input.name}">${input.label || ""}</label>`
        : ""
    }
    <input type="${input.type}" name="${input.name}" ${
            input.required ? "required" : ""
          } />
  `;
        }
      })
      .join("");
  } else {
    return `
      <input type="${elementInput.type}" name="${
      elementInput.name || parrentName
    }" ${elementInput.required ? "required" : ""} />
    `;
  }
}

// Adds event listeners to open and close the modal window for a specific table, handling clicks on the open button, close button, and outside the modal.
function addModalListener(tableName) {
  let modal = document.getElementById("addModal" + tableName);
  let btn = document.getElementById("btnAdd" + tableName);
  let span = document.getElementsByClassName("close " + tableName)[0];

  btn.onclick = function () {
    modal.style.display = "block";
  };
  span.onclick = function () {
    modal.style.display = "none";
  };
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });
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
    { title: "Ім’я", value: "name", input: { type: "text", required: true } },
    {
      title: "Прізвище",
      value: "surname",
      input: { type: "text", required: true },
    },
    {
      title: "Вік",
      value: (user) => getAge(user.birthday),
      input: { type: "date", name: "birthday", required: true },
    },
    {
      title: "Фото",
      value: (user) =>
        `<img src="https://i.pravatar.cc/50?img=${user.id}" alt="${user.name} ${user.surname}"/>`,
      input: { type: "text", name: "avatar", required: true },
    },
  ],
  apiUrl: "https://mock-api.shpp.me/anemeritskyy/users",
};

DataTable(config1);

const config2 = {
  parent: "#productsTable",
  columns: [
    {
      title: "Назва",
      value: "title",
      input: { type: "text", required: true },
    },
    {
      title: "Ціна",
      value: (product) => `${product.price} ${product.currency}`,
      input: [
        { type: "number", name: "price", label: "Ціна", required: true },
        {
          type: "select",
          name: "currency",
          label: "Валюта",
          options: ["$", "€", "₴"],
          required: false,
        },
      ],
    },
    {
      title: "Колір",
      value: (product) => getColorLabel(product.color),
      input: { type: "color", name: "color" },
    },
  ],
  apiUrl: "https://mock-api.shpp.me/anemeritskyy/products",
};

DataTable(config2);
