import fs from "fs";
import path from "path";

export function createScreenFile(name: string) {
  create(__dirname)
  fs.writeFile("./screen/test.ts", 'console.log("hola nene!!")', (error) => {
    if (error) throw error;
  });
}

function create(filePath: string) {
  const condition = fs.existsSync(path.dirname(filePath))
  console.log({condition})
}
