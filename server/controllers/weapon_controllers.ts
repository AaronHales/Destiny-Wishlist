import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { authMiddleware } from "../middleware/authentication";
import { WeaponRepository } from "../repositories/weapon_respository";

// /weapons/...
export const buildWeaponController = (weaponRepository: WeaponRepository) => {
  const router = Router();

  router.put("/", async (req, res) => {
    const weapon = await weaponRepository.updateWeapon(req.body);
    res.json({weapon});
  });

//   router.get("/", async (req, res) => {
//     const weapon = await weaponRepository.getWeaponById()
//   })

  return router;
}

