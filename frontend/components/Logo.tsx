"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  variant?: "main" | "full" | "mark";
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  priority?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  variant = "main",
  size = "md",
  className = "",
  priority = false,
}) => {
  // Dimensions tailored to keep exact aspect ratios
  // main: 452 x 230 (~1.96:1)
  // full: 452 x 260 (~1.74:1)
  // mark: 166 x 221 (~0.75:1)
  const sizeMap = {
    xs: {
      main: "h-6 w-auto",
      full: "h-7 w-auto",
      mark: "h-6 w-auto",
    },
    sm: {
      main: "h-7 w-auto",
      full: "h-8 w-auto",
      mark: "h-7 w-auto",
    },
    md: {
      main: "h-9 w-auto",
      full: "h-10 w-auto",
      mark: "h-9 w-auto",
    },
    lg: {
      main: "h-12 w-auto",
      full: "h-14 w-auto",
      mark: "h-12 w-auto",
    },
    xl: {
      main: "h-16 w-auto",
      full: "h-20 w-auto",
      mark: "h-16 w-auto",
    },
  };

  const currentClass = `${sizeMap[size][variant]} ${className} object-contain transition-opacity duration-150`;

  if (variant === "mark") {
    return (
      <span className="inline-flex items-center select-none">
        {/* Light theme mark */}
        <img
          src="/logo-mark-dark.png"
          alt="IDone"
          className={`${currentClass} dark:hidden`}
          loading={priority ? "eager" : "lazy"}
        />
        {/* Dark theme mark */}
        <img
          src="/logo-mark.png"
          alt="IDone"
          className={`${currentClass} hidden dark:inline-block`}
          loading={priority ? "eager" : "lazy"}
        />
      </span>
    );
  }

  if (variant === "full") {
    return (
      <span className="inline-flex items-center select-none">
        {/* Light theme full logo */}
        <img
          src="/logo-full-dark.png"
          alt="IDone — Decentralized Identity Vault"
          className={`${currentClass} dark:hidden`}
          loading={priority ? "eager" : "lazy"}
        />
        {/* Dark theme full logo */}
        <img
          src="/logo-full-white.png"
          alt="IDone — Decentralized Identity Vault"
          className={`${currentClass} hidden dark:inline-block`}
          loading={priority ? "eager" : "lazy"}
        />
      </span>
    );
  }

  // Default: main logo (mark + IDone.)
  return (
    <span className="inline-flex items-center select-none">
      {/* Light theme */}
      <img
        src="/logo-main-dark.png"
        alt="IDone"
        className={`${currentClass} dark:hidden`}
        loading={priority ? "eager" : "lazy"}
      />
      {/* Dark theme */}
      <img
        src="/logo-main-white.png"
        alt="IDone"
        className={`${currentClass} hidden dark:inline-block`}
        loading={priority ? "eager" : "lazy"}
      />
    </span>
  );
};
