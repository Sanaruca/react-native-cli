import fs from "fs";
import path from "path";

export function createScreenFile(name: string) {
  create(path.resolve('./dist/screen'))
  fs.writeFile("./screen/test.ts", 'console.log("hola nene!!")', (error) => {
    if (error) throw error;
  });
}

function create(filePath: string) {
  const condition = fs.existsSync(filePath)
  if(!condition) create(path.dirname(filePath))
  console.log({condition, filePath, filePath_dirname: path.dirname(filePath)})
  // fs.mkdirSync(filePath)
  console.log('---------')
}
