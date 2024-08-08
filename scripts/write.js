import { writeFile } from "fs";
import { join } from "path";
import { cwd } from "process";

function write(json) {
  const path = join(cwd(), "src", "presidents.json");

  writeFile(path, json, "utf8", function (error) {
    if (error) {
      console.log("----------");
      console.log(error);
      console.log("----------");

      return;
    }

    console.log("File written successfully");
  });
}

export { write };
