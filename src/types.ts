export interface JSONData {
  number: string;
  portrait: string;
  name: string;
  startTerm: string;
  endTerm: string;
  partyColor: string;
}

export interface President {
  number: string;
  portrait: string;
  name: string;
  startTerm: Date | null;
  endTerm: Date | null;
  partyColor: string;
}
