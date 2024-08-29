export interface JSONData {
  number: string;
  portrait: string;
  name: string;
  startTerm: string;
  endTerm: string;
  partyColors: string[];
  partyNames: string[];
}

export interface President {
  number: string;
  portrait: string;
  name: string;
  startTerm: Date | null;
  endTerm: Date | null;
  partyColors: string[];
  partyNames: string[];
}

export interface ColorMark {
  number: string;
  portrait: string;
  name: string;
  startTerm: Date | null;
  endTerm: Date | null;
  partyColor: string;
  partyName: string;
}
