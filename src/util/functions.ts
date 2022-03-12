import fs from "fs";
import path from "path";

export function createScreenFile(name: string) {
  create(path.resolve('./dist/screen'))
  fs.writeFile("./dist/screen/test.ts", 'console.log("hola nene!!")', (error) => {
    if (error) throw error;
  });
}

function create(filePath: string) {
  const condition = fs.existsSync(filePath)
  console.log({ condition, filePath, next: path.dirname(filePath) })
  if (condition) return true;
  create(path.dirname(filePath))
  fs.mkdirSync(filePath)
  // fs.mkdirSync(filePath)
  console.log('---------')
}
