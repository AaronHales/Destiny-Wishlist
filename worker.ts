import { Job, Worker } from "bullmq";

console.log("Worker running...");

const worker = new Worker("unimportant work", async ({ data }) => {
  let sum = 0;
  for(let i  = 0; i < data.num * 100; i++) {
    console.log(i);
    sum += i;
  }
  console.log(sum);
  return sum
}, {
  connection: {
    port: 6379,
    host: "localhost"
  },
  autorun: true,
});

worker.on('completed', async (job: Job, returnvalue: any) => {
  await worker.disconnect()
  return returnvalue
});

worker.on('failed', (job: Job | undefined, error: Error, prev: string) => {
  return error;
})

worker.on('ready', () =>
  worker.run()
);