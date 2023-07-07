import React from 'react'

const PercentageBar = ({progressPercentage}) => {
  return (
    <div className="mb-4 fundraising-card col-xl-8 col-lg-12 col-md-12">
                    <div className="h-100 card">
                      <div className="py-4 card-header">
                        <h6 className="card-heading">
                          Private sale Fundraising
                        </h6>
                      </div>
                      <div className="pt-3 pb-0 card-body">
                        <div className="h2 mb-3 text-accent text-uppercase">
                          {progressPercentage}
                        </div>
                        <div className="align-items-center mb-3 row">
                          <div className="fundraising-element mb-3 mb-md-0 text-muted fw-bold text-round col-lg-2 col-md-2">
                            Completed
                          </div>
                          <div className="fundraising-element mb-3 mb-md-0 col-lg-7 col-md-6">
                            <div className="progress">
                              <div
                                role="progressbar"
                                className="progress-bar bg-green progress-bar-animated progress-bar-striped"
                                aria-valuenow={0}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                style={{ width: progressPercentage }}
                              >
                                {progressPercentage}
                              </div>
                            </div>
                          </div>
                          <div className="fundraising-element text-muted fw-bold col-lg-3 col-md-4">
                            <span className="token token-with-ticker">
                              <img
                                src="img/icons/flyguyz-icon.png"
                                alt="FlyGuyz"
                              />
                              <span className="token-name">FLYY</span>
                              <b className="token-value">62,160,000</b>
                            </span>
                          </div>
                        </div>
                        <hr />
                        <div className="mb-3 row">
                          <div className="col-lg-6">
                            <p>
                              <b>Round details:</b>
                            </p>
                            <ul>
                              <li>
                                <p>
                                  <small className="text-muted">
                                    Token Symbol:{" "}
                                  </small>
                                  <a href="#" target="_blank" rel="noreferrer">
                                    <b>$FLYY</b>
                                  </a>
                                </p>
                              </li>
                              {/* <li>
                                <p>
                                  <small className="text-muted">
                                    Hard Cap:{" "}
                                  </small>
                                  <strong>
                                    <span>$621,600</span>
                                  </strong>
                                </p>
                              </li> */}
                              {/* <li>
                                <p>
                                  <small class="text-muted">
                                    Pre-Sale Supply:{" "}
                                  </small>
                                  <b>62,160,000 FLYY</b>
                                </p>
                              </li> */}
                              <li>
                                <p>
                                  <small className="text-muted">
                                    Max supply:{" "}
                                  </small>
                                  <b>888,000,000 FLYY</b>
                                </p>
                              </li>
                            </ul>
                          </div>
                          <div className="col-lg-6">
                            <p className="hidden md:block">
                              <b className="opacity-0">Round details:</b>
                            </p>
                            <ul>
                              <li>
                                <p>
                                  <small className="text-muted">
                                    Hard Cap:{" "}
                                  </small>
                                  <strong>
                                    <span>$621,600</span>
                                  </strong>
                                </p>
                              </li>
                              <li>
                                <p>
                                  <small class="text-muted">
                                    Pre-Sale Supply:{" "}
                                  </small>
                                  <b>62,160,000 FLYY</b>
                                </p>
                              </li>
                              {/* <li>
                                <p>
                                  <small className="text-muted">Price: </small>
                                  <b>1 FLYY = 0.025$</b>
                                </p>
                              </li> */}
                              {/* <li>
                                <p>
                                  <b>1 FLYY = 0.048 BUSD</b>
                                  <small class="text-muted">
                                    {" "}
                                    - Allocation less than $10,000
                                  </small>
                                </p>
                              </li> */}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
  )
}

export default PercentageBar