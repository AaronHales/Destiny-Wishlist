// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();
// import { config } from 'dotenv';
// import * as bcrypt from 'bcryptjs';
// import e, { response } from 'express';
// config();

// const mainPath = 'https://www.bungie.net/Platform'


// async function main() {
//   await prisma.user.upsert({
//     where: {
//       id: 1,
//     },
//     create: {
//       firstName: 'SITE',
//       lastName: 'ADMIN',
//       email: process.env.ADMIN_EMAIL!!,
//       password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD!!),
//       profile: {
//         create: {}
//       }
//     },
//     update: {
//       email: process.env.ADMIN_EMAIL!!,
//       password_hash: bcrypt.hashSync(process.env.ADMIN_PASSWORD!!),
//     }
//   })
//   // TODO: put default data in the database
//   console.log(process.env);
// }

// async function getWeapons() {
//   console.log('getting weapons')
//   let first1;
//   const weapohs = [];
//   await fetch(mainPath+'/Destiny2/Manifest/', {
//     method: 'GET',
//     headers: {
//       'X-API-KEY': '2a684d18d1fb439cafe67d3f84dc95e6'
//     }
//   })
//     .then(response => response.json())
//     .then(json => first1 = json)
//     .catch(error => console.error(error));
//   if (first1) {
//     if (first1['ErrorStatus'] == 'Success' && first1['Response']) {
//       const urlNew = first1['Response']['jsonWorldContentPaths']['en'];
//       const second = await fetch('https://www.bungie.net'+urlNew, {
//           method: 'GET',
//           headers: {
//               'X-API-KEY': process.env.API_KEY!!
//           }
//       })
//         .then(response => response.json())
//         .then(json => {return json})
//         .catch(error => console.error(error));
//       // console.log(second);
//       if (second['DestinyInventoryItemDefinition']) {
//         const newSecond = second['DestinyInventoryItemDefinition']
//         for (const key in newSecond) {
//           const value = newSecond[key];
//           if (newSecond.hasOwnProperty(key)) {
//             if (value['itemType'] && value['itemType'] == 3) {
//               weapohs.push(value);
//             }
//           }
//         }

//       }
//     }
//   }
//   console.log('done getting weapons')
//   return Promise.resolve(weapohs);
// }

// async function addWeapon(weapon: { [x: string]: any; }) {
//   console.log('creating weapon in database')
//   const damageTypes = []
//   let equipmentSlot: {};
//   const stats = [];
//   const sockets = [];

//   // Get Damage types
//   if (weapon['damageTypeHashes']) {
//     console.log('\tgetting damage types')
//     for (const hash in weapon['damageTypeHashes']) {
//       await fetch(mainPath+'/Destiny2/Manifest/DestinyDamageTypeDefinition/'+hash, {
//         method: 'GET',
//         headers: {
//           'X-API-KEY': process.env.API_KEY!!
//         }
//       })
//         .then(response => response.json())
//         .then(json => {
//           if (json['ErrorStatus'] == 'Success' && json['Response']) {
//            damageTypes.push({
//             name: json['Response']['DisplayProperties']['name'],
//             description: json['Response']['DisplayProperties']['description'],
//             icon: 'https://bungie.net' + json['Response']['DisplayProperties']['icon']
//            })
//           }
//         })
//         .catch(error => console.error(error))
//     }
//   }

//   // Get equipmetSlot
//   if (weapon['equipmentBlock']) {
//     console.log('\tgetting equipment data')
//     await fetch(mainPath+'/Destiny2/Manifest/DestinyEquipmentSlotDefinition/'+weapon['equipmentBlock']['equipmentSlotTypeHash'], {
//       method: 'GET',
//       headers: {
//         'X-API-KEY': process.env.API_KEY!!
//       }
//     })
//       .then(response => response.json())
//       .then(json => {
//         if (json['ErrorStatus'] == 'Success' && json['Response']) {
//           equipmentSlot = {
//             name: json['Response']['displayProperties']['name'],
//             description: json['Response']['displayProperties']['description'],
//             ammoType: weapon['equipmentBlock']['ammoType'],
//           }
//         }
//       })
//       .catch(error => console.error(error))
//   }

