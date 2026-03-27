export interface CollegeDeadline {
  collegeName: string;
  type: 'ED' | 'ED2' | 'EA' | 'REA' | 'RD' | 'Financial Aid' | 'Housing Deposit';
  date: string; // ISO date string
  description: string;
}

type DeadlineTemplate = Omit<CollegeDeadline, 'collegeName'>;

// Preset deadline data for 30+ popular colleges
// Dates are for the 2026-2027 application cycle
const COLLEGE_DEADLINES: Record<string, DeadlineTemplate[]> = {
  'Harvard University': [
    { type: 'REA', date: '2026-11-01', description: 'Restrictive Early Action application deadline' },
    { type: 'RD', date: '2027-01-01', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline (FAFSA & CSS Profile)' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment and housing deposit due' },
  ],
  'Yale University': [
    { type: 'REA', date: '2026-11-01', description: 'Restrictive Early Action application deadline' },
    { type: 'RD', date: '2027-01-02', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment and housing deposit due' },
  ],
  'Princeton University': [
    { type: 'REA', date: '2026-11-01', description: 'Restrictive Early Action application deadline' },
    { type: 'RD', date: '2027-01-01', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-02-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Columbia University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'RD', date: '2027-01-01', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment and housing deposit due' },
  ],
  'University of Pennsylvania': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'RD', date: '2027-01-05', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Brown University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'RD', date: '2027-01-05', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid and CSS Profile deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Dartmouth College': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'RD', date: '2027-01-03', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Cornell University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'RD', date: '2027-01-02', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-02-15', description: 'Financial aid application deadline (FAFSA & CSS Profile)' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment and housing deposit due' },
  ],
  'Stanford University': [
    { type: 'REA', date: '2026-11-01', description: 'Restrictive Early Action application deadline' },
    { type: 'RD', date: '2027-01-05', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-02-15', description: 'CSS Profile and financial aid deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'MIT': [
    { type: 'EA', date: '2026-11-01', description: 'Early Action application deadline (non-restrictive)' },
    { type: 'RD', date: '2027-01-05', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-02-15', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Duke University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'RD', date: '2027-01-04', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Northwestern University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'RD', date: '2027-01-03', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'University of Chicago': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision I application deadline' },
    { type: 'ED2', date: '2027-01-05', description: 'Early Decision II application deadline' },
    { type: 'EA', date: '2026-11-01', description: 'Early Action application deadline' },
    { type: 'RD', date: '2027-01-05', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Johns Hopkins University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision I application deadline' },
    { type: 'ED2', date: '2027-01-03', description: 'Early Decision II application deadline' },
    { type: 'RD', date: '2027-01-03', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Vanderbilt University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision I application deadline' },
    { type: 'ED2', date: '2027-01-01', description: 'Early Decision II application deadline' },
    { type: 'RD', date: '2027-01-01', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Rice University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'RD', date: '2027-01-04', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'University of Notre Dame': [
    { type: 'REA', date: '2026-11-01', description: 'Restrictive Early Action application deadline' },
    { type: 'RD', date: '2027-01-01', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-02-15', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Georgetown University': [
    { type: 'EA', date: '2026-11-01', description: 'Early Action application deadline' },
    { type: 'RD', date: '2027-01-10', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-02-01', description: 'Financial aid application deadline (FAFSA & CSS Profile)' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'University of Southern California': [
    { type: 'EA', date: '2026-11-01', description: 'Early Action application deadline' },
    { type: 'RD', date: '2027-01-15', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid priority deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'UCLA': [
    { type: 'RD', date: '2026-11-30', description: 'UC application deadline (all UC schools)' },
    { type: 'Financial Aid', date: '2027-03-02', description: 'Cal Grant / FAFSA deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Statement of Intent to Register due' },
  ],
  'UC Berkeley': [
    { type: 'RD', date: '2026-11-30', description: 'UC application deadline (all UC schools)' },
    { type: 'Financial Aid', date: '2027-03-02', description: 'Cal Grant / FAFSA deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Statement of Intent to Register due' },
  ],
  'University of Michigan': [
    { type: 'EA', date: '2026-11-01', description: 'Early Action application deadline' },
    { type: 'RD', date: '2027-02-01', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Priority financial aid deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'University of Virginia': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision application deadline' },
    { type: 'EA', date: '2026-11-01', description: 'Early Action application deadline' },
    { type: 'RD', date: '2027-01-05', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'New York University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision I application deadline' },
    { type: 'ED2', date: '2027-01-01', description: 'Early Decision II application deadline' },
    { type: 'RD', date: '2027-01-05', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-02-15', description: 'Financial aid application deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Boston University': [
    { type: 'ED', date: '2026-11-01', description: 'Early Decision I application deadline' },
    { type: 'ED2', date: '2027-01-04', description: 'Early Decision II application deadline' },
    { type: 'RD', date: '2027-01-04', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid priority deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Georgia Tech': [
    { type: 'EA', date: '2026-10-15', description: 'Early Action I application deadline' },
    { type: 'RD', date: '2027-01-04', description: 'Regular Decision application deadline' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'Financial aid priority deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'UT Austin': [
    { type: 'EA', date: '2026-11-01', description: 'Priority application deadline' },
    { type: 'RD', date: '2026-12-01', description: 'Regular application deadline' },
    { type: 'Financial Aid', date: '2027-03-15', description: 'Financial aid priority deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'University of Florida': [
    { type: 'RD', date: '2026-11-01', description: 'Application deadline (rolling admissions)' },
    { type: 'Financial Aid', date: '2027-03-01', description: 'FAFSA priority deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Penn State': [
    { type: 'EA', date: '2026-11-01', description: 'Priority application deadline' },
    { type: 'RD', date: '2027-02-01', description: 'Regular application deadline' },
    { type: 'Financial Aid', date: '2027-02-15', description: 'FAFSA priority deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
  'Ohio State University': [
    { type: 'EA', date: '2026-11-01', description: 'Early Action application deadline' },
    { type: 'RD', date: '2027-02-01', description: 'Regular application deadline' },
    { type: 'Financial Aid', date: '2027-02-01', description: 'FAFSA priority deadline' },
    { type: 'Housing Deposit', date: '2027-05-01', description: 'Enrollment deposit due' },
  ],
};

/**
 * Returns all preset deadlines for a given college.
 * Matches against the preset database by name (case-insensitive, partial match).
 */
export function getDeadlinesForCollege(collegeName: string): CollegeDeadline[] {
  const normalised = collegeName.toLowerCase().trim();

  // Try exact match first
  for (const [name, templates] of Object.entries(COLLEGE_DEADLINES)) {
    if (name.toLowerCase() === normalised) {
      return templates.map(t => ({ ...t, collegeName: name }));
    }
  }

  // Partial / fuzzy match
  for (const [name, templates] of Object.entries(COLLEGE_DEADLINES)) {
    if (
      name.toLowerCase().includes(normalised) ||
      normalised.includes(name.toLowerCase())
    ) {
      return templates.map(t => ({ ...t, collegeName: name }));
    }
  }

  return [];
}

/**
 * Returns all deadlines for the given college names, sorted by date ascending.
 */
export function getUpcomingDeadlines(collegeNames: string[]): CollegeDeadline[] {
  const all: CollegeDeadline[] = [];

  for (const name of collegeNames) {
    all.push(...getDeadlinesForCollege(name));
  }

  return all.sort((a, b) => a.date.localeCompare(b.date));
}
