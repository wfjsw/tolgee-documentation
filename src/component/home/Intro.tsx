import { useMediaQuery, useTheme } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, Scene } from 'react-scrollmagic';
import { GradientText } from '../GradientText';
import { ImageColumn } from '../pageComponents/twoColumnSection/ImageColumn';
import {
  TextColumn,
  TextColumnText,
  TextColumnTitle,
} from '../pageComponents/twoColumnSection/TextColumn';
import { ParallaxImage } from './ParallaxImage';
import './Intro.css';

const useAnimationController = () => {
  const state = useRef<Record<number, boolean | undefined>>({});
  const elements = useRef<Record<number, HTMLElement>>({});

  return (
    element: HTMLElement,
    condition: boolean,
    id: number,
    animate: string,
    justShow?: string
  ) => {
    if (!elements.current[id] || elements.current[id] !== element) {
      state.current[id] = undefined;
      elements.current[id] = element;
    }

    if (condition) {
      if (state.current[id] === false) {
        if (!element.classList.contains(animate)) {
          element.classList.add(animate);
        }
      } else if (state.current[id] === undefined) {
        if (justShow && !element.classList.contains(justShow)) {
          element.classList.add(justShow);
        }
      }
      state.current[id] = true;
    }
    if (!condition) {
      if (state.current[id] !== undefined) {
        element.classList.remove(animate, justShow);
      }
      state.current[id] = false;
    }
  };
};

const AheadParallax = ({ progress }) => {
  const controlIn = useAnimationController();
  const controlOut = useAnimationController();
  useEffect(() => {
    const svgParts = Array.from(
      document.querySelectorAll('.intro__element')
    ) as HTMLElement[];

    svgParts.forEach((layer) => {
      layer.style.transformOrigin = 'center center';
    });

    function parallax() {
      svgParts.forEach((layer: HTMLElement) => {
        const time = Number(layer.getAttribute('data-parallax-timing')) + 0.2;

        controlIn(
          layer,
          progress > time,
          time,
          'intro__element--fly-in',
          'intro__element--final'
        );

        controlOut(layer, progress < time, time, 'intro__element--fly-out');
      });
    }
    parallax();
  });
  return <div />;
};

const DURATION = 700;

export const Intro = () => {
  const [viewPortHeight, setViewPortHeight] = useState(0);

  useEffect(() => {
    const handler = () => setViewPortHeight(window.innerHeight);
    handler();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const [isEnabled, setIsEnabled] = useState(true);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(
      navigator?.userAgent
    );
    setIsEnabled(!isSmall && !isSafari);
  }, [isSmall]);

  return isEnabled !== undefined ? (
    <div
      style={{
        marginTop: isEnabled ? '10vh' : 50,
        marginBottom: isEnabled ? '10vh' : -DURATION + 150,
      }}
    >
      <Controller>
        <Scene
          duration={viewPortHeight * 0.7 + DURATION}
          enabled={isEnabled}
          offset={-viewPortHeight * 0.5}
        >
          {(progress) => (
            <div>
              <AheadParallax progress={isEnabled ? progress : 1} />
            </div>
          )}
        </Scene>
        <Scene
          pin
          duration={DURATION}
          offset={viewPortHeight / 8 + 150}
          enabled={isEnabled}
        >
          <section className="flex justify-center w-[100vw]">
            {Boolean(viewPortHeight) && (
              <div className="flex gap-12 sm:m-12 m-8 flex-col lg:flex-row md:max-w-[1500px] flex-grow">
                <ImageColumn>
                  <ParallaxImage />
                </ImageColumn>
                <TextColumn
                  className="md:min-w-[360px] lg:items-end md:items-center
                             md:text-center lg:text-left lg:mt-[60px]"
                >
                  <TextColumnTitle>The revolution is here</TextColumnTitle>
                  <TextColumnText>
                    Speed up your translation process by{' '}
                    <span>
                      <GradientText>90%</GradientText>
                    </span>
                    . Set up in seconds with{' '}
                    <GradientText>revolutionary</GradientText> integrations. Let{' '}
                    your colleagues easily translate your App with the{' '}
                    <GradientText>in-context</GradientText> translating feature.
                  </TextColumnText>
                </TextColumn>
              </div>
            )}
          </section>
        </Scene>
      </Controller>
    </div>
  ) : null;
};
