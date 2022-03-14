import fs from "fs";
import path from "path";

export function createScreenFile(name: string) {
  name = name.at(0)?.toUpperCase() + name.slice(1);
  ensureCreateDir(path.resolve("./dist/screens"));
  ensureCreateDir(path.resolve("./dist/types"));
  // console.log({__dirname})
  const text = fs
    .readFileSync(
      path.join(__dirname, "/templates/screen-component-template.dott")
    )
    .toString()
    .replace(/\$SCREEN_NAME\$/g, name);
  fs.writeFile(`./dist/screens/${name}-screen.tsx`, text, (error) => {
    if (error) throw error;
  });
}

function ensureCreateDir(filePath: string) {
  const condition = fs.existsSync(filePath);
  // console.log({ condition, filePath, next: path.dirname(filePath) })
  if (condition) return true;
  ensureCreateDir(path.dirname(filePath));
  fs.mkdirSync(filePath);
  console.log("created:", filePath);
  // fs.mkdirSync(filePath)
}
