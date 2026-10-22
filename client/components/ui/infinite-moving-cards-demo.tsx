"use client";

import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const items = [
  {
    id: 1,
    title: "Production-ready templates",
    description:
      "Seamless loops that keep content dynamic without visual jumps.",
    rating: 5,
    tags: ["testimonials"],
    name: "Ava Mitchell",
    role: "Design lead",
  },
  {
    id: 2,
    title: "Smooth and performant",
    description:
      "Linear marquee motion with hover pause for better readability.",
    rating: 5,
    tags: ["Framer Motion"],
    name: "Marcus",
    role: "Frontend engineer",
  },
  {
    id: 3,
    title: "Built for launch pages",
    description:
      "Use for logo strips, reviews, case studies, and showcase rails.",
    rating: 4,
    tags: ["Marketing"],
    name: "Lena",
    role: "Design manager",
  },
  {
    id: 4,
    title: "Trusted by teams",
    description:
      "Drop in testimonials and let them scroll on an infinite rail.",
    rating: 5,
    tags: ["reviews"],
    name: "Priya",
    role: "Product manager",
  },
  {
    id: 5,
    title: "Fully configurable",
    description:
      "Control direction, speed, gap, and pause-on-hover from props.",
    rating: 5,
    tags: ["cards"],
    name: "Diego",
    role: "Software engineer",
  },
];

export default function Default() {
  return (
    <div className="flex min-h-[420px] w-full items-center bg-background py-16">
      <InfiniteMovingCards items={items} speed="normal" direction="left" />
    </div>
  );
}
