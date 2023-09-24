import { Request, Response} from 'express'
import Client from '../models/Client'
import { ReqInterface } from '../middleware/authMiddleware'

export const addClient = async (req: ReqInterface, res: Response) => {
  const client = new Client(req.body) // req.body instancia un objeto de tipo Client con los datos que se pasen
  client.vet = req.vet._id

  try {
    const savedClient = await client.save() // a savedClient se le agrega el id por mongo, etc etc
    res.json({ savedClient });
  } catch (error) {
    console.log(error)
  }
}

export const getClients = async (req: ReqInterface, res: Response) => {
  const clients = await Client.find() // es un arreglo, filtrado
    .where('vet') // filtrar por el campo vet
    .equals(req.vet) // que sea igual al id del veterinario que está en el token

  res.json(clients)
}

export const getClient = async (req: ReqInterface, res: Response) => {
  const { id } = req.params
  const client = await Client.findById(id)

  if (!client) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (client.vet._id.toString() !== req.vet._id.toString()) { // para evaluar strings en vez de objetos de id
    return res.json({ msg: 'Invalid action' })
  }

  res.json(client)
}

export const updateClient = async (req: ReqInterface, res: Response) => {
  const { id } = req.params
  const client = await Client.findById(id)

  if (!client) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (client.vet._id.toString() !== req.vet._id.toString()) { // para evaluar strings en vez de objetos de id
    return res.json({ msg: 'Invalid action' })
  }

  // update
  client.name = req.body.name || client.name
  client.owner = req.body.owner || client.owner
  client.email = req.body.email || client.email
  client.date = req.body.date || client.date
  client.symptoms = req.body.symptoms || client.symptoms

  try {
    const updatedClient = await client.save()
    res.json({ updatedClient })
  } catch (error) {
    console.log(error)
  }
}

export const deleteClient = async (req: ReqInterface, res: Response) => {
  const { id } = req.params
  const client = await Client.findById(id)

  if (!client) {
    return res.status(404).json({ msg: 'Not found' })
  }

  if (client.vet._id.toString() !== req.vet._id.toString()) { // para evaluar strings en vez de objetos de id
    return res.json({ msg: 'Invalid action' })
  }

  try {
    await client.deleteOne()
    res.json({ msg: 'Client deleted' })
  } catch (error) {
    console.log(error)
  }
} 