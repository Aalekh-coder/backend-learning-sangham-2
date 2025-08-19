const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379",
});

// event lister
client.on("error", (error) => console.log("Redis client error occured"));

async function redisDataStrucutures() {
  try {
    client.connect();

    // string => SET, GET, MSET, MGET,

    // await client.set("user:name", "Aalekh");
    // const name = await client.get("user:name");
    // console.log(name);

    // await client.mSet([
    //   "user:email",
    //   "aalekh@gmail",
    //   "user:age",
    //   "21",
    //   "user:country",
    //   "India",
    // ]);
    // const [email, age, country] = await client.mGet([
    //   "user:email",
    //   "user:age",
    //   "user:country",
    // ]);

    // console.log(email, age, country);

    // list  -> Lpush, Rpush, Lrang, Lpop, Rpop

    await client.lPush("notes", ["note 1", "note 2", "note 3"]);

    const extractAllNotes = await client.lRange("notes", 0, -1);
    console.log(extractAllNotes);

    const firstNote = await client.lPop("notes");
    console.log(firstNote);
  } catch (error) {
  } finally {
    client.quit();
  }
}

redisDataStrucutures();