//   // Get stats
//   if (weapon['stats'] && weapon['stats']['stats']) {
//     weapon['stats']['stats'].forEach(async (key: { [x: string]: any; })  => {
//     let newEndPoint = key['statHash']
//     console.log('\tgetting weapon stats')
//     await fetch(mainPath+'/Destiny2/Manifest/DestinyStatDefinition/'+newEndPoint, {
//       method: 'GET',
//       headers: {
//         'X-API-KEY': process.env.API_KEY!!
//       }
//     })
//       .then(response => response.json())
//       .then(json => {
//         if (json['ErrorStatus'] == 'Success' && json['Response']) {
//           stats.push({
//             name: json['Response']['displayProperties']['name'],
//             description: json['Response']['displayProperties']['description'],
//             value: weapon['stats']['stats']['value'],
//           })
//         }
//       })
//       .catch(error => console.error(error))
//     })
//   }
  
//   // Get sockets
//   if (weapon['sockets'] && weapon['sockets']['socketCategories'] && weapon['socket']['socketEntries']) {
//     console.log('\tgetting sockets')
//     weapon['socket']['socketCateogry'].forEach(async (category: { [x: string]: any[]; }) => {
//       let temp: {};
//       let categoryString = ''
//       let categoryDescription = '';
//       await fetch(mainPath+'/Destiny2/Manifest/DestinySocketCategoryDefinition/'+category['socketCategoryHash'], {
//         method: 'GET',
//         headers: {
//           'X-API-KEY': process.env.API_KEY!!,
//         }
//       })
//         .then(response => response.json())
//         .then(json => {
//           if (json['ErrorStatus'] == 'Success' && json['Response']) {
//             categoryString = json['Response']['displayProperties']['name']
//             categoryDescription = json['Response']['displayProperties']['description']
//           }
//         })
//         .catch(error => console.error(error));
//       if (categoryDescription != "WEAPON COSMETICS") {
//         let perkTempArray: {}[] = [];
//         category['socketIndexes'].forEach(async socketEntries => {
//           let perkTemp = {
//             icon: null,
//             name: "",
//             description: "",
//             stats: new Array(),

//           };
//           console.log('\t\tgetting socket entries')
//           await fetch(mainPath+'/Destiny2/Manifest/DestinyPlugSetDefinition/'+weapon['socket']['socketEntries'][socketEntries]['reusablePlugSetHash'], {
//             method: 'GET',
//             headers: {
//               'X-API-KEY': process.env.API_KEY!!,
//             }
//           })
//             .then(response => response.json())
//             .then(json => {
//               if (json['ErrorStatus'] == 'Success' && json['Response']) {
//                 json['Response']['reuseablePlugItems'].forEach(async (entry: { [x: string]: any; }) => {
//                   if (entry["currentlyCanRoll"] == true) {
//                     console.log('\t\t\tgetting socket entry data')
//                     await fetch(mainPath+'/Destiny2/Manifest/DestinyIventoryItemDefinition/'+entry['plugItemHash'], {
//                       method: 'GET',
//                       headers: {
//                         'X-API-KEY': process.env.API_KEY!!
//                       }
//                     })
//                       .then(response => response.json())
//                       .then(perkJson => {
//                         perkTemp['icon'] = perkJson['Response']['displayProperties']['icon']
//                         perkTemp['name'] = perkJson['Response']['displayProperties']['name']
//                         perkTemp['description'] = perkJson['Response']['displayProperties']['description']
//                         if (perkJson['Response']['investmentsStats']) {
//                           perkJson['Response']['investmentsStats'].forEach(async (stat: { [x: string]: any; }) => {
//                             console.log('\t\t\t\tgetting stat data')
//                             await fetch(mainPath+'Destiny2/Manifest/DestinyStatDefinition/'+stat['statTypeHash'], {
//                               method: 'GET',
//                               headers: {
//                                 'X-API-KEY': process.env.API_KEY!!,
//                               }
//                             })
//                               .then(response => response.json())
//                               .then(statJson => {
//                                 if (statJson['ErrorStatus'] == 'Success' && statJson['Response']) {
//                                   perkTemp.stats.push({
//                                     name: statJson['Response']['displayProperties']['name'],
//                                     description: statJson['Response']['displayProperties']['description'],
//                                     value: stat['value'],
//                                   })
//                                 }
//                               })
//                               .catch(error => console.error(error));
//                           });
//                         }
//                         perkTempArray.push(perkTemp);
//                       })
//                       .catch(error => console.error(error));
//                   }
//                 })
//               }
//               temp = {
//                 category: categoryString,
//                 categoryDescription: categoryDescription,
//                 perks: perkTempArray,
                
//               }
//               sockets.push(temp);
//             })
//             .catch(error => console.error(error));
//         });
//       }
//     });
//   }
//   await prisma.
// }

// main()
//   .then(async () => {
//     getWeapons()
//       .then(result => {
//         result.forEach(element => {
//           addWeapon(element)
//         });
//       })
//     // await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })
    