const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379",
});

// event lister
client.on("error", (error) => console.log("Redis client error occured"));

async function testRedis() {
  try {
    await client.connect();
    console.log("connected to redis");

    await client.set("name", "aalekh");

    const extractValue = await client.get("name");

    console.log(extractValue);

    const deleteCount = await client.del("name");
    console.log("deleteCount", deleteCount);

    const extractUpdatedValue = await client.get("name");
    console.log('extractUpdatedValue',extractUpdatedValue);

    // await client.set("count",'100');
    // const incrementCount = await client.incr("count");
    // console.log('incrementCount',incrementCount);

    await client.set("count",'100');
    const decrementCount = await client.decr("count");
    console.log('decrementCount',decrementCount);

    await client.set();
  } catch (error) {
    console.error(error);
  } finally {
    await client.quit();
  }
}

testRedis();
