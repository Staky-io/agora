
# Agora UI

This is the repository for the frontend of Agora, the governance framework built on ICON.

## Easy deploy

Fork this repository, head to https://www.netlify.com/, create a team and click on "Add a site". Pick "import existing project", follow the steps and deploy the project. After the initial deployment, click on "project settings"  -> Environment variables and set the environment variable as described in the "Environment" section below.
![enter image description here](https://i.imgur.com/1r6alZ2.png)
  
## Environment

  

Define the environment variables to set up your project in a `.env` file:

```

APP_URL: The URL of your application project.

APP_COLOR: The primary color of your project. It should be in [a hexadecimal form](https://en.wikipedia.org/wiki/Web_colors#Shorthand_hexadecimal_form).

APP_NAME: The name of your project.

APP_SCORE_ADDRESS: The address of your contract.

APP_DECIMALS: The amount of decimals of your voting token (usually 18 for fungible, 0 for NFTs)

APP_SYMBOL: The symbol of the token.

APP_ICON_NETWORK: The network of your contract.

APP_LOGO_HASH: The IPFS hash of your logo.

APP_TWITTER: The Twitter username of your project or the full link.

APP_DISCORD: The Discord ID of your Discord invitation link or the full link.

APP_GITHUB: The GitHub username of your project or the full link.

APP_DECIMALS: The amount of decimals of your tokens, usually 18 for IRC2 and 0 for NFT

```

  

Refer 

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

  
  

## Setup

  

Make sure to install the dependencies:

  

```bash

# yarn

yarn install

  

# npm

npm install

  

# pnpm

pnpm install --shamefully-hoist

```

  

## Development Server

  

Start the development server on http://localhost:3000

  

```bash

npm run dev

```

  

## Production

  

Build the application for production:

  

```bash

npm run build

```

  

Locally preview production build:

  

```bash

npm run preview

```

  

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

  


to the `.env.example` file to see some examples.
