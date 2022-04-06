#! /usr/bin/env node

import yargs, { Argv } from "yargs";
import { createComponentFile, createScreenFile, init } from "./util/functions";

// console.log(yargs.argv);

yargs
  .scriptName("rn")
  .usage("Usage: $0 <command> [options]")
  .command(
    ["generate", "g"],
    "generate something",
    (yargs) => {
      yargs
        .command(
          ["component <name>", "c"],
          "generate a react component",
          (yargs) => {
            yargs.positional("name", {
              describe: "name of the component to be created",
              type: "string",
            });
          },
          (args:  yargs.ArgumentsCamelCase<{ name: string }>) => {
            createComponentFile(args.name)
          }
        )
        .command(
          ["screen <name>", "s"],
          "generate a react screen",
          (yargs) => {
            yargs.positional("name", {
              describe: "name of the screen to be created",
              type: "string",
            });
          },
          (args: yargs.ArgumentsCamelCase<{ name: string }>) => {
            // if (!args.name) throw Error('please put a name for the screen')

            createScreenFile(args.name);
          }
        )
        .command(
          ["test [name]", "t"],
          "generate a test",
          () => {},
          (args) => {
            try {
              console.log("test", args);
            } catch (error) {
              throw error;
            }
          }
        );
    },
    (args) => console.log("args")
  ).command('init <app-name>', 'initialize a react project', ()=> {}, (args: yargs.ArgumentsCamelCase<{ ['app-name']: string }>)=>{
    init(args['app-name'])
  })
  .example(
    "$0 init my-app",
    'generate a react-native aplication called my-app'
  )
  .help("h")
  .alias("h", "help").argv;
