import React from 'react'

const Footer = () => {
  return (
    <footer className="footer align-self-end py-3 px-xl-5 w-100">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-md-3">
                    <div className="copyright justify-content-center justify-content-md-start fw-bold">
                      <p className="mb-3 mb-md-0">FlyGuyz © 2022</p>
                    </div>
                  </div>
                  <div className="text-center text-md-start fw-bold col-md-6">
                    <ul className="social-list">
                      <li>
                        <a
                          className="social-list-item social-discord"
                          href="https://discord.gg/FlyGuyz"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-discord" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-telegram"
                          href="Https://t.me/flyguyzchat"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-telegram" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-twitter"
                          href="Https://twitter.com/FlyGuyzOfficial"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-twitter" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-binance"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-binance" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-opensea"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-opensea" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-cmc"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-cmc" />
                        </a>
                      </li>
                      <li>
                        <a
                          className="social-list-item social-linktree"
                          href="#"
                          target="_blank"
                          rel="noreferrer"
                        >
                          <i className="icon-linktree" />
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="text-center text-md-end text-gray-400 col-md-3">
                    <div className="mb-0 version justify-content-center justify-content-md-start mt-3 mt-md-0">
                      <p>Version 1.0.0</p>
                    </div>
                  </div>
                </div>
              </div>
            </footer>
  )
}

export default Footer