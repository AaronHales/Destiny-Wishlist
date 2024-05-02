import { PrismaClient} from "@prisma/client";
import bcrypt from "bcryptjs";

export type UpdateWeaponPayload = {
  id: number,
  hash: string,
  baseStats: {
    stat: {
      name: string,
      description: string,
      value: number,
    },
  }[],
  sockets: {
    socketName: string,
    perks: {
      name: string,
      description: string,
      icon: string,
      stats: {
        name: string,
        description: string,
        value: number,
      }[],
    }[]
  }[],
}

export class WeaponRepository {
  private db: PrismaClient
  private static instance: WeaponRepository
  constructor(db: PrismaClient) {
    this.db = db;
  }

  static getInstance(db?: PrismaClient): WeaponRepository {
    if (!this.instance) {
      this.instance = new WeaponRepository(db!!);
    }
    return this.instance;
  }


  async updateWeapon({id, baseStats, sockets}: UpdateWeaponPayload) {
    return this.db.weapon.update({
      where: {
        id: id
      },
      data: {
        sockets: {
          createMany: {
            data: sockets
          }
        },
        baseStats: {
          create: {
            stats: {
              createMany: {
                data: baseStats.map(stats => stats.stat)
              }
            }
          }
        }
      }
    });
  }

  async getWeaponById(id: number) {
    return this.db.weapon.findUnique({
      where: {
        id: id
      },
      include: {
        damageTypes: {
          where: {
            weaponId: id,
          },
        },
        equipmentSlot: {
          where: {
            weaponId: id,
          },
        },
        baseStats:{
          where: {
            weaponId: id
          },
        },
        sockets: {
          where: {
            weaponId: id,
          },
        }
      }
    });
  }
}