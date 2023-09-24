import express from 'express'
import { addClient, getClients, getClient, updateClient, deleteClient } from '../controllers/clientController'
import { chechAuth } from '../middleware/authMiddleware'

const router = express.Router()

router.route('/')
  .post(chechAuth, addClient)
  .get(chechAuth, getClients)

router.route('/:id')
  .get(chechAuth, getClient)
  .put(chechAuth, updateClient)
  .delete(chechAuth, deleteClient)

export default router