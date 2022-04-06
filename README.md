# React Native CLI
A command line interface tool to generate react components.
## Features
- Initialize react projects with a folder structure for development.
- Generates react-native function components with just one line.

## Installation
React Native CLI requires [Node.js](https://nodejs.org/) v10+ to run.
Clone the repository (or [click here](https://github.com/Sanaruca/react-native-cli/archive/refs/heads/master.zip) to download the code) and run `npm run cli-install`
```sh
$ git clone https://github.com/Sanaruca/react-native-cli.git
$ cd react-native-cli
$ npm run cli-install
```

## Usage
Invoke the tool on the command line through the `rn` executable. Use the following command to get help:
```sh
$ rn --help
$ rn generate --help
```
To initialize and generate a structure for a new project use `rn init <name_of_your_app>`
**example:**
```sh
$ rn init my-react-native-app
$ cd my-react-native-app
```
A folder structure will have been generated to easily find the various files of the project. 
The main component `App.tsx` where the entire application is loaded is located at the root of the project and inside the `/app` folder you can generate your necessary components and utilities for your application.

To generate react components use the `rn generate` command.
**example:**
For **common** components:
```sh
$ rn g c component-name
```
For **screen** components:
```sh
$ rn g s screen-name
```
> Note: we have used the command `g` which refers to `generate` as well as `c` which refers to `component` and `s` which refers to `screen`.

