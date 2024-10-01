const AIRTABLE_URL =
  "https://api.airtable.com/v0/appmOmH0VOO66YSx2/tblkZ8XuPGQASO3tx";
const API_KEY =
  "Bearer patMmgGa6EFs3mlih.9a8183901a6ace97f263f3d8c4003bdd4405cdb9ed131913fe77a2a5d2aa6e7b";

// Function to get form data
function getFormData() {
  const name = document.getElementById("name").value;
  const height = document.getElementById("height").value;
  const weight = document.getElementById("weight").value;
  const birthdate = document.getElementById("birthdate").value;
  const sport = document.getElementById("sport").value;

  const birthdateFormatted = new Date(birthdate).toISOString().split("T")[0];

  return {
    fields: {
      Name: name,
      Height: parseInt(height),
      Weight: parseInt(weight),
      Birthdate: birthdateFormatted,
      Sport: sport,
    },
  };
}

// Show athlete list when form is submitted
document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const userData = getFormData();

    // Send the data to Airtable using fetch
    fetch(AIRTABLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY,
      },
      body: JSON.stringify({ records: [userData] }),
    })
      .then((response) => response.json())
      .then((data) => {
        const { fields } = userData;

        // Add athlete to the list on the left side
        const athleteList = document.getElementById("athlete-list");
        const listItem = document.createElement("li");
        listItem.classList.add(
          "bg-gray-300",
          "mb-4",
          "p-2",
          "rounded",
          "cursor-pointer"
        );
        listItem.innerHTML = `
        <div class="flex justify-between">
          <span>${fields.Name}</span>
          <div>
            <span class="cursor-pointer edit-icon" data-name="${
              fields.Name
            }" data-id="${data.records[0].id}">✏️</span>
            <span class="cursor-pointer delete-icon" data-id="${
              data.records[0].id
            }">❌</span>
          </div>
        </div>
        <div class="athlete-details hidden mt-2">
          <p>Height: ${fields.Height} cm</p>
          <p>Weight: ${fields.Weight} kg</p>
          <p>Birthdate: ${fields.Birthdate}</p>
          <p>Sport: ${fields.Sport}</p>
          ${generateTrainingPlan(fields.Sport)}
        </div>
      `;
        athleteList.appendChild(listItem);

        // Transition effect
        document.getElementById("athleteList").classList.remove("hidden");

        // Clear form fields
        document.getElementById("userForm").reset();

        // Toggle athlete details on name click
        listItem.querySelector("span").addEventListener("click", function () {
          const details = listItem.querySelector(".athlete-details");
          details.classList.toggle("hidden");
        });

        // Edit and Delete actions
        setupEditAndDeleteActions();
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById("result").innerHTML =
          '<p class="text-red-600">There was an error submitting your data.</p>';
      });
  });

// Generate a training plan based on the sport
function generateTrainingPlan(sport) {
  let plan = "";
  switch (sport) {
    case "Swimming":
      plan = "<p>Training Plan: 30 minutes swimming daily.</p>";
      break;
    case "Running":
      plan = "<p>Training Plan: Run 5km three times a week.</p>";
      break;
    case "Shooting":
      plan =
        "<p>Training Plan: Practice shooting accuracy for 1 hour twice a week.</p>";
      break;
    case "Horse_riding":
      plan =
        "<p>Training Plan: Horse riding practice for 1 hour every weekend.</p>";
      break;
    case "Fencing":
      plan =
        "<p>Training Plan: Fencing drills for 45 minutes on alternate days.</p>";
      break;
    default:
      plan = "<p>Training Plan: No specific plan available.</p>";
  }
  return plan;
}

// Setup Edit and Delete actions
function setupEditAndDeleteActions() {
  // Edit
  document.querySelectorAll(".edit-icon").forEach((icon) => {
    icon.addEventListener("click", function () {
      const name = this.dataset.name;
      if (confirm(`Do you want to edit athlete ${name}?`)) {
        // Edit logic here (redirect back to form with data pre-filled)
        const id = this.dataset.id;

        // Fetch record by ID and prefill the form
        fetch(`${AIRTABLE_URL}/${id}`, {
          method: "GET",
          headers: {
            Authorization: API_KEY,
          },
        })
          .then((response) => response.json())
          .then((data) => {
            const athlete = data.fields;
            document.getElementById("name").value = athlete.Name;
            document.getElementById("height").value = athlete.Height;
            document.getElementById("weight").value = athlete.Weight;
            document.getElementById("birthdate").value = athlete.Birthdate;
            document.getElementById("sport").value = athlete.Sport;
          });
      }
    });
  });

  // Delete
  document.querySelectorAll(".delete-icon").forEach((icon) => {
    icon.addEventListener("click", function () {
      const name = this.previousElementSibling.dataset.name;
      if (confirm(`Do you want to delete athlete ${name}?`)) {
        const id = this.dataset.id;
        // Delete from Airtable
        fetch(`${AIRTABLE_URL}/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: API_KEY,
          },
        })
          .then((response) => {
            if (response.ok) {
              // Remove athlete from the list
              this.closest("li").remove();
              if (!document.querySelector("#athlete-list").childElementCount) {
                document.getElementById("athleteList").classList.add("hidden");
              }
            } else {
              console.error("Error deleting athlete");
            }
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
}
