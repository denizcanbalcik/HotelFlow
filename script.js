// Speichert die Namen Mitarbeiter
const people = JSON.parse(localStorage.getItem("hotelflow-people")) || [
  "Anna",
  "Max",
  "Lisa",
  "Emre",
  "Sofia",
];
const statuses = ["Zu reinigen", "In Bearbeitung", "Gereinigt", "Bereit"];
const key = "hotelflow-demo-v1";
function initial() {
  return Array.from({ length: 30 }, (_, i) => ({
    number: 101 + Math.floor(i / 10) * 100 + (i % 10),
    floor: Math.floor(i / 10) + 1,
    status: statuses[i % 4],
    employee: people[i % 5],
  }));
}
let data;
try {
  data = JSON.parse(localStorage.getItem(key));
  //// // Verhindert, dass neue Zimmer beim Neuladen verloren gehen.
  if (!Array.isArray(data)) throw Error();
} catch {
  data = initial();
}
const $ = (id) => document.getElementById(id);
function save() {
  localStorage.setItem(key, JSON.stringify(data));
}
function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c])
  );
}
function render() {
  $("total").textContent = data.length;
  $("dirty").textContent = data.filter((x) => x.status === statuses[0]).length;
  $("progress").textContent = data.filter(
    (x) => x.status === statuses[1]
  ).length;
  $("complete").textContent = data.filter((x) =>
    [statuses[2], statuses[3]].includes(x.status)
  ).length;
  const q = $("search").value.trim(),
    f = $("filter").value;
  // Zeigt nur Zimmer der ausgewählten Etage an.
  const selectedFloor = $("floorFilter").value;
  $("rooms").innerHTML = data
    .filter(
      (x) =>
        String(x.number).includes(q) &&
        (!f || x.status === f) &&
        (!selectedFloor || x.floor === Number(selectedFloor))
    )
    .map(
      (x) =>
        `<tr>
    <td>
        <input type="checkbox" class="roomCheckbox" value="${x.number}">
    </td>
    <td><b>${x.number}</b></td><td>${x.floor}. OG</td><td><span class="pill ${
          // Checkbox zur Auswahl einzelner Zimmer.
          ["dirty", "progress", "done", "ready"][statuses.indexOf(x.status)]
        }">${escapeHtml(x.status)}</span></td><td><select data-room="${
          x.number
        }" data-field="employee">${people
          .map(
            (p) =>
              `<option ${x.employee === p ? "selected" : ""}>${escapeHtml(
                p
              )}</option>`
          )
          .join("")}</select></td><td><select data-room="${
          x.number
        }" data-field="status">${statuses
          .map(
            (s) =>
              `<option ${x.status === s ? "selected" : ""}>${escapeHtml(
                s
              )}</option>`
          )
          .join("")}</select></td><td><button onclick="editRoom(${x.number}
              
              )">Bearbeiten</button> 
<button onclick="deleteRoom(${x.number})">Löschen</button>
</td></tr>`
    )
    .join("");
}
$("rooms").addEventListener("change", (e) => {
  let s = e.target;
  if (!s.matches("select[data-room]")) return;
  let room = data.find((x) => x.number === Number(s.dataset.room));
  room[s.dataset.field] = s.value;
  save();
  render();
});
$("search").addEventListener("input", render);
$("filter").addEventListener("change", render);
$("floorFilter").addEventListener("change", () => {
  $("selectAllRooms").checked = false;
  render();
});
$("reset").addEventListener("click", () => {
  if (confirm("Alle Demo-Änderungen zurücksetzen?")) {
    data = initial();
    save();
    render();
  }
});
$("csv").addEventListener("click", () => {
  const lines = [
    ["Zimmer", "Etage", "Status", "Mitarbeiter"],
    ...data.map((x) => [x.number, x.floor, x.status, x.employee]),
  ];
  const csv =
    "\ufeff" +
    lines
      .map((row) =>
        row.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(";")
      )
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" })
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = "HotelFlow_Zimmerliste.csv";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});
render();
//um zimmer zu addieren
document
  .getElementById("roomForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const number = Number(document.getElementById("roomNumber").value);
    const floor = Number(document.getElementById("roomFloor").value);

    if (data.some((room) => room.number === number)) {
      alert("Diese Zimmernummer existiert bereits!");
      return;
    }

    data.push({
      number: number,
      floor: floor,
      status: "Zu reinigen",
      employee: "Anna",
    });

    save();
    render();
    this.reset();
  });
//bis hier

