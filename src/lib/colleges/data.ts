// College selectivity data for match algorithm
// Data represents approximate ranges for admitted students

export interface CollegeStats {
  name: string;
  acceptanceRate: number; // 0-100
  satRange: [number, number]; // 25th-75th percentile
  actRange: [number, number]; // 25th-75th percentile
  avgGPA: number; // unweighted 4.0 scale
  category: 'ivy' | 'elite' | 'highly_selective' | 'selective' | 'moderate' | 'accessible';
}

// Curated list of ~80 popular colleges with selectivity data
export const COLLEGE_DATABASE: CollegeStats[] = [
  // Ivy League
  { name: 'Harvard University', acceptanceRate: 3, satRange: [1480, 1580], actRange: [34, 36], avgGPA: 3.95, category: 'ivy' },
  { name: 'Yale University', acceptanceRate: 4, satRange: [1470, 1570], actRange: [34, 36], avgGPA: 3.94, category: 'ivy' },
  { name: 'Princeton University', acceptanceRate: 4, satRange: [1480, 1580], actRange: [34, 36], avgGPA: 3.94, category: 'ivy' },
  { name: 'Columbia University', acceptanceRate: 4, satRange: [1470, 1570], actRange: [34, 36], avgGPA: 3.93, category: 'ivy' },
  { name: 'University of Pennsylvania', acceptanceRate: 5, satRange: [1460, 1570], actRange: [34, 36], avgGPA: 3.92, category: 'ivy' },
  { name: 'Brown University', acceptanceRate: 5, satRange: [1440, 1560], actRange: [33, 35], avgGPA: 3.92, category: 'ivy' },
  { name: 'Dartmouth College', acceptanceRate: 6, satRange: [1440, 1560], actRange: [33, 35], avgGPA: 3.90, category: 'ivy' },
  { name: 'Cornell University', acceptanceRate: 7, satRange: [1420, 1550], actRange: [33, 35], avgGPA: 3.90, category: 'ivy' },

  // Elite (non-Ivy)
  { name: 'Stanford University', acceptanceRate: 3, satRange: [1480, 1580], actRange: [34, 36], avgGPA: 3.96, category: 'elite' },
  { name: 'MIT', acceptanceRate: 3, satRange: [1510, 1580], actRange: [35, 36], avgGPA: 3.96, category: 'elite' },
  { name: 'Caltech', acceptanceRate: 3, satRange: [1530, 1580], actRange: [36, 36], avgGPA: 3.97, category: 'elite' },
  { name: 'Duke University', acceptanceRate: 5, satRange: [1460, 1570], actRange: [34, 36], avgGPA: 3.94, category: 'elite' },
  { name: 'University of Chicago', acceptanceRate: 5, satRange: [1480, 1570], actRange: [34, 36], avgGPA: 3.93, category: 'elite' },
  { name: 'Northwestern University', acceptanceRate: 7, satRange: [1440, 1550], actRange: [34, 35], avgGPA: 3.92, category: 'elite' },
  { name: 'Johns Hopkins University', acceptanceRate: 7, satRange: [1450, 1560], actRange: [34, 35], avgGPA: 3.92, category: 'elite' },
  { name: 'Vanderbilt University', acceptanceRate: 6, satRange: [1440, 1560], actRange: [34, 35], avgGPA: 3.90, category: 'elite' },
  { name: 'Rice University', acceptanceRate: 8, satRange: [1430, 1550], actRange: [34, 35], avgGPA: 3.90, category: 'elite' },
  { name: 'Washington University in St. Louis', acceptanceRate: 10, satRange: [1430, 1550], actRange: [33, 35], avgGPA: 3.90, category: 'elite' },

  // Highly Selective
  { name: 'Georgetown University', acceptanceRate: 12, satRange: [1380, 1530], actRange: [32, 35], avgGPA: 3.88, category: 'highly_selective' },
  { name: 'UCLA', acceptanceRate: 9, satRange: [1360, 1520], actRange: [31, 35], avgGPA: 3.90, category: 'highly_selective' },
  { name: 'UC Berkeley', acceptanceRate: 11, satRange: [1350, 1520], actRange: [31, 35], avgGPA: 3.89, category: 'highly_selective' },
  { name: 'Carnegie Mellon University', acceptanceRate: 11, satRange: [1430, 1560], actRange: [33, 35], avgGPA: 3.88, category: 'highly_selective' },
  { name: 'Emory University', acceptanceRate: 11, satRange: [1380, 1520], actRange: [32, 34], avgGPA: 3.87, category: 'highly_selective' },
  { name: 'University of Notre Dame', acceptanceRate: 12, satRange: [1370, 1520], actRange: [33, 35], avgGPA: 3.88, category: 'highly_selective' },
  { name: 'University of Virginia', acceptanceRate: 16, satRange: [1350, 1510], actRange: [32, 35], avgGPA: 3.85, category: 'highly_selective' },
  { name: 'University of Michigan', acceptanceRate: 15, satRange: [1340, 1510], actRange: [32, 35], avgGPA: 3.85, category: 'highly_selective' },
  { name: 'University of Southern California', acceptanceRate: 12, satRange: [1380, 1530], actRange: [32, 35], avgGPA: 3.87, category: 'highly_selective' },
  { name: 'Tufts University', acceptanceRate: 10, satRange: [1400, 1540], actRange: [33, 35], avgGPA: 3.88, category: 'highly_selective' },
  { name: 'New York University', acceptanceRate: 12, satRange: [1370, 1520], actRange: [32, 35], avgGPA: 3.85, category: 'highly_selective' },
  { name: 'Boston College', acceptanceRate: 15, satRange: [1370, 1510], actRange: [33, 35], avgGPA: 3.86, category: 'highly_selective' },
  { name: 'Wake Forest University', acceptanceRate: 19, satRange: [1340, 1490], actRange: [31, 34], avgGPA: 3.82, category: 'highly_selective' },
  { name: 'University of North Carolina at Chapel Hill', acceptanceRate: 17, satRange: [1330, 1490], actRange: [30, 34], avgGPA: 3.82, category: 'highly_selective' },
  { name: 'Georgia Institute of Technology', acceptanceRate: 16, satRange: [1370, 1530], actRange: [32, 35], avgGPA: 3.85, category: 'highly_selective' },

  // Selective
  { name: 'Boston University', acceptanceRate: 14, satRange: [1340, 1500], actRange: [31, 34], avgGPA: 3.80, category: 'selective' },
  { name: 'University of Florida', acceptanceRate: 23, satRange: [1300, 1470], actRange: [29, 33], avgGPA: 3.80, category: 'selective' },
  { name: 'University of Wisconsin-Madison', acceptanceRate: 49, satRange: [1280, 1460], actRange: [28, 32], avgGPA: 3.75, category: 'selective' },
  { name: 'University of Texas at Austin', acceptanceRate: 29, satRange: [1250, 1450], actRange: [28, 33], avgGPA: 3.75, category: 'selective' },
  { name: 'University of Illinois Urbana-Champaign', acceptanceRate: 43, satRange: [1270, 1470], actRange: [29, 33], avgGPA: 3.75, category: 'selective' },
  { name: 'Purdue University', acceptanceRate: 53, satRange: [1200, 1420], actRange: [27, 33], avgGPA: 3.70, category: 'selective' },
  { name: 'Ohio State University', acceptanceRate: 53, satRange: [1230, 1420], actRange: [27, 32], avgGPA: 3.70, category: 'selective' },
  { name: 'Penn State University', acceptanceRate: 55, satRange: [1180, 1380], actRange: [26, 31], avgGPA: 3.65, category: 'selective' },
  { name: 'University of Georgia', acceptanceRate: 39, satRange: [1270, 1430], actRange: [28, 32], avgGPA: 3.78, category: 'selective' },
  { name: 'University of Maryland', acceptanceRate: 42, satRange: [1280, 1460], actRange: [29, 33], avgGPA: 3.78, category: 'selective' },
  { name: 'Northeastern University', acceptanceRate: 7, satRange: [1410, 1540], actRange: [33, 35], avgGPA: 3.88, category: 'selective' },
  { name: 'Villanova University', acceptanceRate: 22, satRange: [1340, 1480], actRange: [31, 34], avgGPA: 3.80, category: 'selective' },
  { name: 'Tulane University', acceptanceRate: 11, satRange: [1340, 1490], actRange: [31, 34], avgGPA: 3.78, category: 'selective' },
  { name: 'University of Washington', acceptanceRate: 48, satRange: [1260, 1440], actRange: [28, 33], avgGPA: 3.75, category: 'selective' },
  { name: 'UC San Diego', acceptanceRate: 24, satRange: [1310, 1490], actRange: [30, 34], avgGPA: 3.85, category: 'selective' },
  { name: 'UC Davis', acceptanceRate: 37, satRange: [1200, 1420], actRange: [27, 33], avgGPA: 3.78, category: 'selective' },
  { name: 'UC Santa Barbara', acceptanceRate: 26, satRange: [1260, 1460], actRange: [28, 33], avgGPA: 3.80, category: 'selective' },
  { name: 'UC Irvine', acceptanceRate: 21, satRange: [1240, 1440], actRange: [27, 33], avgGPA: 3.80, category: 'selective' },
  { name: 'University of Pittsburgh', acceptanceRate: 42, satRange: [1220, 1400], actRange: [27, 32], avgGPA: 3.70, category: 'selective' },
  { name: 'Clemson University', acceptanceRate: 47, satRange: [1230, 1390], actRange: [27, 32], avgGPA: 3.72, category: 'selective' },

  // Moderate
  { name: 'Indiana University Bloomington', acceptanceRate: 80, satRange: [1100, 1320], actRange: [24, 31], avgGPA: 3.55, category: 'moderate' },
  { name: 'Michigan State University', acceptanceRate: 83, satRange: [1080, 1290], actRange: [23, 30], avgGPA: 3.50, category: 'moderate' },
  { name: 'University of Arizona', acceptanceRate: 87, satRange: [1070, 1290], actRange: [22, 29], avgGPA: 3.40, category: 'moderate' },
  { name: 'Arizona State University', acceptanceRate: 88, satRange: [1080, 1310], actRange: [22, 29], avgGPA: 3.45, category: 'moderate' },
  { name: 'University of Oregon', acceptanceRate: 83, satRange: [1100, 1300], actRange: [23, 29], avgGPA: 3.50, category: 'moderate' },
  { name: 'University of Colorado Boulder', acceptanceRate: 79, satRange: [1130, 1340], actRange: [25, 31], avgGPA: 3.55, category: 'moderate' },
  { name: 'University of Iowa', acceptanceRate: 84, satRange: [1080, 1300], actRange: [22, 29], avgGPA: 3.50, category: 'moderate' },
  { name: 'Syracuse University', acceptanceRate: 54, satRange: [1190, 1380], actRange: [26, 31], avgGPA: 3.60, category: 'moderate' },
  { name: 'Temple University', acceptanceRate: 72, satRange: [1110, 1300], actRange: [23, 30], avgGPA: 3.50, category: 'moderate' },
  { name: 'Rutgers University', acceptanceRate: 61, satRange: [1180, 1380], actRange: [26, 32], avgGPA: 3.60, category: 'moderate' },
  { name: 'University of Connecticut', acceptanceRate: 56, satRange: [1200, 1380], actRange: [27, 32], avgGPA: 3.65, category: 'moderate' },
  { name: 'Virginia Tech', acceptanceRate: 57, satRange: [1200, 1390], actRange: [26, 32], avgGPA: 3.65, category: 'moderate' },
  { name: 'University of South Carolina', acceptanceRate: 63, satRange: [1140, 1320], actRange: [25, 31], avgGPA: 3.55, category: 'moderate' },
  { name: 'Colorado State University', acceptanceRate: 84, satRange: [1060, 1270], actRange: [22, 28], avgGPA: 3.45, category: 'moderate' },
  { name: 'University of Alabama', acceptanceRate: 75, satRange: [1090, 1310], actRange: [23, 31], avgGPA: 3.50, category: 'moderate' },

  // Accessible
  { name: 'University of Kansas', acceptanceRate: 90, satRange: [1030, 1270], actRange: [21, 28], avgGPA: 3.35, category: 'accessible' },
  { name: 'University of Mississippi', acceptanceRate: 89, satRange: [1020, 1230], actRange: [21, 28], avgGPA: 3.30, category: 'accessible' },
  { name: 'University of Nebraska-Lincoln', acceptanceRate: 90, satRange: [1040, 1270], actRange: [21, 28], avgGPA: 3.35, category: 'accessible' },
  { name: 'San Diego State University', acceptanceRate: 35, satRange: [1120, 1310], actRange: [23, 29], avgGPA: 3.60, category: 'accessible' },
  { name: 'University of Central Florida', acceptanceRate: 43, satRange: [1170, 1340], actRange: [25, 30], avgGPA: 3.60, category: 'accessible' },
];

// Search colleges by name (fuzzy-ish match)
export function searchColleges(query: string): CollegeStats[] {
  if (!query || query.length < 2) return [];
  const lower = query.toLowerCase();
  return COLLEGE_DATABASE
    .filter(c => c.name.toLowerCase().includes(lower))
    .slice(0, 10);
}

// Find exact or closest match
export function findCollege(name: string): CollegeStats | null {
  const lower = name.toLowerCase().trim();
  // Exact match
  const exact = COLLEGE_DATABASE.find(c => c.name.toLowerCase() === lower);
  if (exact) return exact;
  // Partial match (college name contains query or vice versa)
  return COLLEGE_DATABASE.find(c =>
    c.name.toLowerCase().includes(lower) || lower.includes(c.name.toLowerCase())
  ) || null;
}
