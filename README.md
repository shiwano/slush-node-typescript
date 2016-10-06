# slush-node-typescript2

> A slush generator for Node.js and TypeScript based on [slush-node-typescript](https://github.com/shiwano/slush-node-typescript) but adapted for TypeScript 2.x.

> Extended to support *webpack* and more config options for testing:
> - gulp or webpack as task managers
> - karma and nightwatch for E2E testing
> - istanbul for test coverage
> - sinon for server mocking

## Getting Started

Sample project can be found [here](https://github.com/kristianmandrup/ai-component-bundler)

Use [typings](https://github.com/typings/typings) CLI to install type definitions.

### Installation

Install `slush-node-typescript2` globally:

```bash
$ npm i -g slush-node-typescript2
```

Remember to install `slush` globally as well, if you haven't already:

```bash
$ npm i -g slush
```

### Usage

Create a new folder for your node esnext package. Then cd into it.

```bash
$ mkdir node-typescript-package && cd node-typescript-package
```

Initiate the generator:

```bash
$ slush node-typescript2
```

Install type definitions to run tests:

`typings install chai mocha node --global --save`

(optionally) install all the latest modules for testing:

`npm install typescript webpack ts-loader chai karma karma-chai karma-mocha karma-phantomjs-launcher karma-sinon karma-typescript-preprocessor2 karma-webpack mocha phantomjs-prebuilt sinon --save-dev`

### Tasks

#### generate

```bash
$ slush node-typescript2:generate foo/bar
```

Will generate `src/foo/bar.ts` and `test/src/foo/bar_test.ts` to your package.

### Conventions

The generator expects a few conventions. They are easy to change if they are not suitable.

* Source code for your npm package is in the `src` directory.
* Test code is in the `test` directory.
* Compiled JavaScript code is outputed to the `lib` directory.
* The package `main` module is located at `lib/{packageName}.js`.

## Getting To Know Slush

Slush is a tool that uses Gulp for project scaffolding.

Slush does not contain anything "out of the box", except the ability to locate installed slush generators and to run them with liftoff.

To find out more about Slush, check out the [documentation](https://github.com/slushjs/slush).

## License 

MIT
