export interface JSONData {
  number: string;
  portrait: string;
  name: string;
  startTerm: string;
  endTerm: string;
}

export interface President {
  number: string;
  portrait: string;
  name: string;
  startTerm: Date | null;
  endTerm: Date | null;
}
