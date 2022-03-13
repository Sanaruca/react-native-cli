import fs from "fs";
import path from "path";

export function createScreenFile(name: string) {
  create(path.resolve('./dist/screens'))
  // console.log({__dirname})
  const text = fs.readFileSync(path.join(__dirname, '/templates/screen-component-template.tsx'))
  .toString()
  .replace(/\$SCREEN_NAME\$/g, name)
  fs.writeFile(`./dist/screens/${name}-screen.tsx`, text, (error) => {
    if (error) throw error;
  });
}

function create(filePath: string) {
  const condition = fs.existsSync(filePath)
  // console.log({ condition, filePath, next: path.dirname(filePath) })
  if (condition) return true;
  create(path.dirname(filePath))
  fs.mkdirSync(filePath)
  // fs.mkdirSync(filePath)
  console.log('---------')
}
