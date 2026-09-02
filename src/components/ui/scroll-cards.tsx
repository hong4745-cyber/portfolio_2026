"use client";

import type { FC } from "react";

export interface iCardItem {
  title: string;
  description: string;
  tag: string;
  src: string;
  link: string;
  color: string;
  textColor: string;
}

interface iCardProps extends Omit<iCardItem, "src" | "link" | "tag"> {
  i: number;
  src: string;
}

const Card: FC<iCardProps> = ({ title, description, color, textColor, src, i }) => (
  <div
    className="sticky top-0 flex h-screen items-center justify-center px-4 md:p-0"
    style={{ zIndex: i + 1, marginTop: 0 }}
  >
    <div className="relative mx-auto flex h-[300px] w-full max-w-[700px] flex-col items-center justify-center overflow-hidden px-3 py-4 shadow-md md:h-[400px] md:max-w-[600px]">
      <div className="absolute inset-0 z-0">
        <img className="h-full w-full object-cover" src={src} alt="" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="relative z-10 text-center">
        <h3 className="mt-5 text-5xl font-black tracking-tight md:text-7xl" style={{ color: textColor }}>{title}</h3>
        <p className="mt-2 text-lg font-medium lowercase tracking-wide md:text-2xl" style={{ color: textColor, lineHeight: 1.4 }}>{description}</p>
      </div>
      <span className="absolute inset-0 z-10" style={{ backgroundColor: color, opacity: 0.08 }} aria-hidden="true" />
    </div>
  </div>
);

export const CardsParallax: FC<{ items: iCardItem[] }> = ({ items }) => (
  <div className="min-h-screen">
    {items.map((project, i) => <Card key={`p_${i}`} {...project} i={i} />)}
  </div>
);

export default CardsParallax;
