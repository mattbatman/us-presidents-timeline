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
  startTerm: Date;
  endTerm: Date;
  partyColors: string[];
  partyNames: string[];
}

export interface ColorMark {
  number: string;
  portrait: string;
  name: string;
  startTerm: Date;
  endTerm: Date;
  partyColor: string;
  partyName: string;
}
