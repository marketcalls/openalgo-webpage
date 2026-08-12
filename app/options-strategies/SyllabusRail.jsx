"use client";

import LocalizedSyllabusRail from "@/components/course/LocalizedSyllabusRail";
import { PARTS } from "@/lib/optionsStrategiesCurriculum";

export default function SyllabusRail() {
  return <LocalizedSyllabusRail course="options-strategies" basePath="/options-strategies" parts={PARTS} />;
}
