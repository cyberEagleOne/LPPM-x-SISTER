export interface PeriodeDeadlines {
  submissionStart: string | null;
  submissionDeadline: string | null;
  revisionDeadline: string | null;
  coordinatorDeadline: string | null;
  ketuaLppmDeadline: string | null;
  freezeStart: string | null;
  freezeEnd: string | null;
  keterangan: string | null;
}

export interface PeriodePublikasi {
  id: string;
  tahun: string;
  semester: string;
  aktif: boolean;
  deadlines?: PeriodeDeadlines;
}
