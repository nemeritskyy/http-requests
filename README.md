# Practice Task - "Http requests"

Welcome!
This library displays JSON data from HTTP request using configuration files with the following parameters:

## Configuration Parameters

### `parent`:
- **Description**: ID of the HTML table.
- **Type**: `string`

### `columns`:
- **Description**: Array of column configurations.
- **Type**: `array`

Each column can have:

- **`title`**:
  - **Description**: Column header text.
  - **Type**: `string`

- **`value`**:
  - **Description**: Field name or function to format data.
  - **Type**: `string | function`

- **`input`** (optional):
  - **Description**: Input field configuration(s).
  - **Type**: `object | array`

  Input properties:
  
  - **`type`**:
    - **Description**: Input type (e.g., `text`, `number`, `select`).
    - **Type**: `string`

  - **`name`**:
    - **Description**: Name attribute of the input.
    - **Type**: `string`

  - **`label`** (optional):
    - **Description**: Label text for the input.
    - **Type**: `string`

  - **`options`** (for `select`):
    - **Description**: Dropdown options.
    - **Type**: `array`

  - **`required`** (optional):
    - **Description**: Mark input as required.
    - **Type**: `boolean`

### `apiUrl`:
- **Description**: URL for fetching JSON data.
- **Type**: `string`

### Config example
```bash
{
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
}
```
### Result
```bash
<table class="response-table">
	<thead>
		<tr class="response-tr">
			<th class="response-th">Ім’я</th>
			<th class="response-th">Прізвище</th>
			<th class="response-th">Вік</th>
			<th class="response-th">Фото</th>
		</tr>
	</thead>
	<tbody>
		<tr class="response-tr">
			<td class="response-td">Kamryn</td>
			<td class="response-td">Bergnaum</td>
			<td class="response-td">0 years, 8 months, 9 days</td>
			<td class="response-td"><img src="https://i.pravatar.cc/50?img=1"
					alt="Kamryn Bergnaum"></td>
		</tr>
		<tr class="response-tr">
			<td class="response-td">Sadye</td>
			<td class="response-td">White</td>
			<td class="response-td">0 years, 3 months, 1 days</td>
			<td class="response-td"><img src="https://i.pravatar.cc/50?img=2"
					alt="Sadye White"></td>
		</tr>
		<tr class="response-tr">
			<td class="response-td">Terrence</td>
			<td class="response-td">Wolff</td>
			<td class="response-td">0 years, 3 months, 16 days</td>
			<td class="response-td"><img src="https://i.pravatar.cc/50?img=3"
					alt="Terrence Wolff"></td>
		</tr>
	</tbody>
</table>
```
This repository was created for practice, is a showcase of my skills, experience, and theirs improving.

## Technologies Used

HTML, JS, CSS

To view the website locally:
Clone this repository:

```bash
git clone https://github.com/nemeritskyy/http-requests.git
```