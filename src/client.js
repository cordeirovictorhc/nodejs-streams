import axios from "axios";
import { Transform, Writable } from "stream";

const url = "http://localhost:3000";

async function consume() {
  const response = await axios({
    url,
    method: "get",
    responseType: "stream",
  });

  return response.data;
}

const stream = await consume();

stream
  .pipe(
    new Transform({
      transform(chunk, enc, cb) {
        const item = JSON.parse(chunk);
        const myNumber = /\d+/.exec(item.name)[0];

        const name =
          myNumber % 2 === 0 ? `${item.name} é par` : `${item.name} é ímpar`;

        item.name = name;

        cb(null, JSON.stringify(item)); // callback(error, result)
      },
    })
  )
  .pipe(
    new Writable({
      write(chunk, enc, cb) {
        console.log("Já chegou o disco voador", chunk.toString());
        cb();
      },
    })
  );
