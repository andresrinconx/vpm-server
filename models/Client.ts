import mongoose from 'mongoose';

const ClientSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    symptoms: {
      type: String,
      required: true,
    },
    vet: {
      type: mongoose.Schema.Types.ObjectId, // los id de mongo (que son objetos)
      ref: 'Vet', // referencia a otro modelo (el modelo Vet)
    },
  },
  {
    timestamps: true, // crea dos campos, created at y updated at
  }
);

const Client = mongoose.model('Client', ClientSchema); // el schema define la estructura de los datos, el model es el que se encarga de interactuar con la base de datos
export default Client;