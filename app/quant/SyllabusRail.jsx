"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/quantCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="quant" basePath="/quant" parts={PARTS} />;
}
