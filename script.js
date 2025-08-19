const API_URL = "https://jsonplaceholder.typicode.com/users";
const fetchBtn = document.getElementById("fetch-btn");
const table = document.getElementById("users-table");
const tableBody = document.getElementById("table-body");

fetchBtn.addEventListener("click", async () => {
  fetchBtn.disabled = true;
  fetchBtn.textContent = "Cargando...";
  
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
    const users = await response.json();
    renderTable(users);
    table.classList.remove("hidden");
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    tableBody.innerHTML = `<tr><td colspan="4">No se pudieron cargar los datos</td></tr>`;
    table.classList.remove("hidden");
  } finally {
    fetchBtn.textContent = "Buscar usuarios";
    fetchBtn.disabled = false;
  }
});

function renderTable(users) {
  tableBody.innerHTML = users.map(user => `
    <tr>
      <td>${user.id}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.address.city}</td>
    </tr>
  `).join("");
}
