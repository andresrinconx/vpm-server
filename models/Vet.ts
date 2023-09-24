import mongoose from 'mongoose'
import { generateId } from '../helpers'
import bcrypt from 'bcrypt'

interface Vet {
  _id: any
  name: string
  password: string
  email: string
  phone: string | null
  web: string | null 
  token: string
  confirmed: boolean
  comprobePassword: (passwordForm: string) => Promise<boolean>
}

const VetSchema = new mongoose.Schema<Vet>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  phone: {
    type: String,
    default: null,
    trim: true,
  },
  web: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    default: function () {
      return generateId()
    },
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
})

VetSchema.pre('save', async function (next) {
  // modificaciones antes de guardar en la base de datos
  if (!this.isModified('password')) {
    // si el password no ha sido modificado
    next() // no vuelve a hashear el password si ya esta hasheado
  }

  const salt = await bcrypt.genSalt(10)
  // sobreescribe el password
  this.password = await bcrypt.hash(this.password, salt) // this es el objeto actual, el Schema
})

VetSchema.methods.comprobePassword = async function (passwordForm: string) {
  return await bcrypt.compare(passwordForm, this.password) // compara el password del form y el password hasheado
  // return true o false
}

const Vet = mongoose.model('Vet', VetSchema)
export default Vet