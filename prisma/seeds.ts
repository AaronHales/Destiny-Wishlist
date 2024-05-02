import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';
config();

const mainPath = 'https://www.bungie.net/Platform'


async function main() {
  await prisma.user.upsert({
    where: {
      id: 1,
    },
    create: {
      firstName: 'SITE',
      lastName: 'ADMIN',
      email: process.env.ADMIN_EMAIL!!,
      password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD!!),
    },
    update: {
      email: process.env.ADMIN_EMAIL!!,
      password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD!!),
    }
  })
  // TODO: put default data in the database
  console.log(process.env);
}

async function getWeapons() {
  console.log('getting weapons')
  let first1;
  const weapohs = [];
  await fetch(mainPath+'/Destiny2/Manifest/', {
    method: 'GET',
    headers: {
      'X-API-KEY': process.env.API_KEY!!
    },
    signal: AbortSignal.timeout(60000)
  })
    .then(response => response.json())
    .then(json => first1 = json)
    .catch(error => {
      console.error(error)
    });
  if (first1) {
    if (first1['ErrorStatus'] == 'Success' && first1['Response']) {
      const urlNew = first1['Response']['jsonWorldContentPaths']['en'];
      const second = await fetch('https://www.bungie.net'+urlNew, {
          method: 'GET',
          headers: {
              'X-API-KEY': process.env.API_KEY!!
          },
          signal: AbortSignal.timeout(60000)
      })
        .then(response => response.json())
        .then(json => {return json})
        .catch(error => {
          console.error(error)
          console.error(error.timeout)
        });
      if (second['DestinyInventoryItemDefinition']) {
        const newSecond = second['DestinyInventoryItemDefinition']
        for (const key in newSecond) {
          const value = newSecond[key];
          if (newSecond.hasOwnProperty(key)) {
            if (value['itemType'] && value['itemType'] == 3) {
              weapohs.push(value);
            }
          }
        }
      }
    }
  }
    console.log('done getting weapons')
    return Promise.resolve(weapohs);
}

async function getWeaponData(weapon: { [x: string]: any; }) {
  let damageTypes: { name: string; description: string; icon: string; }[] = []
  let equipmentSlot = {
    name: "",
    description: "",
    ammoType: -1,
  };

  await getWeaponDamageTypes(weapon).then(response => damageTypes = response)
  await getWeaponEquipSlot(weapon).then(response => equipmentSlot = response)
  let weaponData: {
    name: string; flavorText: string; icon: string; waterMarkIcon: any; weaponType: string; rarity: string; weaponHash: string;
    damageTypes: {
      name: string;
      description: string;
      icon: string;
    }[]; 
    equipmentSlot: {
      name: string;
      description: string;
      ammoType: number;
    }; 
  } = {
    weaponHash: weapon['hash']+'',
    name: weapon['displayProperties']['name'],
    flavorText: weapon['flavorText'],
    icon: weapon['displayProperties']['icon'],
    waterMarkIcon: weapon['iconWaterMark'], 
    weaponType: weapon['itemTypeDisplayName'],
    rarity: weapon['inventory']['tierTypeName'],
    damageTypes: damageTypes,
    equipmentSlot: equipmentSlot,
  }
  await addToDataBase(weaponData)
}

async function getWeaponDamageTypes(weapon: { [x: string]: any; }) {
  let damageTypes: { name: string; description: string; icon: string; }[] = []
  // Get Damage types
  if (weapon['damageTypeHashes']) {
    console.log('\tgetting damage types')
    for (const hash in weapon['damageTypeHashes']) {
      await fetch(mainPath+'/Destiny2/Manifest/DestinyDamageTypeDefinition/'+hash, {
        method: 'GET',
        headers: {
          'X-API-KEY': process.env.API_KEY!!
        },
        signal: AbortSignal.timeout(60000)
      })
        .then(response => response.json())
        .then(json => {
          if (json['ErrorStatus'] == 'Success' && json['Response']) {
            damageTypes.push({
            name: json['Response']['DisplayProperties']['name'],
            description: json['Response']['DisplayProperties']['description'],
            icon: json['Response']['DisplayProperties']['icon']
            })
          }
        })
        .catch(async error => {
          console.error(error)
          getWeaponDamageTypes(weapon).then(result => damageTypes = result)
      })
    }
  }
  return Promise.resolve(damageTypes);
}

async function getWeaponEquipSlot(weapon: { [x: string]: { [x: string]: any; }; }) {
  // Get equipmetSlot
  let equipmentSlot: {
    name: string,
    description: string,
    ammoType: number,
  } = {
    name: '',
    description: '',
    ammoType: -1
  };
  if (weapon['equippingBlock']) {
    console.log('\tgetting equipment data')
    await fetch(mainPath+'/Destiny2/Manifest/DestinyEquipmentSlotDefinition/'+weapon['equippingBlock']['equipmentSlotTypeHash'], {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.API_KEY!!
      },
      signal: AbortSignal.timeout(60000)
    })
      .then(response => response.json())
      .then(json => {
        if (json['ErrorStatus'] == 'Success' && json['Response']) {
          equipmentSlot = {
            name: json['Response']['displayProperties']['name'],
            description: json['Response']['displayProperties']['description'],
            ammoType: weapon['equippingBlock']['ammoType'],
          }
        }
      })
      .catch(error => {
        console.error(error)
        console.log(weapon)
        getWeaponEquipSlot(weapon).then(result => equipmentSlot = result);
      })
  }
  return Promise.resolve(equipmentSlot)
}

async function addToDataBase(weaponData: {weaponHash: string; name: any; flavorText: any; icon: any; waterMarkIcon: any; weaponType: any; rarity: any; damageTypes: { name: any; description: any; icon: any; }[]; equipmentSlot: { name: any; description: any; ammoType: any; };}) {
  console.log('adding to database')
  await prisma.weapon.create({
    data: {
      weaponHash: weaponData.weaponHash,
      name: weaponData.name,
      flavorText: weaponData.flavorText,
      icon: weaponData.icon,
      waterMarkIcon: weaponData.waterMarkIcon,
      weaponType: weaponData.weaponType,
      rarity: weaponData.rarity,
      damageTypes: {
        createMany: {
          data: weaponData.damageTypes
        } 
      },
      equipmentSlot: {
        create: {
          name: weaponData.equipmentSlot.name,
          description: weaponData.equipmentSlot.description,
          ammmoType: weaponData.equipmentSlot.ammoType,
        }
      },
    },
  })
}

main()
  .then(async () => {
    getWeapons()
      .then(async result => {
        result.forEach(async element => {
          await getWeaponData(element);
        });
      })
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
    