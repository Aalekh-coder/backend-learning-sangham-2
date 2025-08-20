const redis = require("redis");

const client = redis.createClient({
  url: "redis://localhost:6379",
});

// event lister
client.on("error", (error) => console.log("Redis client error occured"));

async function redisDataStrucutures() {
  try {
    client.connect();

    // 1. string => SET, GET, MSET, MGET,

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

    // 2. list  -> Lpush, Rpush, Lrang, Lpop, Rpop

    // await client.lPush("notes", ["note 1", "note 2", "note 3"]);

    // const extractAllNotes = await client.lRange("notes", 0, -1);
    // console.log(extractAllNotes);

    // const firstNote = await client.lPop("notes");
    // console.log(firstNote);

    // const remainingNotes = await client.lRange("notes", 0, -1);
    // console.log(remainingNotes,"remainingNotes")

    //  3.sets -> SADD SMEMERS, SISMEMEBER, SREM

    // await client.sAdd("user:nickName",["aalekh","dev","sia"]);
    // const extractUserNicknames = await client.sMembers("user:nickName");

    // console.log(extractUserNicknames);

    // const isAalekhIsOneOfUserNickName = await client.sIsMember("user:nickName","aalekh");
    // console.log(isAalekhIsOneOfUserNickName);

    // await client.sRem("user:nickName","xyz");

    // const getUpdatedUserNickNames = await client.sMembers("user:nickName");
    // console.log(getUpdatedUserNickNames);

    // 4.sorted sets

    // i .  ZADD, ZRANGE, ZRANK, ZREM

    await client.zAdd("cart", [
      {
        score: 100,
        value: "Cart 1",
      },
      {
        score: 2000,
        value: "Cart 2",
      },
      {
        score: 300,
        value: "Cart 3",
      },
    ]);
    // const getTopCartItems = await client.zRange("cart",0,-1);
    // console.log(getTopCartItems);

    // const extractAllCartItemsWithScore = await client.zRangeWithScores("cart",0,-1);
    // console.log(extractAllCartItemsWithScore);

    // const cartTwoRank = await client.zRank("cart","Cart 2");

    // console.log(cartTwoRank);

    // 5. hashed -> MSET, HGET, HGETALL, HDEL

    // await client.hSet("product:1", {
    //   name: "Product 1",
    //   description: "Product one description",
    //   rating: "5",
    // });

    // const getProductRating = await client.hGet("product:1", "rating");
    // console.log(getProductRating);

    // const getProductDetails = await client.hGetAll("product:1");
    // console.log(getProductDetails)

  } catch (error) {
  } finally {
    client.quit();
  }
}

redisDataStrucutures();
