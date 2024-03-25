import Head from "next/head";
import React, { useEffect, useState } from "react";
import $ from "jquery";
import { Power2, gsap } from "gsap";
import {
  ScrollTrigger,
  SplitText,
} from "@/plugins";
import {
  CursorAnimation,
  Switcher,
  ScrollTop,
  Preloader,
  PortfolioScrollSmootherComponents,
  PortfolioShowcaseHeader,
  PortfolioShowcaseHero,
  PortfolioShowcasePortfolio,
  PortfolioShowcaseCTA,
  PortfolioShowcaseFooter
} from "@/components";

gsap.registerPlugin(ScrollTrigger);

const PortfolioShowcaseDark = () => {
  const [mode, setMode] = useState("dark");
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (mode == "dark") {
        document.querySelector("body").classList.add("dark");
      } else {
        document.querySelector("body").classList.remove("dark");
      }
      let tHero = gsap.context(() => {
        try {
          let splitTitleLines = gsap.utils.toArray(".title-anim");

          splitTitleLines.forEach((splitTextLine) => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: splitTextLine,
                start: "top 90%",
                end: "bottom 60%",
                scrub: false,
                markers: false,
                toggleActions: "play none none none",
              },
            });

            const itemSplitted = new SplitText(splitTextLine, {
              type: "words, lines",
            });
            gsap.set(splitTextLine, { perspective: 400 });
            itemSplitted.split({ type: "lines" });
            tl.from(itemSplitted.lines, {
              duration: 1,
              delay: 0.3,
              opacity: 0,
              rotationX: -80,
              force3D: true,
              transformOrigin: "top center -50",
              stagger: 0.1,
            });
          });
          let splitTextLines = gsap.utils.toArray(".text-anim p");

          splitTextLines.forEach((splitTextLine) => {
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: splitTextLine,
                start: "top 90%",
                duration: 2,
                end: "bottom 60%",
                scrub: false,
                markers: false,
                toggleActions: "play none none none",
              },
            });

            const itemSplitted = new SplitText(splitTextLine, {
              type: "lines",
            });
            gsap.set(splitTextLine, { perspective: 400 });
            itemSplitted.split({ type: "lines" });
            tl.from(itemSplitted.lines, {
              duration: 1,
              delay: 0.5,
              opacity: 0,
              rotationX: -80,
              force3D: true,
              transformOrigin: "top center -50",
              stagger: 0.1,
            });
          });
          
          let word_come = document.querySelectorAll(".animation__word_come");
          word_come.forEach((word_come) => {
            let split_word_come = new SplitText(word_come, {
              type: "chars, words",
              // position: "absolute",
            });
            gsap.from(split_word_come.words, {
              duration: 1,
              x: 50,
              autoAlpha: 0,
              stagger: 0.05,
            });
          });
        } catch (e) {
          console.log(e);
        }
      });
      return () => tHero.revert();
    }
  }, [mode]);
  return (
    <>
      <Head>
        <title>Portfolio Showcase Dark</title>
        <meta name="description" content="Portfolio Showcase Dark Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/x-icon"
          href="assets/imgs/logo/favicon.png"
        />
      </Head>
      <main>
        <div className="has-smooth" id="has_smooth"></div>
        <PortfolioScrollSmootherComponents />
        <Preloader />
        <CursorAnimation />
        <Switcher setMode={setMode} />
        <ScrollTop />
        <PortfolioShowcaseHeader />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <div className="home-wrapper-5">
              <PortfolioShowcaseHero />
              <PortfolioShowcasePortfolio />
              <PortfolioShowcaseCTA />
              <PortfolioShowcaseFooter />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default PortfolioShowcaseDark;
