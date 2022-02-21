![Sonic Banner](https://storageapi.fleek.co/fleek-team-bucket/logos/sonic-log.png)

<h1 align="center">Sonic-js Example</h1>

> ⚠️ The library is currently under a Beta version. It still a work in progress and can have braking changes through the new version releases.

> 💬 All feedback is accepted! [Set up an issue](https://github.com/Psychedelic/sonic-js/issues).

This project is an example of the usage of [Sonic-js](https://github.com/Psychedelic/sonic-js) library.

- Check out [the library repository](https://github.com/Psychedelic/sonic-js)
- Check out [the library documentation](https://docs.sonic.ooo/dev/sonic-js)
- Visit [our website](https://sonic.ooo/)
- Read [Sonics's documentation](https://docs.sonic.ooo/)
- Read [our blog](https://sonic-ooo.medium.com/)

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Getting Started](#getting-started)
  - [Hooks](#hooks)
  - [Components](#components)
  - [Store](#store)

## Getting Started

> ⚠️ We are taking in consideration here, that you have basic knowledge using [Node.js](https://nodejs.org/) and the environment already installed.

To start running the project, previously you need the authentication on Github Packages. Everybody needs to setup it, even for public packages.

There are some ways to reach that you can check how to do it properly looking [here](https://docs.github.com/pt/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token).

After cloning the project you need to install dependencies:

```bash
yarn
```

And run it:

```bash
yarn dev
```

If the running project not open in your default browser, you can open it on [http://localhost:9000/](http://localhost:9000/).

## About the project

> ⚠️ This project was developed using [React.js](https://reactjs.org/), but if your application don't use it, you can still getting some ideas in how to apply it on your application by the comments added through the whole project.

The project have an example usage of how interact with the library to fetch and show information. It is developed trying to be as simple as possible. Also provides an example of how to reach a Swap using plug as an identity provider.

The components present in the project are split in sections to prioritize the usage of each part in given section.

> 💬 Remind to follow the comments on the code

### Hooks

Custom hooks were created to avoid frequently repeated code inside the application:

- [useSwapCanisterBalances](src/hooks/use-swap-canister-balances.ts)
- [useSwapCanisterController](src/hooks/use-swap-canister-controller.ts)
- [useSwapCanisterLists](src/hooks/use-swap-canister-lists.ts)

### Components

UI components create to exemplify how to display data:

- [BalanceSection](src/components/balance.tsx)
- [DataListsSection](src/components/data-lists.tsx)
- [DepositSection](src/components/deposit.tsx)
- [PlugSection](src/components/plug.tsx)
- [SwapSection](src/components/swap.tsx)
- [WithdrawSection](src/components/withdraw.tsx)

### Store

The app provides an example of the usage of [react-redux](https://react-redux.js.org/) to store global states.

- [balances](src/store/features/balance-slice.ts)
- [plug](src/store/features/plug-slice.ts)
