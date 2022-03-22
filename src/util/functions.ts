import fs from "fs";
import path from "path";

export function createScreenFile(name: string) {
  name = name.at(0)?.toUpperCase() + name.slice(1);
  ensureCreateDir(path.resolve("./dist/screens"));
  ensureCreateDir(path.resolve("./dist/types"));
  // console.log({__dirname})
  writeScreenProps(name, path.resolve("./dist/types"));
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

function writeScreenProps(screenName: string, typesDirPath: string) {
  const screenPropsFilePath = path.join(typesDirPath, "screen-props.ts");
  const isFileExist = fs.existsSync(screenPropsFilePath);
  if (!isFileExist) {
    const content = fs.readFileSync(
      path.join(__dirname, "/templates/screen-props-template.dott")
    );
    fs.writeFileSync(screenPropsFilePath, content);
    console.log("created:", screenPropsFilePath);
  }
  console.log(fs.readFileSync(screenPropsFilePath).toString().match(/^type BaseStackScreenParamList[\S\s]+};$/m)?.at(0))
}






function getTypes(input: string) {
  const nBrackets = input.match(/[{}]/g)!.length
  if (nBrackets % 2 != 0) throw new Error('some braket missing')
  let match;
  const regex = /\w+\s*:\s*{/g,
    auxArr = [];
  while ((match = regex.exec(input)) !== null) {
    const matchStartPossition = match.index,
      [matchValue] = match,
      auxInput = input.slice(matchStartPossition + matchValue.length);

    let i = 0, countRigthBraket = 0, countLeftBraket = 1

    while (countLeftBraket != countRigthBraket) {
      const char = auxInput[i++];
      switch (char) {
        case '{':
          countLeftBraket++
          break;
        case '}':
          countRigthBraket++
          break;
      }
    }
    auxArr.push(input.slice(matchStartPossition, matchStartPossition + matchValue.length + i))
  }
  let l = auxArr.length
  let lastItered = 0;
  while (true) {
    for (const [i, str] of auxArr.entries()) {
      if (i < lastItered) continue;
      const nextStr = auxArr[i + 1]
      if (str.includes(nextStr)) {
        auxArr.splice(i + 1, 1)
        lastItered = i
        break;
      }
    }
    if (l == auxArr.length) break; else l = auxArr.length
  }
  return auxArr
}