//// Löscht ein Zimmer und speichert die Änderung.
function deleteRoom(number) {
  if (!confirm("Zimmer wirklich löschen?")) return;

  data = data.filter((room) => room.number !== number);

  save();
  render();
}
// Ermöglicht das Bearbeiten von Zimmernummer und Etage.
// Speichert die Änderungen im Browser.

function editRoom(number) {
  // Bearbeitet Zimmernummer und Etage und speichert die Änderungen.
  const room = data.find((r) => r.number === number);
  if (!room) return;

  const inputNumber = prompt("Neue Zimmernummer:", room.number);
  if (inputNumber === null) return;

  const newNumber = Number(inputNumber);

  if (!Number.isInteger(newNumber) || newNumber <= 0) {
    alert("Ungültige Zimmernummer!");
    return;
  }

  if (data.some((r) => r.number === newNumber && r !== room)) {
    alert("Zimmernummer existiert bereits!");
    return;
  }

  const inputFloor = prompt("Neue Etage:", room.floor);
  if (inputFloor === null) return;

  const newFloor = Number(inputFloor);

  if (!Number.isInteger(newFloor) || newFloor < 1) {
    alert("Ungültige Etage!");
    return;
  }

  room.number = newNumber;
  room.floor = newFloor;

  save();
  render();
} // Fügt einen neuen Mitarbeiter hinzu.
document
  .getElementById("employeeForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("employeeName").value.trim();

    if (people.some((p) => p.toLowerCase() === name.toLowerCase())) {
      alert("Mitarbeiter existiert bereits!");
      return;
    }
    // Fehler behoben: Doppelte Ausführung beim Hinzufügen von Mitarbeitern verhindert.  people.push(name);
    //speichert auf localstorage (dauerhaft)
    people.push(name);
    localStorage.setItem("hotelflow-people", JSON.stringify(people));
    updateEmployeeList(); // Aktualisiert die Liste sofort. (zb neue hingezefügt aber sieht man nicht in der lister wenn mann direkt wieder löschen will)
    render();
    this.reset();
  });
// Entfernt Mitarbeiter ohne offene Zimmerzuweisung.
document
  .getElementById("deleteEmployee")
  .addEventListener("click", function () {
    // früher war const name = prompt("Welchen Mitarbeiter möchtest du löschen?"); // Das System verwendet den ausgewählten Mitarbeiter aus der Liste, statt den Namen manuell einzugeben
    const name = document.getElementById("employeeToDelete").value;
    if (!name) return;

    const index = people.findIndex(
      (p) => p.toLowerCase() === name.trim().toLowerCase()
    );

    if (index === -1) {
      alert("Mitarbeiter nicht gefunden!");
      return;
    }

    if (data.some((room) => room.employee === people[index])) {
      alert("Bitte zuerst die Zimmer einem anderen Mitarbeiter zuweisen!");
      return;
    }

    if (!confirm(people[index] + " wirklich löschen?")) return;

    //people.splice(index, 1);

    //localStorage.setItem("hotelflow-people", JSON.stringify(people));

    //render();
    people.splice(index, 1);

    localStorage.setItem("hotelflow-people", JSON.stringify(people));

    updateEmployeeList(); // Aktualisiert die Liste nach dem Löschen.
    render();
  });
// Aktualisiert die Mitarbeiterauswahlliste.
function updateEmployeeList() {
  const select = document.getElementById("employeeToDelete");

  select.innerHTML = '<option value="">Mitarbeiter auswählen</option>';

  people.forEach((name) => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });
}

updateEmployeeList();
// Wählt alle angezeigten Zimmer aus.
document
  .getElementById("selectAllRooms")
  .addEventListener("change", function () {
    document.querySelectorAll(".roomCheckbox").forEach((checkbox) => {
      checkbox.checked = this.checked;
    });
  });
// Aktualisiert den Status aller ausgewählten Zimmer.
document.getElementById("bulkUpdate").addEventListener("click", function () {
  const selectedRooms = Array.from(
    document.querySelectorAll(".roomCheckbox:checked")
  ).map((checkbox) => Number(checkbox.value));

  if (selectedRooms.length === 0) {
    alert("Bitte zuerst Zimmer auswählen!");
    return;
  }

  const newStatus = document.getElementById("bulkStatus").value;

  if (!confirm(`${selectedRooms.length} Zimmer auf "${newStatus}" setzen?`)) {
    return;
  }

  data.forEach((room) => {
    if (selectedRooms.includes(room.number)) {
      room.status = newStatus;
    }
  });

  save();
  document.getElementById("selectAllRooms").checked = false;
  render();
});
