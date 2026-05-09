import type { Profile, PersonalInfo, AddressInfo, ProfessionalInfo, IdentityInfo } from '@/types/profile.types';

// ── Name data ──────────────────────────────────────────────────────────────

const MALE_FIRST_NAMES = [
  'Aarav', 'Aditya', 'Akash', 'Amit', 'Anand', 'Arjun', 'Aryan', 'Ashish',
  'Ayaan', 'Deepak', 'Dev', 'Dhruv', 'Gautam', 'Harsh', 'Ishan', 'Karan',
  'Krishna', 'Kunal', 'Manish', 'Mohit', 'Nikhil', 'Nilesh', 'Pankaj',
  'Pranav', 'Prateek', 'Rahul', 'Raj', 'Rajesh', 'Ravi', 'Rishabh',
  'Rohit', 'Rohan', 'Sagar', 'Sahil', 'Sandeep', 'Sanjay', 'Shubham',
  'Siddharth', 'Sumit', 'Suresh', 'Tarun', 'Tushar', 'Uday', 'Varun',
  'Vikram', 'Vikas', 'Vinay', 'Vishal', 'Vivek', 'Yash',
];

const FEMALE_FIRST_NAMES = [
  'Aanya', 'Aditi', 'Aishwarya', 'Akanksha', 'Alka', 'Amisha', 'Amrita',
  'Ananya', 'Anjali', 'Ankita', 'Anushka', 'Aparna', 'Aradhya', 'Archana',
  'Avani', 'Deepika', 'Disha', 'Divya', 'Gauri', 'Ishita', 'Jaya',
  'Juhi', 'Kavya', 'Khushi', 'Komal', 'Kriti', 'Lakshmi', 'Madhuri',
  'Meera', 'Megha', 'Mitali', 'Muskan', 'Naina', 'Namrata', 'Neha',
  'Nidhi', 'Nikita', 'Pallavi', 'Poonam', 'Pooja', 'Prachi', 'Pragya',
  'Priya', 'Riya', 'Ritika', 'Sakshi', 'Shruti', 'Simran', 'Sneha',
  'Sonam', 'Sonal', 'Sonali', 'Swati', 'Tanvi', 'Tanya', 'Trisha',
];

const LAST_NAMES = [
  'Agarwal', 'Arora', 'Bansal', 'Bhatt', 'Bose', 'Chakraborty', 'Chandra',
  'Chaudhary', 'Chopra', 'Desai', 'Dhawan', 'Dixit', 'Dubey', 'Dutta',
  'Gandhi', 'Garg', 'Ghosh', 'Goswami', 'Gupta', 'Iyer', 'Jain', 'Jha',
  'Joshi', 'Kapur', 'Kapoor', 'Kashyap', 'Khan', 'Khanna', 'Kulkarni',
  'Kumar', 'Lal', 'Malhotra', 'Mehta', 'Menon', 'Mishra', 'Mittal',
  'Modi', 'Mukherjee', 'Nair', 'Naidu', 'Pandey', 'Patel', 'Patil',
  'Pillai', 'Prasad', 'Rao', 'Reddy', 'Saxena', 'Shah', 'Sharma',
  'Shukla', 'Singh', 'Sinha', 'Srivastava', 'Thakur', 'Tiwari', 'Trivedi',
  'Varma', 'Verma', 'Yadav',
];

// ── Location data ─────────────────────────────────────────────────────────

interface StateData {
  name: string;
  cities: string[];
  pincodePrefix: string;
}

