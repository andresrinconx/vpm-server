import jwt, { JwtPayload } from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import Vet from "../models/Vet";

export interface ReqInterface extends Request {
  vet: any;
}

interface DecodedToken {
  id: string; // Asegúrate de que esto coincida con la estructura del token
}

export const chechAuth = async (req: ReqInterface, res: Response, next: NextFunction) => {
  let token: string;
  if (
    req.headers.authorization && 
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken; // decoded es como el valor del token, lo que se paso como id
      req.vet = await Vet.findById(decoded.id).select("-password -token -confirmed"); // el veterinario de la db que coincida con el id del decoded token, sin el password

      return next();
    } catch (error) {
      const e = new Error("Invalid token"); // el argumento es el message
      return res.status(403).json({ msg: e.message });
    }
  }

  if (!token) {
    const error = new Error("Not authorized");
    res.status(403).json({ msg: error.message });
  }
  
  next(); // sin esto la app se queda cargando y no va al siguiente middleware
  // middle viene de medio, es una funcion que se ejecuta en medio de otra
}