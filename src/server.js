import http from "http";
import { Readable } from "stream";
import { v4 } from "uuid";

// função generator que entrega dados sob demanda
function* run() {
  for (let i = 1; i <= 100; i++) {
    const data = {
      id: v4(),
      name: `Victor-${i}`,
    };

    yield data;
  }
}

async function handler(req, res) {
  // fonte de dados -> readable stream
  const readable = new Readable({
    read() {
      for (const data of run()) {
        console.log(`sending`, data);
        this.push(JSON.stringify(data));
      }

      this.push(null); // interrompe readable; fim dos dados
    },
  });

  // cada pipe é um processo diferente; a medida que os dados vão chegando, vão sendo passados aos pipes
  readable.pipe(res); // tudo o que chegar é passado para response
}

http
  .createServer(handler)
  .listen(3000)
  .on("listening", () => console.log(`server running at port 3000`));
