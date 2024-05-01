import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { Job, Queue, QueueEvents } from 'bullmq';
config();

const mainPath = 'https://www.bungie.net/Platform'
const queue = new Queue(
  "unimportant work",
  {
    connection: {
      host: "localhost",
      port: 6379
    },
  }
);


const queueEvents = new QueueEvents('unimportant work');


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
  queue.defaultJobOptions.delay = 0;
  queue.defaultJobOptions.removeOnComplete = true;
  queue.resume();
  queueEvents.on('completed', async ({jobId}) => {
    const job = await Job.fromId(queue, jobId)
    console.log('returnvale %s', job?.returnvalue);
    console.log(await queue.getActiveCount())
  })
  
  queue.on('resumed', () => console.log('resumed'));
}

async function getWeapons() {
  // let hadErrror = false
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
      // hadErrror = true
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
          // hadErrror = true
        });
      // console.log(second);
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
  // if (hadErrror) {
  //   return getWeapons()
  // }
  // else {
    console.log('done getting weapons')
    return Promise.resolve(weapohs);
  // }
}

function getWeaponData(weapon: { [x: string]: any; }) {
  const API_KEY = process.env.API_KEY
  console.log('adding worker');
  let worker = queue.add("weaponFetch", {weapon: weapon, API_KEY: API_KEY});
  // queue.resume();
  // worker.then(async job => {
  //   if (await job.isFailed()) {
  //     console.log(job.failedReason)
  //     job.retry();
  //   }
  //   else {
  //     console.log(job.getState());
  //   }

  // }).catch(error => {
  //   console.log(error)
  // })
}

main()
  .then(async () => {
    getWeapons()
      .then(async result => {
        // for (let i = 0; i > 10; i++) {
        //   getWeaponData(result[i]);
        // }
        // result.forEach(element => {
        //   getWeaponData(element)
        // });
        // queue.getJobs().then(jobs => {
        //   jobs.forEach(job => {
        //     console.log(job.getState());
        //   })
        // })
        await queue.add("print nums", { num: 1 })
        queue.resume();
      })
    // await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
    