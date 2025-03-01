// Exemple de code client pour interagir avec l'API
// Ce code peut être intégré dans votre site web

// Fonction pour créer une équipe
async function createTeam(teamData) {
  try {
    const response = await fetch("http://votre-api.com/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teamData),
    })

    const data = await response.json()

    if (!response.ok) {
      // Afficher le message d'erreur
      alert(`Erreur: ${data.message}`)
      return null
    }

    // Succès
    alert("Équipe créée avec succès!")
    return data
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe:", error)
    alert("Une erreur est survenue lors de la création de l'équipe")
    return null
  }
}

// Fonction pour récupérer toutes les équipes
async function getAllTeams() {
  try {
    const response = await fetch("http://votre-api.com/api/teams")
    const data = await response.json()

    if (!response.ok) {
      console.error("Erreur:", data.message)
      return []
    }

    return data.teams
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error)
    return []
  }
}

// Exemple d'utilisation pour créer une équipe
document.getElementById("team-form").addEventListener("submit", async (e) => {
  e.preventDefault()

  // Récupérer les données du formulaire
  const teamName = document.getElementById("team-name").value

  // Récupérer les données du chef d'équipe
  const chefNom = document.getElementById("chef-nom").value
  const chefPrenom = document.getElementById("chef-prenom").value
  const chefEmail = document.getElementById("chef-email").value
  const chefTelephone = document.getElementById("chef-telephone").value
  const chefFiliere = document.getElementById("chef-filiere").value
  const chefCNE = document.getElementById("chef-cne").value
  const chefCIN = document.getElementById("chef-cin").value
  const chefAppinsciences = document.getElementById("chef-appinsciences").value === "true"

  // Récupérer les données des autres membres
  // Exemple pour le membre 1
  const membre1Nom = document.getElementById("membre1-nom").value
  const membre1Prenom = document.getElementById("membre1-prenom").value
  const membre1Email = document.getElementById("membre1-email").value
  const membre1Telephone = document.getElementById("membre1-telephone").value
  const membre1Filiere = document.getElementById("membre1-filiere").value
  const membre1CNE = document.getElementById("membre1-cne").value
  const membre1CIN = document.getElementById("membre1-cin").value
  const membre1Appinsciences = document.getElementById("membre1-appinsciences").value === "true"

  // Faire de même pour les membres 2 et 3...

  // Construire l'objet de données
  const teamData = {
    teamName,
    members: [
      {
        role: "chef", // Le premier membre est le chef d'équipe
        nom: chefNom,
        prenom: chefPrenom,
        email: chefEmail,
        telephone: chefTelephone,
        filiere: chefFiliere,
        cne: chefCNE,
        cin: chefCIN,
        membreAppinsciences: chefAppinsciences,
      },
      {
        role: "membre", // Les autres sont des membres réguliers
        nom: membre1Nom,
        prenom: membre1Prenom,
        email: membre1Email,
        telephone: membre1Telephone,
        filiere: membre1Filiere,
        cne: membre1CNE,
        cin: membre1CIN,
        membreAppinsciences: membre1Appinsciences,
      },
      // Ajouter les membres 2 et 3 ici avec role: 'membre'...
    ],
  }

  // Envoyer les données à l'API
  await createTeam(teamData)
})

// Exemple pour afficher les équipes existantes
async function displayTeams() {
  const teamsContainer = document.getElementById("teams-list")
  teamsContainer.innerHTML = ""

  const teams = await getAllTeams()

  teams.forEach((team) => {
    const teamElement = document.createElement("div")
    teamElement.className = "team-item"
    teamElement.innerHTML = `
      <h3>${team.name}</h3>
      <p>Nombre de membres: ${team.member_count}</p>
      <button onclick="viewTeamDetails(${team.id})">Voir détails</button>
    `

    teamsContainer.appendChild(teamElement)
  })
}

// Fonction pour voir les détails d'une équipe
async function viewTeamDetails(teamId) {
  try {
    const response = await fetch(`http://votre-api.com/api/teams/${teamId}`)
    const data = await response.json()

    if (!response.ok) {
      alert(`Erreur: ${data.message}`)
      return
    }

    // Afficher les détails de l'équipe (à implémenter selon votre interface)
    // Added function to display modal.  Replace with your actual modal display logic.
    function displayTeamDetailsModal(teamData) {
      // Your modal display logic here.  Example:
      const modal = document.getElementById("teamDetailsModal")
      modal.querySelector(".modal-title").textContent = teamData.name
      modal.querySelector(".modal-body").innerHTML = JSON.stringify(teamData, null, 2) // Replace with your actual data display
      modal.style.display = "block"
    }
    displayTeamDetailsModal(data.team)
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'équipe:", error)
    alert("Une erreur est survenue")
  }
}

