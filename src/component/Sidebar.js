import React from 'react'

const Sidebar = ({addTokenToMetamask}) => {
  return (
    <div id="sideBar" className="sidebar py-4 col-auto">
            <div className="sidebar-block">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a href="#" className="nav-link">
                    <i className="icon">
                      <img
                        src="img/icons/tokenization.svg"
                        alt="Buy Tokens"
                        className="img-fluid"
                      />
                    </i>
                    <span>Buy Tokens</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a href="https://www.flyguyz.io/" className="nav-link">
                    <i className="icon">
                      <img
                        src="img/icons/home.svg"
                        alt="Home"
                        className="img-fluid"
                      />
                    </i>
                    <span>Home</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="https://www.flyguyz.io/litepaper.html"
                    className="nav-link"
                  >
                    <i className="icon">
                      <img
                        src="img/icons/bird.svg"
                        alt="Litepaper"
                        className="img-fluid"
                      />
                    </i>
                    <span>Litepaper</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    href="https://www.flyguyz.io/index.html#roadmap"
                    className="nav-link"
                  >
                    <i className="icon">
                      <img src="img/icons/track.svg" alt="Roadmap" />
                    </i>
                    <span>Roadmap</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    onClick={addTokenToMetamask}
                    className="nav-link"
                  >
                    <i className="icon">
                      <img src="/img/addToMetamask.png" alt="Add to Metamask" />
                    </i>
                    <span>Add to Metamask</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
  )
}

export default Sidebar