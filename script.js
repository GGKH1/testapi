document
  .getElementById("userForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Fetch the data from the form
    const name = document.getElementById("name").value;
    const height = document.getElementById("height").value;
    const weight = document.getElementById("weight").value;
    const birthdate = document.getElementById("birthdate").value;
    const sport = document.getElementById("sport").value;

    // Ensure birthdate is in the correct format (YYYY-MM-DD)
    const birthdateFormatted = new Date(birthdate).toISOString().split("T")[0];

    // Constructing the data to send to Airtable
    const userData = {
      fields: {
        Name: name,
        Height: parseInt(height),
        Weight: parseInt(weight),
        Birthdate: birthdateFormatted,
        Sport: sport,
      },
    };

    // Airtable API URL and Key (replace these with your actual values)
    const AIRTABLE_URL =
      "https://api.airtable.com/v0/appmOmH0VOO66YSx2/tblkZ8XuPGQASO3tx";
    const API_KEY =
      "Bearer patMmgGa6EFs3mlih.9a8183901a6ace97f263f3d8c4003bdd4405cdb9ed131913fe77a2a5d2aa6e7b";

    // Send the data to Airtable using fetch
    fetch(AIRTABLE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: API_KEY,
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Display the data to the user
        const resultDiv = document.getElementById("result");
        resultDiv.innerHTML = `
        <p class="text-green-600 font-bold">Your data has been submitted successfully!</p>
        <p>Name: ${name}</p>
        <p>Height: ${height} cm</p>
        <p>Weight: ${weight} kg</p>
        <p>Birth Date: ${birthdateFormatted}</p>
        <p>Sport: ${sport}</p>
        ${generateTrainingPlan(sport)}
      `;
      })
      .catch((error) => {
        console.error("Error:", error);
        // If there's a response from Airtable, log the details
        if (error.response) {
          error.response.json().then((errorDetails) => {
            console.error("Airtable Error Details:", errorDetails);
            document.getElementById(
              "result"
            ).innerHTML = `<p class="text-red-600">Error: ${errorDetails.message}</p>`;
          });
        } else {
          document.getElementById("result").innerHTML =
            '<p class="text-red-600">There was an error submitting your data.</p>';
        }
      });
  });

// Function to list records from Airtable
function listRecords(AIRTABLE_URL, API_KEY) {
  fetch(AIRTABLE_URL, {
    method: "GET",
    headers: {
      Authorization: API_KEY,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      // Process and display the records
      console.log(data.records);
      const resultDiv = document.getElementById("result");
      resultDiv.innerHTML = data.records
        .map(
          (record) => `
          <p>${record.fields.Name}: ${record.fields.Height} cm</p>
      `
        )
        .join("");
    })
    .catch((error) => {
      console.error("Error:", error);
      document.getElementById(
        "result"
      ).innerHTML = `<p class="text-red-600">There was an error retrieving records: ${error.message}</p>`;
    });
}

// Call the function to list records
listRecords();

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
