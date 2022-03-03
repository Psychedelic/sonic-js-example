![Sonic Banner](https://storageapi.fleek.co/fleek-team-bucket/logos/sonic-log.png)

<h1 align="center">Sonic-js Example</h1>

> ⚠️ The library is currently under a Beta version. It still a work in progress and can have braking changes through the new version releases.

> 💬 All feedback is accepted! [Set up an issue](https://github.com/Psychedelic/sonic-js/issues).

This project is an example integration of the [Sonic-js](https://github.com/Psychedelic/sonic-js) library.

- Check out [the Sonic-js main repository](https://github.com/Psychedelic/sonic-js)
- Check out [the Sonic-js documentation](https://docs.sonic.ooo/dev/sonic-js)
- Visit [our website](https://sonic.ooo/)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Setup Github Configuration](#setup-github-configuration)
  - [Running Example App](#running-exaple-app)
- [About the project](#about-the-project)
  - [Hooks](#hooks)
  - [Components](#components)
  - [Store](#store)

## Getting Started

> ⚠️ We are assuming that you have basic knowledge using [Node.js](https://nodejs.org/) and the environment is already installed.

### Setup Github Configuration

First, we need to setup our authentication on Github Packages. This step is compulsory, even for public packages.

To do so you're going to need a [personal access token](https://github.com/settings/tokens) with the following configurations:

- **repo**
- **read:packages**

Next, authenticate yourself via the `npm login` command using your Github useranme for the username, Github email for the email and the personal access token as your password:

```bash
npm login --registry=https://npm.pkg.github.com --scope=@psychedelic
```

You're all set to use Sonic-js in your cloned sonic-js-example directory!

### Running Example App

After cloning the project you need to install dependencies:

```bash
yarn
```

And run it:

```bash
yarn dev
```

If the running project doesn't open in your default browser, you can open it on [http://localhost:9000/](http://localhost:9000/).

## About the project

> ⚠️ This project was developed using [React.js](https://reactjs.org/). If your application doesn't use React, you can still getting some ideas in how to apply it on your application by the comments added throughout project.

The project has examples of how to:

- Interact with the library to fetch and show information from the Sonic canister.
- Connecting to the Sonic Swap canister using [Plug](https://plugwallet.ooo) as an identity provider.
- Make swaps on behalf of authenticated users.

The components present in the project are split in sections to prioritize the usage of each part in given section.

> 💬 Reminder to follow the comments on the code

### Hooks

Custom hooks were created to avoid frequently repeated code inside the application:

- [useSwapCanisterBalances](src/hooks/use-swap-canister-balances.ts)
- [useSwapCanisterController](src/hooks/use-swap-canister-controller.ts)
- [useSwapCanisterLists](src/hooks/use-swap-canister-lists.ts)
- [useSwapCanisterLiquidityPosition](src/hooks/use-swap-canister-liquidity-position.ts)

### Components

UI components create to exemplify how to display data:

- [BalanceSection](src/components/balance.tsx)
- [DataListsSection](src/components/data-lists.tsx)
- [DepositSection](src/components/deposit.tsx)
- [PlugSection](src/components/plug.tsx)
- [SwapSection](src/components/swap.tsx)
- [WithdrawSection](src/components/withdraw.tsx)
- [LiquidityPositionSection](src/components/liquidity-position.tsx)
- [AddLiquiditySection](src/components/add-liquidity.tsx)
- [RemoveLiquiditySection](src/components/remove-liquidity.tsx)

### Store

The app provides an example of the usage of [react-redux](https://react-redux.js.org/) to store global states.

- [balances](src/store/features/balance-slice.ts)
- [plug](src/store/features/plug-slice.ts)
