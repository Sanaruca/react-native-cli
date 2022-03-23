import fs from "fs";
import path from "path";

export function createComponentFile(name: string) {
  name = name.at(0)?.toUpperCase() + name.slice(1);
  const fileDist = `./dist/components/${name}-component.tsx`;
  if (fs.existsSync(fileDist)) return;
  ensureCreateDir(path.resolve("./dist/components"));
  ensureCreateDir(path.resolve("./dist/types"));
  writeComponentProps(name, path.resolve("./dist/types"));
  const content = fs
    .readFileSync(path.join(__dirname, "/templates/component-template.dott"))
    .toString()
    .replace(/\$COMPONENT_NAME\$/g, name.replace(/[-_\./\\]/g, ""));

  fs.writeFile(fileDist, content, (err) => {
    if (err) throw err;
    console.log("created:", fileDist);
  });
}

function writeComponentProps(componentName: string, typesPathDir: string) {
  const propsFilePath = path.join(typesPathDir, "props.ts"),
    interfaceDeclaration = `export interface ${strFormat(
      componentName
    )}Props {}\n`;

  if (!fs.existsSync(propsFilePath)) {
    fs.writeFileSync(propsFilePath, interfaceDeclaration);
    console.log("created:", propsFilePath);
  } else {
    fs.writeFile(
      propsFilePath,
      "\n" + interfaceDeclaration,
      { flag: "a" },
      (err) => {
        if (err) throw err;
        console.log('type', strFormat(componentName) + "Props", 'added to:', propsFilePath);
      }
    );
  }
}

function strFormat(input: string) {
  // TODO
  return input.at(0)?.toUpperCase() + input.slice(1);
}

export function createScreenFile(name: string) {
  name = strFormat(name);
  ensureCreateDir(path.resolve("./dist/screens"));
  ensureCreateDir(path.resolve("./dist/types"));
  // console.log({__dirname})
  writeScreenProps(name, path.resolve("./dist/types"));
  const content = fs
    .readFileSync(
      path.join(__dirname, "/templates/screen-component-template.dott")
    )
    .toString()
    .replace(/\$SCREEN_NAME\$/g, name);
  fs.writeFile(`./dist/screens/${name}-screen.tsx`, content, (error) => {
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
    const content = fs
      .readFileSync(
        path.join(__dirname, "/templates/screen-props-template.dott")
      )
      .toString()
      .replace(
        "$SCREEN_NAME$",
        screenName.at(0)?.toUpperCase() + screenName.slice(1)
      );
    fs.writeFileSync(screenPropsFilePath, content);
    console.log("created:", screenPropsFilePath);
    return;
  }
  const screenPropsContent = fs.readFileSync(screenPropsFilePath).toString(),
    match = screenPropsContent.match(
      /type\s*BaseStackScreenParamList\s*=\s*{/m
    );
  if (screenPropsContent.includes(screenName)) return;
  let rbCount = 0,
    lbCount = 1,
    i = match!.index! + match!.at(0)!.length;
  while (lbCount != rbCount) {
    const char = screenPropsContent[i++];
    switch (char) {
      case "{":
        lbCount++;
        break;
      case "}":
        rbCount++;
        break;
    }
  }
  const input = screenPropsContent.slice(match!.index, i),
    types = [...getTypes(input), screenName + ": {}"];
  fs.writeFileSync(
    screenPropsFilePath,
    screenPropsContent.replace(
      input,
      "type BaseStackScreenParamList = {\n\t" + types.join(";\n\t") + ";\n}"
    )
  );
}

function getTypes(input: string) {
  const nBrackets = input.match(/[{}]/g)!.length;
  if (nBrackets % 2 != 0) throw new Error("some braket missing");
  let match;
  const regex = /\w+\s*:\s*{/g,
    auxArr = [];
  while ((match = regex.exec(input)) !== null) {
    const matchStartPossition = match.index,
      [matchValue] = match,
      auxInput = input.slice(matchStartPossition + matchValue.length);

    let i = 0,
      countRigthBraket = 0,
      countLeftBraket = 1;

    while (countLeftBraket != countRigthBraket) {
      const char = auxInput[i++];
      switch (char) {
        case "{":
          countLeftBraket++;
          break;
        case "}":
          countRigthBraket++;
          break;
      }
    }
    auxArr.push(
      input.slice(
        matchStartPossition,
        matchStartPossition + matchValue.length + i
      )
    );
  }
  let l = auxArr.length;
  let lastItered = 0;
  while (true) {
    for (const [i, str] of auxArr.entries()) {
      if (i < lastItered) continue;
      const nextStr = auxArr[i + 1];
      if (str.includes(nextStr)) {
        auxArr.splice(i + 1, 1);
        lastItered = i;
        break;
      }
    }
    if (l == auxArr.length) break;
    else l = auxArr.length;
  }
  return auxArr;
}
