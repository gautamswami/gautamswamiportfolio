import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import logoWhite2 from "../../../public/assets/imgs/logo/site-logo-white-2.png";
import Shape11 from "../../../public/assets/imgs/shape/11.png";
import Shape12 from "../../../public/assets/imgs/shape/12.png";
import Image from "next/image";

const Canvas = ({ bladeMode }) => {
  const [accordion, setAccordion] = useState(0);
  const [subAccordion, setSubAccordion] = useState(0);
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document
          .querySelectorAll(".header_title > a")
          .forEach(
            (button) =>
              (button.innerHTML =
                '<div class="menu-text"><span>' +
                button.textContent.split("").join("</span><span>") +
                "</span></div>")
          );

        setTimeout(() => {
          var menu_text = document.querySelectorAll(".menu-text span");
          menu_text.forEach((item) => {
            var font_sizes = window.getComputedStyle(item, null);
            let font_size = font_sizes.getPropertyValue("font-size");
            let size_in_number = parseInt(font_size.replace("px", ""));
            let new_size = parseInt(size_in_number / 3);
            new_size = new_size + "px";
            if (item.innerHTML == " ") {
              item.style.width = new_size;
            }
          });
        }, 1000);
      }, 10);
    }
  }, []);
  const openData = (data) => {
    setAccordion(data);
  };
  const openSubData = (data) => {
    setSubAccordion(data);
  };
  const closeCanvas = () => {
    document.querySelector(".offcanvas__area").style.opacity = "0";
    document.querySelector(".offcanvas__area").style.visibility = "hidden";
    if (bladeMode) {
      let header_bg = document.querySelector(".header__area");
      header_bg.style.setProperty("mix-blend-mode", "exclusion");
    }
  };
  return (
    <>
      <div className="offcanvas__area">
        <div className="offcanvas__body">
          <div className="offcanvas__left">
            <div className="offcanvas__logo">
              <Link href="/digital-marketing">
                <Image
                  priority
                  style={{ width: "auto", height: "auto" }}
                  src={logoWhite2}
                  alt="Offcanvas Logo"
                />
              </Link>
            </div>
            <div className="offcanvas__social">
              <h3 className="social-title">Follow Us</h3>
              <ul>
                <li>
                  <a href="#">Dribbble</a>
                </li>
                <li>
                  <a href="#">Behance</a>
                </li>
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">Facebook</a>
                </li>
                <li>
                  <a href="#">Twitter</a>
                </li>
                <li>
                  <a href="#">YouTube</a>
                </li>
              </ul>
            </div>
            <div className="offcanvas__links">
              <ul>
                <li>
                  <Link href="/about">About</Link>
                </li>
                <li>
                  <Link href="/contact">contact</Link>
                </li>
                <li>
                  <Link href="/career">Career</Link>
                </li>
                <li>
                  <Link href="/blog">blog</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="offcanvas__mid">
            <div className="offcanvas__menu-wrapper">
              <nav className="offcanvas__menu">
                <ul className="menu-anim title">
                  <li>
                    <div className="header_title">
                      <Link href={"/digital-marketing"}>HOME</Link>
                      <div className="accordian-btn">
                        {accordion === 1 ? (
                          <a onClick={() => openData(0)}>-</a>
                        ) : (
                          <a onClick={() => openData(1)}>+</a>
                        )}
                      </div>
                    </div>
                    <ul
                      className="sub_title"
                      style={
                        accordion === 1 ? { display: "" } : { display: "none" }
                      }
                    >
                      <li>
                        <Link href={"/digital-marketing"}>
                          Digital Maketing
                        </Link>
                      </li>
                      <li>
                        <Link href={"/digital-marketing-dark"}>
                          Digital Maketing dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/design-studio"}>Design Studio </Link>
                      </li>
                      <li>
                        <Link href={"/design-studio-dark"}>
                          Design Studio dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/digital-agency"}>Digital Agency</Link>
                      </li>
                      <li>
                        <Link href={"/digital-agency-dark"}>
                          Digital Agency dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/creative-agency"}>creative Agency</Link>
                      </li>
                      <li>
                        <Link href={"/creative-agency"}>
                          creative Agency dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/startup-agency"}>Startup Agency</Link>
                      </li>
                      <li>
                        <Link href={"/startup-agency-dark"}>
                          Startup Agency dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/modern-agency"}>modern agency</Link>
                      </li>
                      <li>
                        <Link href={"/modern-agency-dark"}>
                          modern agency dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/personal-portfolio"}>
                          personal Portfolio
                        </Link>
                      </li>
                      <li>
                        <Link href={"/personal-portfolio-dark"}>
                          personal Portfolio dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/portfolio-showcase"}>
                        Portfolio Showcase
                        </Link>
                      </li>
                      <li>
                        <Link href={"/portfolio-showcase-dark"}>
                        Portfolio Showcase dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/showcase-carousel"}>
                        Showcase Carousel
                        </Link>
                      </li>
                      <li>
                        <Link href={"/showcase-carousel-dark"}>
                        Showcase Carousel dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/interective-link"}>
                        Interective Link
                        </Link>
                      </li>
                      <li>
                        <Link href={"/interective-link-dark"}>
                        Interective Link dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/portfolio-masonry"}>
                        Portfolio Masonry
                        </Link>
                      </li>
                      <li>
                        <Link href={"/portfolio-masonry-dark"}>
                        Portfolio Masonry dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/vertical-grid"}>
                        Vertical Grid
                        </Link>
                      </li>
                      <li>
                        <Link href={"/vertical-grid-dark"}>
                        Vertical Grid dark
                        </Link>
                      </li>
                      <li>
                        <Link href={"/showcase-parallax"}>
                        Showcase Parallax
                        </Link>
                      </li>
                      <li>
                        <Link href={"/showcase-parallax-dark"}>
                        Showcase Parallax Dark
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="header_title">
                      <Link href={"/about"}>ABOUT</Link>
                    </div>
                  </li>
                  <li>
                    <div className="header_title d-flex">
                      <Link href={"/service"}>SERVICE</Link>
                      <div className="accordian-btn">
                        {accordion === 3 ? (
                          <a onClick={() => openData(0)}>-</a>
                        ) : (
                          <a onClick={() => openData(3)}>+</a>
                        )}
                      </div>
                    </div>
                    <ul
                      className="sub_title"
                      style={
                        accordion === 3 ? { display: "" } : { display: "none" }
                      }
                    >
                      <li>
                        <Link href={"/service"}>service</Link>
                      </li>
                      <li>
                        <Link href={"/service-dark"}>service dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v2"}>service v2</Link>
                      </li>
                      <li>
                        <Link href={"/service-v2-dark"}>service v2 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v3"}>service v3</Link>
                      </li>
                      <li>
                        <Link href={"/service-v3-dark"}>service v3 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v4"}>service v4</Link>
                      </li>
                      <li>
                        <Link href={"/service-v4-dark"}>service v4 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v5"}>service v5</Link>
                      </li>
                      <li>
                        <Link href={"/service-v5-dark"}>service v5 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v6"}>service v6</Link>
                      </li>
                      <li>
                        <Link href={"/service-v6-dark"}>service v6 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-details"}>service details</Link>
                      </li>
                      <li>
                        <Link href={"/service-details-dark"}>
                          service details dark
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="header_title d-flex">
                      <Link href={"#"}>PAGES</Link>
                      <div className="accordian-btn">
                        {accordion === 4 ? (
                          <a onClick={() => openData(0)}>-</a>
                        ) : (
                          <a onClick={() => openData(4)}>+</a>
                        )}
                      </div>
                    </div>
                    <ul
                      className="sub_title"
                      style={
                        accordion === 4 ? { display: "" } : { display: "none" }
                      }
                    >
                      <li className="sub_header_title">
                        <div className="d-flex justify-content-between">
                          <Link href={"/service"}>Service</Link>
                          <div className="sub-accordian-btn">
                            {subAccordion === 4.1 ? (
                              <a onClick={() => openSubData(4)}>-</a>
                            ) : (
                              <a onClick={() => openSubData(4.1)}>+</a>
                            )}
                          </div>
                        </div>
                        <ul
                          className="sub_title_2"
                          style={
                            subAccordion === 4.1
                              ? { display: "" }
                              : { display: "none" }
                          }
                        >
                          <li>
                        <Link href={"/service"}>service</Link>
                      </li>
                      <li>
                        <Link href={"/service-dark"}>service dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v2"}>service v2</Link>
                      </li>
                      <li>
                        <Link href={"/service-v2-dark"}>service v2 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v3"}>service v3</Link>
                      </li>
                      <li>
                        <Link href={"/service-v3-dark"}>service v3 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v4"}>service v4</Link>
                      </li>
                      <li>
                        <Link href={"/service-v4-dark"}>service v4 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v5"}>service v5</Link>
                      </li>
                      <li>
                        <Link href={"/service-v5-dark"}>service v5 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-v6"}>service v6</Link>
                      </li>
                      <li>
                        <Link href={"/service-v6-dark"}>service v6 dark</Link>
                      </li>
                      <li>
                        <Link href={"/service-details"}>service details</Link>
                      </li>
                      <li>
                        <Link href={"/service-details-dark"}>
                          service details dark
                        </Link>
                      </li>
                        </ul>
                      </li>
                      <li className="sub_header_title">
                        <div className="d-flex justify-content-between">
                          <Link href={"/portfolio"}>Portfolio</Link>
                          <div className="sub-accordian-btn">
                            {subAccordion === 4.2 ? (
                              <a onClick={() => openSubData(4)}>-</a>
                            ) : (
                              <a onClick={() => openSubData(4.2)}>+</a>
                            )}
                          </div>
                        </div>

                        <ul
                          className="sub_title_2"
                          style={
                            subAccordion === 4.2
                              ? { display: "" }
                              : { display: "none" }
                          }
                        >
                          <li>
                            <Link href={"/portfolio"}>portfolio</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-dark"}>portfolio dark</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-v2"}>portfolio v2</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-v2-dark"}>portfolio v2 dark</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-v3"}>portfolio v3</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-v3-dark"}>portfolio v3 dark</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-v4"}>portfolio v4</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-v4-dark"}>portfolio v4 dark</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-v5"}>portfolio v5</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-v5-dark"}>portfolio v5 dark</Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-details"}>
                              portfolio details
                            </Link>
                          </li>
                          <li>
                            <Link href={"/portfolio-details-dark"}>
                              portfolio details dark
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="sub_header_title">
                        <div className="d-flex justify-content-between">
                          <Link href={"/team"}>team</Link>
                          <div className="sub-accordian-btn">
                            {subAccordion === 4.3 ? (
                              <a onClick={() => openSubData(4)}>-</a>
                            ) : (
                              <a onClick={() => openSubData(4.3)}>+</a>
                            )}
                          </div>
                        </div>

                        <ul
                          className="sub_title_2"
                          style={
                            subAccordion === 4.3
                              ? { display: "" }
                              : { display: "none" }
                          }
                        >
                          <li>
                            <Link href={"/team"}>Team</Link>
                          </li>
                          <li>
                            <Link href={"/team-dark"}>Team dark</Link>
                          </li>
                          <li>
                            <Link href={"/team-details"}>Team Details</Link>
                          </li>
                          <li>
                            <Link href={"/team-details-dark"}>
                              Team Details dark
                            </Link>
                          </li>
                          <li>
                            <Link href={"/career"}>career</Link>
                          </li>
                          <li>
                            <Link href={"/career-dark"}>career dark</Link>
                          </li>
                          <li>
                            <Link href={"/job-details"}>job details</Link>
                          </li>
                          <li>
                            <Link href={"/job-details-dark"}>
                              job details dark
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="sub_header_title">
                        <div className="d-flex justify-content-between">
                          <Link href={"/blog"}>blog</Link>
                          <div className="sub-accordian-btn">
                            {subAccordion === 4.4 ? (
                              <a onClick={() => openSubData(4)}>-</a>
                            ) : (
                              <a onClick={() => openSubData(4.4)}>+</a>
                            )}
                          </div>
                        </div>

                        <ul
                          className="sub_title_2"
                          style={
                            subAccordion === 4.4
                              ? { display: "" }
                              : { display: "none" }
                          }
                        >
                          <li>
                            <Link href={"/blog"}>blog</Link>
                          </li>
                          <li>
                            <Link href={"/blog-dark"}>blog dark</Link>
                          </li>
                          <li>
                            <Link href={"/blog-v2"}>blog V2</Link>
                          </li>
                          <li>
                            <Link href={"/blog-v2-dark"}>blog v2 dark</Link>
                          </li>
                          <li>
                            <Link href={"/category"}>category</Link>
                          </li>
                          <li>
                            <Link href={"/category-dark"}>category dark</Link>
                          </li>
                          <li>
                            <Link href={"/blog-details"}>blog details</Link>
                          </li>
                          <li>
                            <Link href={"/blog-details"}>
                              blog details dark
                            </Link>
                          </li>
                        </ul>
                      </li>
                      <li className="sub_header_title">
                        <div className="d-flex justify-content-between">
                          <Link href={"#"}>Others</Link>
                          <div className="sub-accordian-btn">
                            {subAccordion === 4.5 ? (
                              <a onClick={() => openSubData(4)}>-</a>
                            ) : (
                              <a onClick={() => openSubData(4.5)}>+</a>
                            )}
                          </div>
                        </div>

                        <ul
                          className="sub_title_2"
                          style={
                            subAccordion === 4.5
                              ? { display: "" }
                              : { display: "none" }
                          }
                        >
                          <li>
                            <Link href={"/about"}>about</Link>
                          </li>
                          <li>
                            <Link href={"/about-dark"}>about dark</Link>
                          </li>
                          <li>
                            <Link href={"/faq"}>FAQs</Link>
                          </li>
                          <li>
                            <Link href={"/faq-dark"}>FAQs dark</Link>
                          </li>
                          <li>
                            <Link href={"/contact"}>contact</Link>
                          </li>
                          <li>
                            <Link href={"/contact-dark"}>contact dark</Link>
                          </li>
                          <li>
                            <Link href={"/error"}>404</Link>
                          </li>
                          <li>
                            <Link href={"/error-dark"}>404 dark</Link>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="header_title">
                      <Link href={"/blog"}>BLOG</Link>
                      <div className="accordian-btn">
                        {accordion === 5 ? (
                          <a onClick={() => openData(0)}>-</a>
                        ) : (
                          <a onClick={() => openData(5)}>+</a>
                        )}
                      </div>
                    </div>
                    <ul
                      className="sub_title"
                      style={
                        accordion === 5 ? { display: "" } : { display: "none" }
                      }
                    >
                      <li>
                        <Link href={"/blog"}>blog</Link>
                      </li>
                      <li>
                        <Link href={"/blog-dark"}>blog dark</Link>
                      </li>
                      <li>
                        <Link href={"/blog-v2"}>blog v2</Link>
                      </li>
                      <li>
                        <Link href={"/blog-v2-dark"}>blog v2 dark</Link>
                      </li>
                      <li>
                        <Link href={"/blog-details"}>blog details</Link>
                      </li>
                      <li>
                        <Link href={"/blog-details-dark"}>
                          blog details dark
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <div className="header_title">
                      <Link href={"/contact"}>CONTACT</Link>
                    </div>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          <div className="offcanvas__right">
            <div className="offcanvas__search">
              <form action="#">
                <input type="text" name="search" placeholder="Search keyword" />
                <button>
                  <FontAwesomeIcon icon={faMagnifyingGlass}></FontAwesomeIcon>
                </button>
              </form>
            </div>
            <div className="offcanvas__contact">
              <h3>Get in touch</h3>
              <ul>
                <li>
                  <a href="tel:02094980547">+(02) - 094 980 547</a>
                </li>
                <li>
                  <a href="mailto:info@extradesign.com">info@extradesign.com</a>
                </li>
                <li>230 Norman Street New York, QC (USA) H8R 1A1</li>
              </ul>
            </div>
            <Image
              priority
              style={{ width: "auto", height: "auto" }}
              src={Shape11}
              alt="shape"
              className="shape-1"
            />
            <Image
              priority
              style={{ width: "auto", height: "auto" }}
              src={Shape12}
              alt="shape"
              className="shape-2"
            />
          </div>
          {bladeMode ? (
            <div className="offcanvas__close">
              <button type="button" onClick={closeCanvas}>
                <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
              </button>
            </div>
          ) : (
            <div className="offcanvas__close">
              <button type="button" onClick={closeCanvas}>
                <FontAwesomeIcon icon={faXmark}></FontAwesomeIcon>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Canvas;
