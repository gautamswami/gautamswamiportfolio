import React, { useState } from "react";
import {
  Mousewheel,
  EffectFade,
  Pagination,
  Navigation,
  Thumbs,
  FreeMode,
} from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";

import Portfolio1 from "../../../public/assets/imgs/portfolio/1.png";
import Shape16 from "../../../public/assets/imgs/shape/16.png";

import Portfolio13 from "../../../public/assets/imgs/portfolio/1/attendance.png";
import Portfolio14 from "../../../public/assets/imgs/portfolio/1/bitsmart.png";
import Portfolio11 from "../../../public/assets/imgs/portfolio/1/briefcab.png";
import Portfolio12 from "../../../public/assets/imgs/portfolio/1/olympro.png";
import Portfolio15 from "../../../public/assets/imgs/portfolio/1/socialpillow.png";
import Portfolio16 from "../../../public/assets/imgs/portfolio/1/ml.png";
import Portfolio17 from "../../../public/assets/imgs/portfolio/1/fnf.png";

import Link from "next/link";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";
import "swiper/css/mousewheel";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";

const PortfolioSwiperDestop = () => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <>
      <div className="portfolio__main-slider2">
        <Swiper
          modules={[Mousewheel, EffectFade, Pagination]}
          spaceBetween={0}
          effect={"fade"}
          mousewheel={true}
          allowTouchMove={false}
          slidesperview={1}
          pagination={{
            el: ".swiper-pagination",
            clickable: true,
          }}
        >
          <SwiperSlide>
            <section className="portfolio__hero-area portfolio-section">
              <div className="container">
                <div className="row">
                  <div className="col-xxl-12">
                    <div className="portfolio__hero">
                      <h1 className="title shape-circle">Full stack</h1>
                      <h2 className="title text-stroke">Web & Mobile</h2>
                      <h2 className="title">developer</h2>
                      <div className="btn-wrapper">
                        {/* <Link href="/portfolio" className="wc-btn-dark">
                          View all work
                        </Link> */}
                      </div>
                      {/* <Image
                        priority
                        width={921}
                        style={{ height: "auto" }}
                        src={Portfolio1}
                        alt="Personal Portfolio"
                        className="pp-thumb"
                      /> */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide>
            <section className="portfolio-section portfolio__about pt-140 pb-150">
              <div className="container">
                <div className="row">
                  <div className="col-xxl-8 col-xxl-8 col-lg-8">
                    <div className="portfolio__about-left">
                      <h2 className="sec-title">
                        I craft wonderful <span>digital experiences</span> for
                        brands
                      </h2>
                      <Image
                        priority
                        width={274}
                        height={106}
                        src={Shape16}
                        alt="Shape"
                      />
                    </div>
                  </div>
                  <div className="col-xxl-4 col-xl-4 col-lg-4">
                    <div className="sec-text">
                      <p>
                        I'm an enterprising web developer who kicked off my
                        career journey while still in college. The pandemic
                        threw us all some curveballs, but I saw it as an
                        opportunity to dive headfirst into full-time employment,
                        navigating the challenges of remote learning with
                        determination. I currently excel as a full-stack
                        developer, adept at creating cutting-edge web and mobile
                        applications. My adaptability, leadership skills, and
                        unwavering commitment to excellence make me a valuable
                        asset to any forward-thinking organization seeking to
                        innovate and drive impactful change in the digital
                        landscape.
                      </p>
                      <Link
                        href="https://docs.google.com/document/d/1oGNfTdsGrdJVaqoeAP27XygcjhfDoK8Nt3T1hnvUbrI/edit?usp=sharing"
                        className="wc-btn-dark"
                        target="_blank"
                      >
                        Resume
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="about-row">
                  <div className="row"></div>
                </div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide>
            <section className="portfolio-section portfolio__project">
              <div className="container">
                <div className="row">
                  <div className="col-xxl-12">
                    <div className="pp-title-wrap">
                      <h2 className="pp-title">
                        Selected <br /> Work
                      </h2>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xxl-9 col-xl-9 col-lg-9 col-md-8">
                    <div className="pp-slider-wrapper">
                      <Swiper
                        modules={[Navigation, Thumbs]}
                        spaceBetween={10}
                        loop={true}
                        navigation={{
                          nextEl: ".pp-next",
                          prevEl: ".pp-prev",
                        }}
                        thumbs={{
                          swiper:
                            thumbsSwiper && !thumbsSwiper.destroyed
                              ? thumbsSwiper
                              : null,
                        }}
                      >
                        <div className="swiper-wrapper">
                          <SwiperSlide>
                            <div className="pp-slide">
                              <div className="pp-slide-img">
                                <a href="http://briefcab.com/" target="_blank">
                                  <Image
                                    priority
                                    width={520}
                                    style={{ height: "auto" }}
                                    src={Portfolio11}
                                    alt="Portfolio Thumbnail"
                                  />
                                </a>
                              </div>
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div className="pp-slide">
                              <div className="pp-slide-img">
                                <a
                                  href="https://olympustrade.ai/"
                                  target="_blank"
                                >
                                  <Image
                                    priority
                                    width={520}
                                    style={{ height: "auto" }}
                                    src={Portfolio12}
                                    alt="Portfolio Thumbnail"
                                  />
                                </a>
                              </div>
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div className="pp-slide">
                              <div className="pp-slide-img">
                                {/* <a href="/personal-portfolio-dark"> */}
                                <Image
                                  priority
                                  width={520}
                                  style={{ height: "auto" }}
                                  src={Portfolio13}
                                  alt="Portfolio Thumbnail"
                                />
                                {/* </a> */}
                              </div>
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div className="pp-slide">
                              <div className="pp-slide-img">
                                <a
                                  href="https://www.beingbitsmart.com/"
                                  target="_blank"
                                >
                                  <Image
                                    priority
                                    width={520}
                                    style={{ height: "auto" }}
                                    src={Portfolio14}
                                    alt="Portfolio Thumbnail"
                                  />
                                </a>
                              </div>
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div className="pp-slide">
                              <div className="pp-slide-img">
                                <a
                                  href="https://www.socialpillow.co/"
                                  target="_blank"
                                >
                                  <Image
                                    priority
                                    width={520}
                                    style={{ height: "auto" }}
                                    src={Portfolio15}
                                    alt="Portfolio Thumbnail"
                                  />
                                </a>
                              </div>
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div className="pp-slide">
                              <div className="pp-slide-img">
                                {/* <a  href="https://www.socialpillow.co/" target="_blank"> */}
                                <Image
                                  priority
                                  width={520}
                                  style={{ height: "auto" }}
                                  src={Portfolio16}
                                  alt="Portfolio Thumbnail"
                                />
                                {/* </a> */}
                              </div>
                            </div>
                          </SwiperSlide>
                          <SwiperSlide>
                            <div className="pp-slide">
                              <div className="pp-slide-img">
                                {/* <a  href="https://www.socialpillow.co/" target="_blank"> */}
                                <Image
                                  priority
                                  width={520}
                                  style={{ height: "auto" }}
                                  src={Portfolio17}
                                  alt="Portfolio Thumbnail"
                                />
                                {/* </a> */}
                              </div>
                            </div>
                          </SwiperSlide>
                        </div>
                      </Swiper>

                      <div
                        style={{ cursor: "pointer" }}
                        className="pp-next swipper-btn"
                      >
                        prev
                      </div>
                      <div
                        style={{ cursor: "pointer" }}
                        className="pp-prev swipper-btn"
                      >
                        Next
                      </div>
                    </div>
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-4">
                    <Swiper
                      // modules={[Thumbs, FreeMode]}
                      spaceBetween={10}
                      // loop={true}
                      slidespreview={1}
                      // freeMode={true}
                      // watchSlidesProgress
                      allowTouchMove={false}
                      className="portfolio__project-thumbs"
                      onSwiper={setThumbsSwiper}
                    >
                      <SwiperSlide>
                        <div className="pp-slide-thumb">
                          <h3 className="pp-slide-title">Design Agency</h3>
                          <p>
                            (Brief cab) Jan 2024
                            <br />( Next Js){" "}
                          </p>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="pp-slide-thumb">
                          <h3 className="pp-slide-title">
                            Crypto Trading AI Bot
                          </h3>
                          <p>
                            SEP 2023 - APRIL 2024
                            <br />( React JS + Node JS + AWS + GIT + React
                            Native + HTML + CSS + JavaScript + CI/CD)
                          </p>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="pp-slide-thumb">
                          <h3 className="pp-slide-title">
                            Attendance Mobile Application (HRM)
                          </h3>
                          <p>
                            March 2023
                            <br />( React JS + Node JS + AWS + GIT + React
                            Native + HTML + CSS + JavaScript)
                          </p>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="pp-slide-thumb">
                          <h3 className="pp-slide-title">
                            Bitsmart Technology Solutions
                          </h3>
                          <p>
                            AUG 2023
                            <br />
                            (Next JS)
                          </p>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="pp-slide-thumb">
                          <h3 className="pp-slide-title">Marketing Agency</h3>
                          <p>
                            AUG 2023
                            <br />
                            (Next JS)
                          </p>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="pp-slide-thumb">
                          <h3 className="pp-slide-title">Material Library </h3>
                          <p>
                            Jan 2021 - July 2023 <br />( React JS + Node JS +
                            AWS + GIT + React Native + HTML + CSS + JavaScript +
                            PHP )
                          </p>
                        </div>
                      </SwiperSlide>
                      <SwiperSlide>
                        <div className="pp-slide-thumb">
                          <h3 className="pp-slide-title">
                            Find Nearby Friends{" "}
                          </h3>
                          <p>
                            Jan 2022 <br />( Node JS + AWS + GIT + React Native
                            )
                          </p>
                        </div>
                      </SwiperSlide>
                    </Swiper>
                  </div>
                </div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide>
            <section className="portfolio-section portfolio__service pt-140 pb-140">
              <div className="container">
                <div className="row">
                  <div className="col-xxl-5 col-xl-5 col-lg-6 col-md-6">
                    <h2 className="sec-title"> TECH I WORK ON.</h2>
                  </div>
                  <div className="col-xxl-7 col-xl-7 col-lg-6 col-md-6">
                    <div className="sec-text">
                      <p>
                        {/* Static and dynamic secure code review can prevent a 0day
                        before your product is even released. We can integrate
                        with your dev environment */}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="portfolio__service-list">
                  <div className="row">
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                      <div className="portfolio__service-item">
                        <Link href="/service-details">
                          <h3 className="ps-title">
                            Frontend <br /> Developemnt
                          </h3>
                          <ul>
                            <li>+ React JS</li>
                            <li>+ React Native</li>
                            <li>+ HTML & CSS</li>
                            <li>+ Next JS</li>
                          </ul>
                        </Link>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                      <div className="portfolio__service-item">
                        <Link href="/service-details">
                          <h3 className="ps-title">
                            Backend
                            <br /> Developemnt
                          </h3>
                          <ul>
                            <li>+ Node Js</li>
                            <li>+ PHP</li>
                            <li>+ My Sql</li>
                            <li>+ Mongo DB</li>
                          </ul>
                        </Link>
                      </div>
                    </div>
                    <div className="col-xxl-4 col-xl-4 col-lg-4 col-md-4">
                      <div className="portfolio__service-item">
                        <Link href="/service-details">
                          <h3 className="ps-title">
                            Devops
                            <br />
                          </h3>
                          <ul>
                            <li>+ AWS</li>
                            <li>+ CI/CD</li>
                            <li>+ Webhooks</li>
                            <li>+ Nginx</li>
                            <li>+ Git/Github</li>
                          </ul>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-xxl-12">
                    <div className="ps-btn">
                      <a href="tel:+917742908001">Call Now</a>

                      {/* <strong>call now</strong> */}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </SwiperSlide>

          <SwiperSlide>
            <section className="portfolio-section portfolio__footer-area  pt-130">
              {/* Contact area start  */}
              <div className="">
                <div className="container">
                  <div className="row">
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                      <div className="sec-title-wrapper">
                        <h2 className="pf-title">Let’s get in touch 🤟</h2>
                      </div>
                    </div>
                    <div className="col-xxl-6 col-xl-6 col-lg-6 col-md-6">
                      <div className="contact__text">
                        <p>
                          {
                            "Great! i'm excited to hear from you and let's start something special togerter. call us for any inquery."
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xxl-5 col-xl-5 col-lg-5 col-md-5">
                      <div className="pf-contact">
                        <h3>
                          {"let's start something special togerter!"} <br />
                          say hello
                        </h3>
                        <ul>
                          <li>
                            <a href="tel:+917742908001">+917742908001</a>
                          </li>
                          <li>
                            <a href="mailto:gautams5974@gmail.com">
                              gautams5974@gmail.com
                            </a>
                          </li>
                        </ul>
                      </div>
                      <div className="pf-social">
                        <h3>follow </h3>
                        <ul>
                          <li>
                            <a
                              href="https://www.linkedin.com/in/gautamswami/"
                              target="_blank"
                            >
                              LinkedIn
                            </a>
                          </li>
                          <li>
                            <a
                              href="https://www.instagram.com/igautamswami"
                              target="_blank"
                            >
                              Instagram
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className="col-xxl-7 col-xl-7 col-lg-7 col-md-7">
                      <div className="contact__form">
                        <div className="pf-contact">
                          <h3>
                            <a
                              href="https://www.linkedin.com/in/gautamswami/"
                              target="_blank"
                            >
                              Linkedin.com/in/gautamswami
                            </a>
                          </h3>
                        </div>
                        {/* <form action="#">
                          <div className="row g-3">
                            <div className="col-xxl-6 col-xl-6 col-12">
                              <input
                                type="text"
                                name="name"
                                placeholder="Name *"
                              />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-12">
                              <input
                                type="email"
                                name="email"
                                placeholder="Email *"
                              />
                            </div>
                          </div>
                          <div className="row g-3">
                            <div className="col-xxl-6 col-xl-6 col-12">
                              <input
                                type="tel"
                                name="phone"
                                placeholder="Phone"
                              />
                            </div>
                            <div className="col-xxl-6 col-xl-6 col-12">
                              <input
                                type="text"
                                name="subject"
                                placeholder="Subject *"
                              />
                            </div>
                          </div>
                          <div className="row g-3">
                            <div className="col-12">
                              <textarea
                                name="message"
                                placeholder="Messages *"
                              ></textarea>
                            </div>
                          </div>
                          <div className="row g-3">
                            <div className="col-12">
                              <div className="pc-btn">
                                <button className="wc-btn-dark">
                                  Send Me Quotes
                                </button>
                              </div>
                            </div>
                          </div>
                        </form> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Contact area end  */}

              {/* Footer area start  */}

              {/* Footer area end */}
            </section>
          </SwiperSlide>
          <div className="swiper-pagination circle-pagination-2"></div>
        </Swiper>
      </div>
    </>
  );
};
export default PortfolioSwiperDestop;
