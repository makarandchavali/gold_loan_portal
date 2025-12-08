// Teams and Employees Data
export const teamsData = [
  {
    teamId: 'TEAM_A',
    teamName: 'Team A - Loan Officers',
    employees: [
      { id: 'EMP_A1', name: 'Amit Sharma', phone: '+919876543210', email: 'amit.sharma@iil.com' },
      { id: 'EMP_A2', name: 'Sneha Patel', phone: '+919876543211', email: 'sneha.patel@iil.com' },
      { id: 'EMP_A3', name: 'Rahul Verma', phone: '+919876543212', email: 'rahul.verma@iil.com' },
      { id: 'EMP_A4', name: 'Priya Gupta', phone: '+919876543213', email: 'priya.gupta@iil.com' }
    ]
  },
  {
    teamId: 'TEAM_B',
    teamName: 'Team B - Collection Team',
    employees: [
      { id: 'EMP_B1', name: 'Vikram Singh', phone: '+919876543214', email: 'vikram.singh@iil.com' },
      { id: 'EMP_B2', name: 'Anita Desai', phone: '+919876543215', email: 'anita.desai@iil.com' },
      { id: 'EMP_B3', name: 'Suresh Kumar', phone: '+919876543216', email: 'suresh.kumar@iil.com' },
      { id: 'EMP_B4', name: 'Deepika Reddy', phone: '+919876543217', email: 'deepika.reddy@iil.com' }
    ]
  },
  {
    teamId: 'TEAM_C',
    teamName: 'Team C - KYC Team',
    employees: [
      { id: 'EMP_C1', name: 'Ravi Mehta', phone: '+919876543218', email: 'ravi.mehta@iil.com' },
      { id: 'EMP_C2', name: 'Neha Joshi', phone: '+919876543219', email: 'neha.joshi@iil.com' },
      { id: 'EMP_C3', name: 'Arun Nair', phone: '+919876543220', email: 'arun.nair@iil.com' },
      { id: 'EMP_C4', name: 'Kavita Iyer', phone: '+919876543221', email: 'kavita.iyer@iil.com' }
    ]
  },
  {
    teamId: 'TEAM_D',
    teamName: 'Team D - Customer Service',
    employees: [
      { id: 'EMP_D1', name: 'Manish Agarwal', phone: '+919876543222', email: 'manish.agarwal@iil.com' },
      { id: 'EMP_D2', name: 'Pooja Kapoor', phone: '+919876543223', email: 'pooja.kapoor@iil.com' },
      { id: 'EMP_D3', name: 'Sanjay Rao', phone: '+919876543224', email: 'sanjay.rao@iil.com' },
      { id: 'EMP_D4', name: 'Ritika Malhotra', phone: '+919876543225', email: 'ritika.malhotra@iil.com' }
    ]
  }
];

// Get all employees from all teams
export const getAllEmployees = () => {
  return teamsData.flatMap(team => 
    team.employees.map(emp => ({
      ...emp,
      teamId: team.teamId,
      teamName: team.teamName
    }))
  );
};
