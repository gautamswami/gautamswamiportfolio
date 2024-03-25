import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger, SplitText } from "@/plugins";
import $ from "jquery";
import Link from "next/link";
import Portfilio61 from "../../../public/assets/imgs/portfolio/6/1.jpg";
import Portfilio62 from "../../../public/assets/imgs/portfolio/6/2.jpg";
import Portfilio63 from "../../../public/assets/imgs/portfolio/6/3.jpg";
import Portfilio64 from "../../../public/assets/imgs/portfolio/6/4.jpg";
import Portfilio65 from "../../../public/assets/imgs/portfolio/6/5.jpg";
import Portfilio66 from "../../../public/assets/imgs/portfolio/6/6.jpg";
import Portfilio67 from "../../../public/assets/imgs/portfolio/6/7.jpg";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

const Portfolio1 = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const portfolioItems = document.querySelectorAll(".portfolio__item-6");
      const totalPortfolioItems = portfolioItems.length;

      if (totalPortfolioItems) {
        document.querySelector(".portfolio__total").innerHTML =
          totalPortfolioItems;
      }

      var total_portfolio_item = $(".portfolio__item-6").length;
      if (total_portfolio_item) {
        $(".portfolio__total").html(total_portfolio_item);
      }

      $(document).on("scroll", function () {
        $(".portfolio__item-6").each(function () {
          if (
            $(this).position().top <= $(document).scrollTop() &&
            $(this).position().top + $(this).outerHeight() >
              $(document).scrollTop()
          ) {
            var item_num = $(this).data("portfitem");
            $(".portfolio__current").html(item_num);
            $(this).addClass("active").siblings().removeClass("active");
          }
        });
      });

      let tHero = gsap.context(() => {
        let char_come = document.querySelectorAll(".animation__char_come");

        char_come.forEach((char_come) => {
          let split_char = new SplitText(char_come, { type: "chars, words" });
          gsap.from(split_char.chars, {
            duration: 1,
            x: 70,
            autoAlpha: 0,
            stagger: 0.05,
          });
        });
        let char_come_long = document.querySelectorAll(
          ".animation__char_come_long"
        );

        char_come_long.forEach((char_come) => {
          let split_char = new SplitText(char_come, { type: "chars, words" });
          gsap.from(split_char.chars, {
            duration: 1,
            x: 70,
            autoAlpha: 0,
            stagger: 0.15,
          });
        });
        const portfolio_listss = gsap.utils.toArray(".portfolio__item-6 img");
        let portf_cursor_6 = document.getElementById("portf_cursor_6");
        if (portfolio_listss) {
          portfolio_listss.forEach((item, i) => {
            gsap.from(item, {
              scrollTrigger: {
                trigger: item,
                start: "top center",
                scrub: 1.5,
              },
              scale: 2.5,
              duration: 1,
            });
          });
        }
        function mousemoveHandler(e) {
          const target = e.target;

          let tl = gsap.timeline({
            defaults: {
              x: e.clientX,
              y: e.clientY,
            },
          });
          let t2 = gsap.timeline({
            defaults: {
              x: e.clientX,
              y: e.clientY,
            },
          });

          // Portfolio Cursor
          if (target.closest(".portfolio__item-6")) {
            tl.to(
              portf_cursor_6,
              {
                opacity: 1,
                ease: "power4.out",
              },
              "-=0.3"
            );
          } else {
            t2.to(
              portf_cursor_6,
              {
                opacity: 0,
                ease: "power4.out",
              },
              "-=0.3"
            );
          }
        }
        ScrollTrigger.create({
          trigger: ".portfolio__wrapper-6",
          start: "top top",
          end: "bottom bottom",
          pin: ".portfolio__title-wrap-6",
          pinSpacing: false,
        });
        document.addEventListener("mousemove", mousemoveHandler);
      });
      return () => {
        tHero.revert();
      };
    }
  }, []);
  return (
    <>
      <section className="portfolio__area-6">
        <div className="container line pt-100 pb-140">
          <span className="line-3"></span>
          <div className="zi-9">
            <div className="row">
              <div className="col-xxl-4 col-xl-5 col-lg-5 col-md-6">
                <div className="sec-title-wrapper portfolio__title-wrap-6">
                  <div className="">
                    <h2 className="sec-sub-title animation__char_come">
                      Featured
                    </h2>
                    <h3 className="sec-title animation__char_come_long">
                      Work
                    </h3>
                    <p>
                      View the full case study of our recent featured and
                      awesome works that we created for our clients.
                    </p>
                  </div>
                  <div className="portfolio__pagination-6">
                    <span className="portfolio__current">01</span> / 0
                    <span className="portfolio__total"></span>
                  </div>
                </div>
              </div>

              <div className="col-xxl-8 col-xl-7 col-lg-7 col-md-6">
                <div className="portfolio__wrapper-6">
                  <div className="portfolio__list-6">
                    <div className="portfolio__item-6" data-portfitem="1">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          style={{ height: "auto" }}
                          src={Portfilio61}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="2">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          style={{ height: "auto" }}
                          src={Portfilio62}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="3">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          style={{ height: "auto" }}
                          src={Portfilio63}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="4">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          style={{ height: "auto" }}
                          src={Portfilio64}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="5">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          style={{ height: "auto" }}
                          src={Portfilio65}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="6">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          style={{ height: "auto" }}
                          src={Portfilio66}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>

                    <div className="portfolio__item-6" data-portfitem="7">
                      <Link href="/portfolio-details">
                        <Image
                          priority
                          width={770}
                          style={{ height: "auto" }}
                          src={Portfilio67}
                          alt="Portfolio Image"
                          data-speed="0.4"
                        />
                        <div className="portfolio__content-6">
                          <h4 className="portfolio__title-6">Lionpro Agency</h4>
                          <h5 className="portfolio__date">02 May 2021</h5>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Portfolio1;
