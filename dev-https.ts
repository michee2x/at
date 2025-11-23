import https from "https";
import { parse } from "url";
import next from "next";
import fs from "fs";

const dev = true;
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync("C:/dev/tools/localhost-key.pem"),
  cert: fs.readFileSync("C:/dev/tools/localhost.pem"),
};

const port = 3000;

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      const parsedUrl = parse(req.url || "", true);
      handle(req, res, parsedUrl);
    })
    .listen(port, () => {
      console.log(`> Next.js HTTPS server running at https://localhost:${port}`);
    });
});
