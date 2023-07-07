import React from "react";

const MenuBar = ({ addTokenToMetamask }) => {
  return (
    <div className="hidden md:flex col-auto navbar-main ms-auto md:px-2 lg:px-4 py-3 rounded-2xl bg-[#391883] ">
      <ul className="navbar-nav text-white flex-column flex-md-row ms-auto align-items-center space-x-2 lg:space-x-4">
        <li className="nav-item ">
          <a
            className="nav-link-top text-base font-bold no-underline"
            href="https://www.flyguyz.io/"
          >
            Home
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link-top font-bold no-underline text-base "
            href="https://dashboard.flyguyz.io/"
          >
            Token Sale
          </a>
        </li>
        <li className="nav-item hover:text-[#3ce66f] ">
          <a
            className="nav-link-top  text-base font-bold no-underline"
            href="https://claim.flyguyz.io/"
          >
            Claim
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link-top font-bold text-base no-underline"
            href="https://referral.flyguyz.io/"
          >
            Referral
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link-top font-bold text-base no-underline"
            href="https://fly-guyz.vercel.app/litepaper.html"
          >
            Litepaper
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link-top font-bold text-base no-underline"
            href="https://whitepaper.flyguyz.io/"
          >
            Whitepaper
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link-top font-bold text-base no-underline"
            href="https://flyguyz.io#roadmap"
          >
            Roadmap
          </a>
        </li>
      </ul>
    </div>
  );
};

export default MenuBar;
