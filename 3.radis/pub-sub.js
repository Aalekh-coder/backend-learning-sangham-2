// pub-sub
// -> publiser -> send -> channel -> subsciber will consumer

const radis = require("redis");

const client = radis.createClient({
  url: "redis://localhost:6379",
});

client.on("error", (error) => {
  console.log("redis client error occured", error);
});

async function testAdditionFeatures() {
  try {
    await client.connect();

    // const subscriber = client.duplicate();
    // await subscriber.connect();

    // await subscriber.subscribe("dummy-channel",(message,channel)=>{
    //   console.log(`Received message from ${channel}: ${message}`);
    // })

    // public message to the dummy channel

    // await client.publish("dummy-channel","some dummy data from publisher")
    // await client.publish("dummy-channel","Some new message against from the publiser");

    // await new Promise((resolve)=> setTimeout(resolve,1000));

    // await subscriber.unsubscribe("dummy-channel");
    // await subscriber.quit()

    // pipelineing & transactions

    // const multi = client.multi();
    // multi.set("key-transaction1", "value1");
    // multi.set("key-transaction2", "value2");
    // multi.get("key-transaction1");
    // multi.get("key-transaction2");

    // const result = await multi.exec();
    // console.log(result);

    // const pipeline = client.multi();
    // multi.set("key-pipeline1", "value1");
    // multi.set("key-pipeline2", "value2");
    // multi.get("key-pipeline1");
    // multi.get("key-pipeline2");

    // const pipelineResult = await multi.exec();
    // console.log(pipelineResult);

    // batch data operation

    // const pipelineOne = client.multi();
    // for (let i = 0; i < 1000; i++) {
    //   pipeline.set(`user:${i}:action`, `Action ${i}`);
    // }

    // await pipelineOne.exec();

    // const dummyExample = client.multi();
    // multi.decrBy("account:1234:balance", 100);
    // multi.incrBy("account:0000:balance", 100);

    // const finalResult = await multi.exec();

    // const cartExample = client.multi();
    // multi.hIncrBy("cart:1234", "item_count", 1);
    // multi.hIncrBy("cart:1234", "price", 10);

    // await multi.exec()

    console.log("Performace test");
    console.time("without pipeline");

    for (let i = 0; i < 1000; i++) {
      await client.set(`user ${i}`, `user_value${i}`);
    }

    console.timeEnd("without pipelining");

    console.log("with pipepling")

    const bigPipeline = client.multi();

     for (let i = 0; i < 1000; i++) {
       bigPipeline.set(`user_pipeline_key ${i}`, `user_pipeline_value${i}`);
    }

    await bigPipeline.exec()

    console.timeEnd("with pipelining")
  } catch (error) {
    console.error(error);
  } finally {
    client.quit();
  }
}

testAdditionFeatures();
