import {Request, Response} from 'express';
import Vet from '../models/Vet';
import { generateId, generateJWT } from '../helpers';
import { ReqInterface } from '../middleware/authMiddleware';
import emailSignUp from '../helpers/emailSignUp';
import emailForgotPassword from '../helpers/emailForgotPassword';

export const register = async (req: Request, res: Response) => { // req es la petición del cliente, res es la respuesta que le enviamos
  const { email, name } = req.body;
  
  // Duplicate email
  const userExists = await Vet.findOne({ email }); // busca uno por email
  if (userExists) {
    const error = new Error('User already exists');
    return res.status(400).json({ msg: error.message });
  }

  try {
    const vet = new Vet(req.body);
    const savedVet = await vet.save(); // guardar en la base de datos

    // Send email
    emailSignUp({
      email,
      name,
      token: savedVet.token
    })

    res.json({ savedVet });
  } catch (error) {
    console.log(error)
  }
};

export const profile = (req: ReqInterface, res: Response) => {
  const { vet } = req; // vet lo estamos almacenando en el middleware authMiddleware

  res.json({ profile: vet });
};

export const confirm = async (req: Request, res: Response) => {
  const { token } = req.params;

  const confirmUser = await Vet.findOne({ token }); // confirmuser tiene la estructura del modelo, por eso mas abajo se asigna la propiedad a true, porque es un Boolean

  if (!confirmUser) {
    const error = new Error('Invalid token');
    return res.status(404).json({ msg: error.message });
  }

  try {
    confirmUser.token = null; // se modifica el token para que nadie mas lo pueda usar
    confirmUser.confirmed = true; // se confirma el usuario (vet)
    await confirmUser.save();
    res.json({ msg: 'Confirmed' });
  } catch (error) {
    console.log(error)
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // comprobar si existe
  const user = await Vet.findOne({ email }); // usuario no deja de ser el documento de la base de datos, un objeto, en este caso, el que coincida por email
  if (!user) {
    const error = new Error('User not found');
    return res.status(404).json({ msg: error.message });
  }

  // Comprobar si esta confirmado
  if (!user.confirmed) {
    const error = new Error('User not confirmed');
    return res.status(401).json({ msg: error.message });
  }

  // Auth
  if (await user.comprobePassword(password)) {
    // JWT
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateJWT(user.id)
    });
  } else {
    const error = new Error('Incorrect password');
    return res.status(401).json({ msg: error.message });
  }
}

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body; // req.body es el body (objeto json) que pasa el usuario (la peticion del cliente)

  const existsVet = await Vet.findOne({ email });
  if (!existsVet) {
    const error = new Error('User not found');
    return res.status(400).json({ msg: error.message });
  }

  try {
    existsVet.token = generateId();
    await existsVet.save();

    // Send email
    emailForgotPassword({
      email,
      name: existsVet.name,
      token: existsVet.token
    })

    res.json({ msg: 'We\'ve sent an email with the instructions' });
  } catch (error) {
    console.log(error)
  }
}

export const comprobeToken = async (req: Request, res: Response) => {
  const { token } = req.params; // son los parametros de la ruta, lo que se coloca despues de los dos puntos en el router

  const validToken = await Vet.findOne({ token });

  if (validToken) {
    // valid token
    res.json({ msg: 'Valid Token' })
  } else {
    const error = new Error('Invalid token');
    return res.status(400).json({ msg: error.message });
  }
}

export const newPassword = async (req: Request, res: Response) => {
  
  const { token } = req.params;
  const { password } = req.body;

  const vet = await Vet.findOne({ token });
  if (!vet) {
    const error = new Error('There was an error');
    return res.status(400).json({ msg: error.message });
  }

  try {
    vet.token = null;
    vet.password = password;
    await vet.save();
    res.json({ msg: 'Password changed successfully' })
  } catch (error) {
    console.log(error)
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  const vet = await Vet.findById(req.params.id);
  if (!vet) {
    const error = new Error('There was an error');
    return res.status(400).json({ msg: error.message });
  }

  const { email } = req.body
  if (vet.email !== req.body.email) {
    const emailExist = await Vet.findOne({ email });
    if (emailExist) {
      const error = new Error('Email already exists');
      return res.status(400).json({ msg: error.message });
    }
  }

  // Update
  try {
    vet.name = req.body.name || vet.name;
    vet.email = req.body.email || vet.email;
    vet.web = req.body.web || vet.web;
    vet.phone = req.body.phone || vet.phone;

    const vetSaved = await vet.save();
    res.json({ vetSaved })
  } catch (error) {
    console.log(error)
  }
}

export const updatePassword = async (req: ReqInterface, res: Response) => {
  // read data
  const { id } = req.vet;
  const { password, password2 } = req.body

  // exists
  const vet = await Vet.findById(id);
  if (!vet) {
    const error = new Error('There was an error');
    return res.status(400).json({ msg: error.message });
  }

  // comprobe password
  if (await vet.comprobePassword(password)) {
    // update password
    vet.password = password2;
    await vet.save();
    res.json({ msg: 'Password updated successfully' })
  } else {
    const error = new Error('Incorrect password');
    return res.status(400).json({ msg: error.message });
  }
}