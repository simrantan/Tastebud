<!--
# Steven G. Opferman | steven.g.opferman@gmail.com
# Adapted from:
#   https://github.com/othneildrew/Best-README-Template/
#   https://github.com/kylelobo/The-Documentation-Compendium/
-->
<h1 align="center">Team 22: TasteBud</h1>
<div id="top"></div>

<p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src=".github/Screenshot 2024-01-23 at 23.47.07.png" alt="TasteBud"></a>
</p>

<p align="center">
Few lines describing your project.
<br>
</p>

## Table of Contents

- [About](#about)
- [Getting Started](#getting_started)

## About <a name="about"></a>

TasteBud is your ultimate culinary companion, a chatbot chef assistant that simplifies meal decisions. Whether you have dietary restrictions or need inspiration for your near-expired produce, TasteBud suggests personalized recipes, offers ingredient substitutions, and guides you through a delightful cooking experience. Elevate your culinary adventures with TasteBud – where delicious meets tailored convenience.

All of our documentation lives in our [wiki page](https://github.com/StanfordCS194/Win24-Team22/wiki).

<p align="right">(<a href="#top">back to top</a>)</p>

## Getting Started <a name="getting_started"></a>

These instructions will get you a copy of the project up and running.

1. [Install Node.js](https://nodejs.org/en/download) TasteBud is known to work using node v20.11.1 and npm v10.2.4.

1. Clone the repo

   ```sh
   git clone git@github.com:StanfordCS194/Win24-Team22.git
   ```

### Frontend

1. Move into the `frontend` directory.

    ```sh
    cd Win24-Team22/frontend
    ```

1. Install dependencies

   ```sh
   npm install
   ```

1. Start the development server

    ```sh
    npm start
    ```

### Backend

1. Move into the `backend` directory.

    ```sh
    cd Win24-Team22/backend
    ```

1. Install dependencies

   ```sh
   npm install
   ```

1. Start the development server

    ```sh
    npm start
    ```

_Known issue: if you get the error `ReferenceError: Headers is not defined` upon starting the backend, you need to use a newer version of Node.js - check out the [Node Version Manager](https://github.com/nvm-sh/nvm) for help. TasteBud is known to work using node v20.11.1 and npm v10.2.4._

Once the frontend and backend are both running, visit <http://localhost:3000/> in your browser to begin using TasteBud!

<p align="right">(<a href="#top">back to top</a>)</p>
