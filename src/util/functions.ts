import fs from "fs";
import path from "path";

export function createScreenFile(name: string) {
  name = name.at(0)?.toUpperCase() + name.slice(1);
  ensureCreateDir(path.resolve("./dist/screens"));
  ensureCreateDir(path.resolve("./dist/types"));
  // console.log({__dirname})
  writeScreenProps(name, path.resolve("./dist/types"))
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

function ensureCreateDir(dirPath: string) {
  const condition = fs.existsSync(dirPath);
  // console.log({ condition, filePath, next: path.dirname(filePath) })
  if (condition) return true;
  ensureCreateDir(path.dirname(dirPath));
  fs.mkdirSync(dirPath);
  console.log("created:", dirPath);
  // fs.mkdirSync(filePath)
}

function writeScreenProps(screenName: string, typesDirPath: string){
  const isFileExist = fs.existsSync(path.join(typesDirPath))
  console.log({isFileExist})
}
