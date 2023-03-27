# Turborepo Wallet SDK starter

This is an official npm starter turborepo.

## What's inside?

This turborepo uses [npm](https://www.npmjs.com/) as a package manager. It includes the following packages/apps:

### Apps and Packages

- `api`: a nestjs server
- `react`: a create-react-app, can be used for demo
- `@liquality/wallet-sdk`: a typescript library
- `ui`: a React component library with Login component
- `eslint-config-custom`: `eslint` configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `tsconfig`: `tsconfig.json`s used throughout the monorepo

Each package/app is 100% [TypeScript](https://www.typescriptlang.org/).





### Develop

To develop all apps and packages, run the following command in the root folder:

```
yarn && yarn dev
```


### Build

To build the wallet SDK, run the following command in wallet-sdk/packages/sdk folder:

```
yarn && yarn compile && yarn build
```

Building the SDK is needed to generate types.
