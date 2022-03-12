#! /usr/bin/env node

import yargs, { Argv } from "yargs";
import { createScreenFile } from "./util/functions";

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
          ["component [name]", "c"],
          "generate a react component",
          () => {},
          (args) => console.log(args)
        )
        .command(
          ["screen [name]", "s"],
          "generate a react screen",
          () => {},
          (args) => console.log(args)
        )
        .command(
          ["test [name]", "t"],
          "generate a test",
          () => {},
          (args: yargs.ArgumentsCamelCase<{name: string}>) => {
            try {
              console.log("test");
              createScreenFile(args.name);
            } catch (error) {
              throw error;
            }
          }
        );
    },
    (args) => console.log("args")
  )
  .example(
    "$0 generate screen screen-name",
    'generate a react screen component named "screen-name"'
  )
  .help("h")
  .alias("h", "help").argv;
