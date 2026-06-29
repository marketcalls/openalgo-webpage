import "../stocks/stocks-portal.css";

import { CHAPTERS } from "@/lib/psychologyCurriculum";

import SyllabusRail from "./SyllabusRail";

export const metadata = {
  title: "Trading Psychology & Risk Playbooks - Learn with OpenAlgo",
  description:
    `A free, beginner-friendly ${CHAPTERS.length}-chapter course on trading psychology and practical risk playbooks for the Indian markets - mastering your own mind, hedging when it makes sense (and when not), the option-seller and hedger playbook, and a complete, ready-to-use risk plan for every type of participant.`,
};

export default function PsychologyLayout({ children }) {
  return (
    <div className="mx-auto w-full max-w-[1500px] lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <SyllabusRail />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
