import "dotenv/config";
import { app } from "./app.js";

app.listen(process.env.PORT, (error) => {
  if (error) {
    console.log(`server is not running due to :${error}`);
  } else {
    console.log(`server is running on port ${process.env.PORT}!`);
  }
});