const STATES: StateData[] = [
  { name: 'Maharashtra', cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur'], pincodePrefix: '4' },
  { name: 'Delhi', cities: ['New Delhi', 'North Delhi', 'South Delhi', 'East Delhi', 'West Delhi', 'Dwarka', 'Rohini'], pincodePrefix: '11' },
  { name: 'Karnataka', cities: ['Bengaluru', 'Mysuru', 'Hubli', 'Mangaluru', 'Belgaum', 'Davangere'], pincodePrefix: '5' },
  { name: 'Tamil Nadu', cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli'], pincodePrefix: '6' },
  { name: 'Telangana', cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam', 'Ramagundam'], pincodePrefix: '5' },
  { name: 'Gujarat', cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar'], pincodePrefix: '3' },
  { name: 'Rajasthan', cities: ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner'], pincodePrefix: '3' },
  { name: 'Uttar Pradesh', cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Ghaziabad', 'Noida'], pincodePrefix: '2' },
  { name: 'West Bengal', cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Burdwan'], pincodePrefix: '7' },
  { name: 'Madhya Pradesh', cities: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar'], pincodePrefix: '4' },
  { name: 'Punjab', cities: ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'], pincodePrefix: '1' },
  { name: 'Haryana', cities: ['Gurugram', 'Faridabad', 'Hisar', 'Rohtak', 'Karnal', 'Ambala'], pincodePrefix: '1' },
  { name: 'Kerala', cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad'], pincodePrefix: '6' },
  { name: 'Andhra Pradesh', cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati'], pincodePrefix: '5' },
  { name: 'Bihar', cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga'], pincodePrefix: '8' },
];

// ── Company & Education data ───────────────────────────────────────────────

const COMPANIES = [
  'Tata Consultancy Services', 'Infosys', 'Wipro', 'HCL Technologies', 'Tech Mahindra',
  'Cognizant', 'Capgemini', 'Accenture', 'IBM India', 'Oracle India',
  'Microsoft India', 'Google India', 'Amazon India', 'Flipkart', 'Paytm',
  'Zomato', 'Swiggy', 'Ola', 'Byju\'s', 'Razorpay', 'PhonePe', 'Nykaa',
  'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Reliance Industries', 'Mahindra & Mahindra',
  'Bajaj Finserv', 'L&T Infotech', 'Mphasis', 'Hexaware Technologies',
];

const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Hyderabad', 'NIT Trichy', 'NIT Warangal', 'NIT Surathkal',
  'BITS Pilani', 'VIT Vellore', 'SRM University', 'Amity University',
  'Delhi University', 'Mumbai University', 'Anna University', 'Pune University',
  'Bangalore University', 'Jadavpur University', 'Manipal University',
  'Christ University', 'Symbiosis International University',
];

const DEGREES = [
  'B.Tech in Computer Science', 'B.Tech in Information Technology',
  'B.Tech in Electronics & Communication', 'B.Tech in Mechanical Engineering',
  'B.E. in Computer Science', 'BCA', 'B.Sc in Computer Science',
  'MCA', 'M.Tech in Computer Science', 'MBA', 'B.Com', 'BBA',
];

const SKILLS_POOL = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'Java', 'Go',
  'Angular', 'Vue.js', 'Next.js', 'Express.js', 'Django', 'Spring Boot',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Azure', 'GCP',
  'Docker', 'Kubernetes', 'CI/CD', 'Git', 'REST APIs', 'GraphQL',
  'Machine Learning', 'Data Science', 'TensorFlow', 'Android', 'iOS',
  'Flutter', 'React Native', 'HTML/CSS', 'Tailwind CSS', 'Bootstrap',
  'Linux', 'Agile', 'Scrum', 'Jenkins', 'Terraform', 'Microservices',
];

const NOTICE_PERIODS = ['Immediate', '15 days', '30 days', '45 days', '60 days', '90 days'];

const DESIGNATIONS = [
  'Software Engineer', 'Senior Software Engineer', 'Lead Engineer', 'Principal Engineer',
  'Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer',
  'Data Scientist', 'Data Analyst', 'Product Manager', 'Business Analyst',
  'QA Engineer', 'UX Designer', 'UI Developer', 'Cloud Architect',
  'Mobile Developer', 'Machine Learning Engineer', 'Engineering Manager',
];

// ── Utility helpers ───────────────────────────────────────────────────────

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickMany<T>(arr: T[], min: number, max: number): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
}

function randomDate(minAge: number, maxAge: number): string {
  const now = new Date();
  const minYear = now.getFullYear() - maxAge;
  const maxYear = now.getFullYear() - minAge;
  const year = randomInt(minYear, maxYear);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28);
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

// ── Generator functions ───────────────────────────────────────────────────

export interface IndianProfileData {
  personal: PersonalInfo;
  address: AddressInfo;
  professional: ProfessionalInfo;
  identity: IdentityInfo;
  color: string;
}

const PROFILE_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#ef4444',
  '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6',
];

export function generateIndianProfile(gender?: 'male' | 'female'): IndianProfileData {
  const resolvedGender = gender ?? (Math.random() > 0.5 ? 'male' : 'female');
  const firstName = pick(resolvedGender === 'male' ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES);
  const lastName = pick(LAST_NAMES);
  const fatherFirstName = pick(MALE_FIRST_NAMES);

  const stateData = pick(STATES);
  const city = pick(stateData.cities);

  const expYears = randomInt(0, 15);
  const expMonths = randomInt(0, 11);
  const currentSalary = expYears === 0 ? '0' : String(randomInt(3, 50) * 100000);
  const expectedSalary = String(Math.round(Number(currentSalary) * 1.3 / 100000) * 100000 || randomInt(3, 8) * 100000);

  const gradYear = new Date().getFullYear() - expYears - randomInt(0, 2);
  const phone = `+91${pick(['6', '7', '8', '9'])}${randomDigits(9)}`;
  const altPhone = `+91${pick(['6', '7', '8', '9'])}${randomDigits(9)}`;

  const emailHandle = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${randomInt(10, 999)}`;
  const emailDomain = pick(['gmail.com', 'yahoo.co.in', 'outlook.com', 'hotmail.com', 'rediffmail.com']);
  const email = `${emailHandle}@${emailDomain}`;

  const pincodeDigits = `${stateData.pincodePrefix}${randomDigits(6 - stateData.pincodePrefix.length)}`;

  return {
    personal: {
      fullName: `${firstName} ${lastName}`,
      firstName,
      lastName,
      fatherName: `${fatherFirstName} ${lastName}`,
      motherName: `${pick(FEMALE_FIRST_NAMES)} ${lastName}`,
      dob: randomDate(22, 45),
      gender: resolvedGender,
      maritalStatus: pick(['single', 'married', 'single', 'single']),
      email,
      phone,
      alternatePhone: altPhone,
      nationality: 'Indian',
    },
    address: {
      currentAddress: `${randomInt(1, 999)}, ${pick(['MG Road', 'Civil Lines', 'Gandhi Nagar', 'Lal Bagh', 'Sector ' + randomInt(1, 50), 'Block ' + pick(['A', 'B', 'C', 'D'])])}`,
      permanentAddress: `${randomInt(1, 999)}, ${pick(['Main Street', 'Old Town', 'Market Road', 'Station Road', 'Park Lane'])}`,
      city,
      state: stateData.name,
      country: 'India',
      pincode: pincodeDigits,
      landmark: `Near ${pick(['Railway Station', 'Bus Stand', 'Hospital', 'School', 'Temple', 'Park', 'Mall'])}`,
    },
    professional: {
      currentCompany: expYears > 0 ? pick(COMPANIES) : '',
      designation: expYears > 0 ? pick(DESIGNATIONS) : 'Fresher',
      department: pick(['Engineering', 'Product', 'Design', 'Data', 'DevOps', 'QA', 'Finance']),
      experienceYears: expYears,
      experienceMonths: expMonths,
      skills: pickMany(SKILLS_POOL, 4, 10),
      noticePeriod: expYears > 0 ? pick(NOTICE_PERIODS) : 'Immediate',
      currentSalary,
      expectedSalary,
      linkedinUrl: `https://linkedin.com/in/${firstName.toLowerCase()}-${lastName.toLowerCase()}-${randomInt(100, 9999)}`,
      githubUrl: `https://github.com/${firstName.toLowerCase()}${lastName.toLowerCase()}${randomInt(10, 99)}`,
      portfolioUrl: `https://${firstName.toLowerCase()}${lastName.toLowerCase()}.dev`,
      collegeName: pick(COLLEGES),
      degree: pick(DEGREES),
      graduationYear: String(gradYear),
      cgpa: `${randomInt(65, 95) / 10}`,
    },
    identity: {
      aadhaarNumber: randomDigits(12),
      panNumber: `${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))}${randomDigits(4)}${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))}`,
      passportNumber: `${pick('ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''))}${randomDigits(7)}`,
      drivingLicense: `${stateData.name.slice(0, 2).toUpperCase()}${randomInt(10, 99)}${' ' + randomInt(10000000000, 99999999999)}`,
    },
    color: pick(PROFILE_COLORS),
  };
}

export function generateRandomProfile(): Omit<Profile, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'documents' | 'customFields' | 'domainBindings' | 'isDefault'> {
  const data = generateIndianProfile();
  return {
    name: `Random — ${data.personal.fullName}`,
    description: 'Auto-generated random Indian profile',
    color: data.color,
    ...data,
  };
}
