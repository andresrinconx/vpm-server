import express from "express"
import { register, profile, confirm, login, forgotPassword, comprobeToken, newPassword, updateProfile ,updatePassword} from "../controllers/vetController"
import { chechAuth } from "../middleware/authMiddleware"

const router = express.Router()
// define una ruta HTTP GET o PSOT para la URL (el primer argumento), cuando se visita la ruta se ejecuta una funcion (el segundo argumento)
// public area
router.post("/", register)
router.get("/confirm/:token", confirm) // los dos puntos parametro dinamico
router.post("/login", login)
router.post("/forgot-password", forgotPassword)
router.route("/forgot-password/:token")
  .get(comprobeToken)
  .post(newPassword)

// private area
router.get("/profile", chechAuth, profile) // cuando se ejecuta chechAuth se va a la funcion profile, ya que dentro de chechAuth tenemos next()
router.put('/profile/:id', chechAuth, updateProfile)
router.put('/update-password', chechAuth, updatePassword)

export default router