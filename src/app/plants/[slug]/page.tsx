import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { plantsData } from "@/lib/plantsData";
import PlantDetailClient from "@/components/PlantDetailClient";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return plantsData.map((plant) => ({
    slug: plant.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const plant = plantsData.find((p) => p.slug === slug);
  
  if (!plant) {
    return {
      title: "Plant Care Guide Not Found",
    };
  }

  return {
    title: `${plant.name} Care Guide | UGAMA AARAMBHA 2K26`,
    description: `Learn how to take care of ${plant.name} (${plant.scientificName}) in your home garden. Sunlight, water, soil, fertilizer, pruning, pest defense, and health benefits.`,
  };
}

export default async function PlantDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const plant = plantsData.find((p) => p.slug === slug);

  if (!plant) {
    notFound();
  }

  return <PlantDetailClient plant={plant} />;
}
