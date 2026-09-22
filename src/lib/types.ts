export interface CaseEntry {
  id: string;
  challengeName: string;
  host: string;
  teamName: string | null;
  members: string[];
  rank: number | null;
  positionLabel: string | null;
  problemStatementUrl: string | null;
  solutionDeckUrl: string | null;
  photosUrl: string | null;
  cohort: string;
  featured: boolean;
}

export type OpportunityStatus = "Open" | "Closing soon" | "Closed";

export interface CaseOpportunity {
  id: string;
  name: string;
  host: string;
  eligibility: string | null;
  deadline: string | null; // ISO date
  applyUrl: string | null;
  prize: string | null;
  status: OpportunityStatus;
  notes: string | null;
}
