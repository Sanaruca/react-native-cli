import fs from "fs";
import path from "path";

export function createComponentFile(name: string) {
  const fileNameFormat = strFormat(name, 'split-by-dash')
  name = strFormat(name);
  const fileDist = `./dist/components/${fileNameFormat}-component.tsx`;
  if (fs.existsSync(fileDist)) return;
  ensureCreateDir(path.resolve("./dist/components"));
  ensureCreateDir(path.resolve("./dist/types"));
  writeComponentProps(name, path.resolve("./dist/types"));
  const content = fs
    .readFileSync(path.join(__dirname, "/templates/component-template.dott"))
    .toString()
    .replace(/\$COMPONENT_NAME\$/g, strFormat(name, 'UpperCamelCase'));

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
      }
    );
  }
  console.log(
    "type",
    strFormat(componentName) + "Props",
    "added to:",
    propsFilePath
  );
}

export function createScreenFile(name: string) {
  const fileNameFormat = strFormat(name, 'split-by-dash')
  name = strFormat(name);
  const fileDist = path.resolve(`./dist/screens/${fileNameFormat}-screen.tsx`);
  ensureCreateDir(path.resolve("./dist/screens"));
  ensureCreateDir(path.resolve("./dist/types"));
  // console.log({__dirname})
  writeScreenProps(name, path.resolve("./dist/types"));
  const content = fs
    .readFileSync(
      path.join(__dirname, "/templates/screen-component-template.dott")
    )
    .toString()
    .replace(/\$SCREEN_NAME\$/g, strFormat(name, 'UpperCamelCase'));
  fs.writeFile(fileDist, content, (error) => {
    if (error) throw error;
    console.log("created:", fileDist);
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
        strFormat(screenName, 'UpperCamelCase')
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

function strFormat(input: string, style: 'camelCase'| 'UpperCamelCase' | 'snake_case' | 'split-by-dash' | 'SNAKE_CASE' = 'camelCase') {
    const regex = /[-_]/g,
        arr = regex.test(input) ? input.split(regex) : [input],
        styleCase: Record<typeof style, string> = {
            camelCase: arr.reduce((acc, current, i) => !i ? acc + current : acc + camelCase(current)),
            snake_case: arr.join('_').toLowerCase(),
            get UpperCamelCase(){ return this.camelCase.charAt(0).toUpperCase() + this.camelCase.slice(1) },
            get 'split-by-dash'() { return this.snake_case.replace(/_/g, '-') },
            get SNAKE_CASE() { return this.snake_case.toUpperCase() }
        }
    return styleCase[style]
    function camelCase(str: string) {
        return str.charAt(0)?.toUpperCase() + str.slice(1).toLowerCase()
    }
}
