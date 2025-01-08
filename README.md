# Practice Task - "Data tables"

Welcome!
This library displays JSON data from HTTP request using configuration files with the following parameters:

- `parent` (HTML table ID)  
- `column.title` (column description)  
- `column.value` (name of the field or function)
- `apiUrl` (Url with JSON response)
### Config example
```bash
{
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