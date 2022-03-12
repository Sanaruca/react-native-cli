import fs from "fs";
import path from "path";

export function createScreenFile(name: string) {
  fs.writeFile("./screen/test.ts", 'console.log("hola nene!!")', (error) => {
    if (error) throw error;
  });
}
