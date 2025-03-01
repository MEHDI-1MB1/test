import express from "express"
import { pool } from "../app.js"

const router = express.Router()

// Créer une nouvelle équipe
router.post("/", async (req, res) => {
  try {
    const { teamName, members } = req.body

    // Vérifier que l'équipe a exactement 4 membres
    if (!members || members.length !== 4) {
      return res.status(400).json({
        success: false,
        message: "Une équipe doit avoir exactement 4 membres",
      })
    }

    // Vérifier qu'il y a exactement un chef d'équipe
    const chefCount = members.filter((member) => member.role === "chef").length
    if (chefCount !== 1) {
      return res.status(400).json({
        success: false,
        message: "Une équipe doit avoir exactement un chef",
      })
    }

    // Extraire les emails pour vérifier les doublons
    const emails = members.map((member) => member.email)

    // Vérifier s'il y a des doublons dans l'équipe actuelle
    const uniqueEmails = new Set(emails)
    if (uniqueEmails.size !== emails.length) {
      return res.status(400).json({
        success: false,
        message: "Des membres en double ont été détectés dans cette équipe",
      })
    }

    // Vérifier si un membre existe déjà dans une autre équipe
    const connection = await pool.getConnection()

    try {
      await connection.beginTransaction()

      // Vérifier les membres existants
      const [existingMembers] = await connection.query("SELECT email FROM team_members WHERE email IN (?)", [emails])

      if (existingMembers.length > 0) {
        const duplicateEmail = existingMembers[0].email
        return res.status(400).json({
          success: false,
          message: `Le membre avec l'email ${duplicateEmail} fait déjà partie d'une autre équipe`,
        })
      }

      // Insérer l'équipe
      const [teamResult] = await connection.query("INSERT INTO teams (name) VALUES (?)", [teamName])

      const teamId = teamResult.insertId

      // Insérer les membres
      for (const member of members) {
        await connection.query(
          `INSERT INTO team_members 
          (team_id, role, nom, prenom, email, telephone, filiere, cne, cin, membre_appinsciences) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            teamId,
            member.role,
            member.nom,
            member.prenom,
            member.email,
            member.telephone,
            member.filiere,
            member.cne,
            member.cin,
            member.membreAppinsciences,
          ],
        )
      }

      await connection.commit()

      res.status(201).json({
        success: true,
        message: "Équipe créée avec succès",
        teamId,
      })
    } catch (error) {
      await connection.rollback()
      throw error
    } finally {
      connection.release()
    }
  } catch (error) {
    console.error("Erreur lors de la création de l'équipe:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la création de l'équipe",
      error: error.message,
    })
  }
})

// Récupérer toutes les équipes
router.get("/", async (req, res) => {
  try {
    const [teams] = await pool.query(`
      SELECT t.id, t.name, COUNT(tm.id) as member_count 
      FROM teams t
      LEFT JOIN team_members tm ON t.id = tm.team_id
      GROUP BY t.id
    `)

    res.json({
      success: true,
      teams,
    })
  } catch (error) {
    console.error("Erreur lors de la récupération des équipes:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des équipes",
      error: error.message,
    })
  }
})

// Récupérer une équipe spécifique avec ses membres
router.get("/:id", async (req, res) => {
  try {
    const teamId = req.params.id

    // Récupérer les informations de l'équipe
    const [teams] = await pool.query("SELECT id, name FROM teams WHERE id = ?", [teamId])

    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Équipe non trouvée",
      })
    }

    // Récupérer les membres de l'équipe
    const [members] = await pool.query(
      `SELECT id, role, nom, prenom, email, telephone, filiere, cne, cin, membre_appinsciences 
       FROM team_members 
       WHERE team_id = ?`,
      [teamId],
    )

    res.json({
      success: true,
      team: {
        ...teams[0],
        members,
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'équipe:", error)
    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération de l'équipe",
      error: error.message,
    })
  }
})

export default router

