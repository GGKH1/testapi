// Airtable API URL and Key
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

// Submit form (default)
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
        // Display the data to the user
        const resultDiv = document.getElementById("result");
        const { fields } = userData;
        resultDiv.innerHTML = `
          <p class="text-green-600 font-bold">Your data has been submitted successfully!</p>
          <p>Name: ${fields.Name}</p>
          <p>Height: ${fields.Height} cm</p>
          <p>Weight: ${fields.Weight} kg</p>
          <p>Birth Date: ${fields.Birthdate}</p>
          <p>Sport: ${fields.Sport}</p>
          ${generateTrainingPlan(fields.Sport)}
        `;
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
    case "swimming":
      plan = "<p>Training Plan: 30 minutes swimming daily.</p>";
      break;
    case "running":
      plan = "<p>Training Plan: Run 5km three times a week.</p>";
      break;
    case "shooting":
      plan =
        "<p>Training Plan: Practice shooting accuracy for 1 hour twice a week.</p>";
      break;
    case "horse_riding":
      plan =
        "<p>Training Plan: Horse riding practice for 1 hour every weekend.</p>";
      break;
    case "fencing":
      plan =
        "<p>Training Plan: Fencing drills for 45 minutes on alternate days.</p>";
      break;
    default:
      plan = "<p>Training Plan: No specific plan available.</p>";
  }
  return plan;
}

// Add athlete event listener
document
  .getElementById("addAthlete")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const userData = getFormData();

    // Send the data to Airtable to create a new athlete record
    fetch(AIRTABLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY,
      },
      body: JSON.stringify({ records: [userData] }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to add athlete");
        }
        return response.json();
      })
      .then((data) => {
        document.getElementById(
          "result"
        ).innerHTML = `<p class="text-green-600 font-bold">Athlete added successfully!</p>`;
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById(
          "result"
        ).innerHTML = `<p class="text-red-600">Error adding athlete.</p>`;
      });
  });

// Delete athlete (by name) event listener
document
  .getElementById("deleteAthlete")
  .addEventListener("click", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;

    // Fetch records to find the matching athlete by name
    fetch(`${AIRTABLE_URL}?filterByFormula={Name}='${name}'`, {
      method: "GET",
      headers: {
        Authorization: API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.records.length > 0) {
          const recordId = data.records[0].id;

          // Delete the athlete (record) by record ID
          fetch(`${AIRTABLE_URL}/${recordId}`, {
            method: "DELETE",
            headers: {
              Authorization: API_KEY,
            },
          })
            .then((response) => {
              if (response.ok) {
                document.getElementById(
                  "result"
                ).innerHTML = `<p class="text-green-600 font-bold">Athlete deleted successfully!</p>`;
              } else {
                throw new Error("Failed to delete athlete");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
              document.getElementById(
                "result"
              ).innerHTML = `<p class="text-red-600">Error deleting athlete.</p>`;
            });
        } else {
          document.getElementById(
            "result"
          ).innerHTML = `<p class="text-red-600">Athlete not found.</p>`;
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        document.getElementById(
          "result"
        ).innerHTML = `<p class="text-red-600">Error fetching athlete records.</p>`;
      });
  });
