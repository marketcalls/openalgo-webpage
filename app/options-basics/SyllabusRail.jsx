"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/optionsBasicsCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="options-basics" basePath="/options-basics" parts={PARTS} />;
}
