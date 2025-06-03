<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![project_license][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/github_username/repo_name">
    <img src="/public/logo.png" alt="Logo" width="70" height="70">
  </a>

<h1 align="center">Shop Inventory Control</h1>

  <p align="center">
    Inventory management system for retail shops to keep track of products' stock or finances. 
    <br />
    <a href="https://github.com/github_username/repo_name"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/github_username/repo_name">View Demo</a>
    &middot;
    <a href="https://github.com/github_username/repo_name/issues/new?labels=bug&template=bug-report---.md">Report Bug</a>
    &middot;
    <a href="https://github.com/github_username/repo_name/issues/new?labels=enhancement&template=feature-request---.md">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

**Shop Inventory Control** is a web-based inventory and finance management system for retail shopkeepers. 
It helps track stock, sales, purchases, and profits across shop and store with a user-friendly interface.

#### Key Features: 

**📦 Dual-Location Inventory Management**
+ Track stock separately for Shop and Store.
+ Transfer items between locations with a single click.
  
**✏️ Quick Inline Editing**
+ Modify product details (quantity, price, etc.) directly in the listing table.

**💰 Sales & Purchase Tracking**
+ Record every sale/purchase with date, price, and profit.
+ View total sales/purchases for any time period.

**📜 Complete Product History**
+ See all changes made to a product (stock updates, sales, purchases).

**🔍 Smart Fuzzy Search**
+ Find products quickly even with typos or partial names.

**📱 Simple & Clean Interface**
+ Easy for non-tech users to navigate.

This project is ideal for shopkeepers looking for a simple, efficient solution to manage their inventory to replace manual record-keeping.
<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Built With

| Layer        | Technology                                    | Purpose                                                           |
| ------------ | --------------------------------------------- | ----------------------------------------------------------------- |
| **Frontend** | [![React][React.js]][React-url]               | UI library for building interactive components                    |
|              | [![Tailwind][Tailwind-CSS]][Tailwind-url]     | Utility-first CSS framework for custom styling                    |
|              | [![Shadcn][Shadcn-ui]][Shadcn-url]            | Reusable UI components library                                    |
|              | [![MaterialUi][Material-ui]][MaterialUi-url]  | Used specifically for data grid components                        |
| **Backend**  | [![Next][Next.js]][Next-url]                  | Full-stack React framework with built-in routing and SSR          |
|              | [![Mongodb][Mongodb]][Mongodb-url]            | NoSQL database for storing and managing data inventory data       |
|              | [![Auth0][Auth0]][Auth0-url]                  | Secure access of only the actual shop owner                       |

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Prerequisites

This is a list of tools you must have installed in your machine before proceeding:

- [git (Version Control)](https://git-scm.com)
- [Node.js (Javascript running environment)](https://nodejs.org/en)
- [npm (Node Package Manager)](https://www.npmjs.com)

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/yousuf123456/Shop-Inventory-Control.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Get your technologies credentials by creating an account on the following platforms:
   - [MongoDB](https://www.mongodb.com/)
   - [Auth0](https://auth0.com/)
4. Add your obtained credentials in your `.env.local` file.
   ```
   DATABASE_URL=mongo_database_url;

   AUTH0_SCOPE=auth0_scope;
   AUTH0_SECRET=auth0_secret;
   AUTH0_DOMAIN=auth0_domain;
   AUTH0_CLIENT_ID=auth0_client;
   AUTH0_AUDIENCE=auth0_audience;
   AUTH0_CLIENT_SECRET=auth0_secret;
   ```
5. Set Up Auth0 for Owner-Only Access.
   - Visit [Auth0](https://auth0.com/) and create an account.
   - Navigate to the users section and manually create one user account (this will be the shop owner's login.)
   - Disable any further sign-ups.
   - Setup middleware to protect web app from unauthorized access.
7. Run the local server.
   ```
   npm run dev
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

_For more examples, please refer to the [Documentation](https://example.com)_

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ROADMAP -->
## Roadmap

- [ ] Feature 1
- [ ] Feature 2
- [ ] Feature 3
    - [ ] Nested Feature

See the [open issues](https://github.com/github_username/repo_name/issues) for a full list of proposed features (and known issues).

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/github_username/repo_name/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=github_username/repo_name" alt="contrib.rocks image" />
</a>



<!-- LICENSE -->
## License

Distributed under the project_license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Your Name - [@twitter_handle](https://twitter.com/twitter_handle) - email@email_client.com

Project Link: [https://github.com/github_username/repo_name](https://github.com/github_username/repo_name)

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/github_username/repo_name.svg?style=for-the-badge
[contributors-url]: https://github.com/github_username/repo_name/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/github_username/repo_name.svg?style=for-the-badge
[forks-url]: https://github.com/github_username/repo_name/network/members
[stars-shield]: https://img.shields.io/github/stars/github_username/repo_name.svg?style=for-the-badge
[stars-url]: https://github.com/github_username/repo_name/stargazers
[issues-shield]: https://img.shields.io/github/issues/github_username/repo_name.svg?style=for-the-badge
[issues-url]: https://github.com/github_username/repo_name/issues
[license-shield]: https://img.shields.io/github/license/github_username/repo_name.svg?style=for-the-badge
[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: /public/Shop-Inventory-Control-SS.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com 
[Tailwind-CSS]: https://img.shields.io/badge/Tailwind.CSS-007FFF?style=for-the-badge&logo=tailwindcss&logoColor=white&logoSize=auto
[Tailwind-url]: https://tailwindcss.com/
[Mongodb]: https://img.shields.io/badge/Mongodb-00684A?style=for-the-badge&logo=mongodb&logoColor=B1FF05&logoSize=auto
[Mongodb-url]: https://www.mongodb.com/
[Shadcn-ui]: https://img.shields.io/badge/shadcnui-000000?style=for-the-badge&logo=shadcnui&logoColor=white&logoSize=auto
[Shadcn-url]: https://ui.shadcn.com/
[Material-ui]: https://img.shields.io/badge/MUI-white?style=for-the-badge&logo=mui&logoColor=#007FFF&logoSize=auto
[MaterialUi-url]: https://mui.com/material-ui/
[Auth0]: https://img.shields.io/badge/Auth0-black?style=for-the-badge&logo=auth0&logoColor=white&logoSize=auto
[Auth0-url]: https://auth0.com/
