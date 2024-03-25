import Head from "next/head";
import React, { useEffect, useState } from "react";
import allNavData from "../data/navData.json";
import { gsap } from "gsap";
import {
  SplitText,
} from "@/plugins";
import {
  CursorAnimation,
  Switcher,
  ScrollTop2,
  Preloader,
  ScrollSmootherComponents,
  ShowcaseCarouselHeader,
  PortfolioMasonryHero,
  ModernAgencyFooter,
  PortfolioMasonryGallery
} from "@/components";

const PortfolioMasonryDark = () => {
  const [mode, setMode] = useState("dark");
  const [navData, setNavData] = useState({});
  useEffect(() => {
    setNavData(allNavData);
    if (typeof window !== "undefined") {
      if (mode == "dark") {
        document.querySelector("body").classList.add("dark");
      } else {
        document.querySelector("body").classList.remove("dark");
      }
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
      });
      return () => tHero.revert();
    }
  }, [mode]);
  return (
    <>
      <Head>
        <title>Portfolio Mesonry Dark</title>
        <meta name="description" content="Portfolio Mesonry Dark Description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="icon"
          type="image/x-icon"
          href="assets/imgs/logo/favicon.png"
        />
      </Head>
      <main>
        <div className="has-smooth" id="has_smooth"></div>
        <ScrollSmootherComponents />
        <Preloader />
        <CursorAnimation />
        <Switcher setMode={setMode} />
        <ScrollTop2 />
        <ShowcaseCarouselHeader navData={navData} />
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <PortfolioMasonryHero />
            <PortfolioMasonryGallery />
            <ModernAgencyFooter />
          </div>
        </div>
      </main>
    </>
  );
};

export default PortfolioMasonryDark;
