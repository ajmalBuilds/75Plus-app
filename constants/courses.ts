export interface Course {
    id: number;
    courseId: string;
    courseName: string;
    department: string;
    year: string;
    semester: string;
}

export const courses: Course[] = [

    // PUC-I
    { "id": 1, "courseId": "EN101", "courseName": "English", "department": "PUC", "year": "P1", "semester": "S1" },
    { "id": 2, "courseId": "TE102", "courseName": "Telugu", "department": "PUC", "year": "P1", "semester": "S1" },
    { "id": 3, "courseId": "SN102", "courseName": "Sanskrit", "department": "PUC", "year": "P1", "semester": "S1" },
    { "id": 4, "courseId": "MA103", "courseName": "Mathematics-A", "department": "PUC", "year": "P1", "semester": "S1" },
    { "id": 5, "courseId": "MA104", "courseName": "Mathematics-B", "department": "PUC", "year": "P1", "semester": "S1" },
    { "id": 6, "courseId": "PH105", "courseName": "Physics", "department": "PUC", "year": "P1", "semester": "S1" },
    { "id": 7, "courseId": "CY106", "courseName": "Chemistry", "department": "PUC", "year": "P1", "semester": "S1" },
    { "id": 8, "courseId": "CS107", "courseName": "Information Technology", "department": "PUC", "year": "P1", "semester": "S1" },
    { "id": 9, "courseId": "BS108", "courseName": "Environmental Education", "department": "PUC", "year": "P1", "semester": "S1" },
    
    // PUC-II 
    { "id": 10, "courseId": "EN201", "courseName": "English", "department": "PUC", "year": "P2", "semester": "S1" },
    { "id": 11, "courseId": "TE202", "courseName": "Telugu", "department": "PUC", "year": "P2", "semester": "S1" },
    { "id": 12, "courseId": "SN202", "courseName": "Sanskrit", "department": "PUC", "year": "P2", "semester": "S1" },
    { "id": 13, "courseId": "MA203", "courseName": "Mathematics-A", "department": "PUC", "year": "P2", "semester": "S1" },
    { "id": 14, "courseId": "MA204", "courseName": "Mathematics-B", "department": "PUC", "year": "P2", "semester": "S1" },
    { "id": 15, "courseId": "PH205", "courseName": "Physics", "department": "PUC", "year": "P2", "semester": "S1" },
    { "id": 16, "courseId": "CY206", "courseName": "Chemistry", "department": "PUC", "year": "P2", "semester": "S1" },
    { "id": 17, "courseId": "CS207", "courseName": "Information Technology", "department": "PUC", "year": "P2", "semester": "S1" },
  
  
  
    // E1 S1
    { "id": 18, "courseId": "BM1105", "courseName": "Constitution of India", "department": "CHE", "year": "E1", "semester": "S1" },
    { "id": 19, "courseId": "CH1101", "courseName": "Introduction to Chemical Engineering", "department": "CHE", "year": "E1", "semester": "S1" },
    { "id": 20, "courseId": "CS1101", "courseName": "Programming for Problem Solving", "department": "CHE", "year": "E1", "semester": "S1" },
    { "id": 21, "courseId": "CY1101", "courseName": "Engineering Chemistry", "department": "CHE", "year": "E1", "semester": "S1" },
    { "id": 22, "courseId": "MA1101", "courseName": "Linear Algebra and Calculus", "department": "CHE", "year": "E1", "semester": "S1" },
  
    { "id": 23, "courseId": "CE1101", "courseName": "Introduction to Civil Engineering", "department": "CE", "year": "E1", "semester": "S1" },
    { "id": 24, "courseId": "MA1101", "courseName": "Linear Algebra and Calculus", "department": "CE", "year": "E1", "semester": "S1" },
    { "id": 25, "courseId": "PH1101", "courseName": "Engineering Physics", "department": "CE", "year": "E1", "semester": "S1" },
    { "id": 26, "courseId": "EE1101", "courseName": "Basic Electrical and Electronics Engineering", "department": "CE", "year": "E1", "semester": "S1" },
    { "id": 27, "courseId": "HS1101", "courseName": "English", "department": "CE", "year": "E1", "semester": "S1" },
  
    { "id": 28, "courseId": "MA1102", "courseName": "Discrete Mathematics", "department": "CSE", "year": "E1", "semester": "S1" },
    { "id": 29, "courseId": "CY1101", "courseName": "Engineering Chemistry", "department": "CSE", "year": "E1", "semester": "S1" },
    { "id": 30, "courseId": "MA1103", "courseName": "Linear Algebra and Calculus", "department": "CSE", "year": "E1", "semester": "S1" },
    { "id": 31, "courseId": "CS1101", "courseName": "Programming for Problem Solving", "department": "CSE", "year": "E1", "semester": "S1" },
  
    { "id": 32, "courseId": "MA1103", "courseName": "Linear Algebra and Calculus", "department": "ECE", "year": "E1", "semester": "S1" },
    { "id": 33, "courseId": "CS1101", "courseName": "Programming for Problem Solving", "department": "ECE", "year": "E1", "semester": "S1" },
    { "id": 34, "courseId": "EC1101", "courseName": "Digital Electronic Circuits", "department": "ECE", "year": "E1", "semester": "S1" },
  
    { "id": 35, "courseId": "MA1101", "courseName": "Linear Algebra and Calculus", "department": "EEE", "year": "E1", "semester": "S1" },
    { "id": 36, "courseId": "PH1101", "courseName": "Engineering Physics", "department": "EEE", "year": "E1", "semester": "S1" },
    { "id": 37, "courseId": "EE1101", "courseName": "Basic Electrical and Electronics Engineering", "department": "EEE", "year": "E1", "semester": "S1" },
    { "id": 38, "courseId": "EE1102", "courseName": "Basic Electrical and Electronics Engineering", "department": "EEE", "year": "E1", "semester": "S1" },
    { "id": 39, "courseId": "HS1101", "courseName": "English", "department": "EEE", "year": "E1", "semester": "S1" },
  
    { "id": 40, "courseId": "MA1101", "courseName": "Linear Algebra and Calculus", "department": "ME", "year": "E1", "semester": "S1" },
    { "id": 41, "courseId": "PH1101", "courseName": "Engineering Physics", "department": "ME", "year": "E1", "semester": "S1" },
    { "id": 42, "courseId": "EE1102", "courseName": "Basic Electrical and Electronics Engineering", "department": "ME", "year": "E1", "semester": "S1" },
    { "id": 43, "courseId": "EE1103", "courseName": "Basic Electrical and Electronics Engineering", "department": "ME", "year": "E1", "semester": "S1" },
    { "id": 44, "courseId": "HS1101", "courseName": "English", "department": "ME", "year": "E1", "semester": "S1" },
  
    { "id": 45, "courseId": "MA1101", "courseName": "Linear Algebra and Calculus", "department": "MME", "year": "E1", "semester": "S1" },
    { "id": 46, "courseId": "PH1101", "courseName": "Engineering Physics", "department": "MME", "year": "E1", "semester": "S1" },
    { "id": 47, "courseId": "EE1101", "courseName": "Basic Electrical and Electronics Engineering", "department": "MME", "year": "E1", "semester": "S1" },
    { "id": 48, "courseId": "EE1102", "courseName": "Basic Electrical and Electronics Engineering", "department": "MME", "year": "E1", "semester": "S1" },
    { "id": 49, "courseId": "HS1101", "courseName": "English", "department": "MME", "year": "E1", "semester": "S1" },
  
  
  
  
    // E1 S2
    { "id": 50, "courseId": "MA1201", "courseName": "Differential Equations and Vector Calculus", "department": "CE", "year": "E1", "semester": "S2" },
    { "id": 51, "courseId": "CE1201", "courseName": "Engineering Mechanics", "department": "CE", "year": "E1", "semester": "S2" },
    { "id": 52, "courseId": "CE1202", "courseName": "Engineering Geology", "department": "CE", "year": "E1", "semester": "S2" },
    { "id": 53, "courseId": "CS1202", "courseName": "Programming For Problem Solving", "department": "CE", "year": "E1", "semester": "S2" },
    { "id": 54, "courseId": "CY1201", "courseName": "Engineering Chemistry", "department": "CE", "year": "E1", "semester": "S2" },
  
    { "id": 55, "courseId": "MA1201", "courseName": "Differential Equations and Vector Calculus", "department": "CHE", "year": "E1", "semester": "S2" },
    { "id": 56, "courseId": "PH1201", "courseName": "Engineering Physics", "department": "CHE", "year": "E1", "semester": "S2" },
    { "id": 57, "courseId": "CY1202", "courseName": "Organic Chemistry", "department": "CHE", "year": "E1", "semester": "S2" },
    { "id": 58, "courseId": "CH1201", "courseName": "Engineering Thermodynamics", "department": "CHE", "year": "E1", "semester": "S2" },
    { "id": 59, "courseId": "HS1201", "courseName": "English", "department": "CHE", "year": "E1", "semester": "S2" },
    { "id": 60, "courseId": "BS1201", "courseName": "Environmental Science", "department": "CHE", "year": "E1", "semester": "S2" },
  
    { "id": 61, "courseId": "HS1201", "courseName": "English", "department": "CSE", "year": "E1", "semester": "S2" },
    { "id": 62, "courseId": "MA1201", "courseName": "Differential Equations and Vector Calculus", "department": "CSE", "year": "E1", "semester": "S2" },
    { "id": 63, "courseId": "EE1202", "courseName": "Basic Electrical and Electronics Engineering", "department": "CSE", "year": "E1", "semester": "S2" },
    { "id": 64, "courseId": "PH1201", "courseName": "Engineering Physics", "department": "CSE", "year": "E1", "semester": "S2" },
    { "id": 65, "courseId": "CS1201", "courseName": "Data Structures and Algorithms", "department": "CSE", "year": "E1", "semester": "S2" },
    { "id": 66, "courseId": "BS1201", "courseName": "Environmental Science", "department": "CSE", "year": "E1", "semester": "S2" },
  
    { "id": 67, "courseId": "MA1201", "courseName": "Differential Equations and Vector Calculus", "department": "ECE", "year": "E1", "semester": "S2" },
    { "id": 68, "courseId": "PH1201", "courseName": "Engineering Physics", "department": "ECE", "year": "E1", "semester": "S2" },
    { "id": 69, "courseId": "EC1201", "courseName": "Electronic Devices and Circuits", "department": "ECE", "year": "E1", "semester": "S2" },
    { "id": 70, "courseId": "EC1202", "courseName": "Network Analysis", "department": "ECE", "year": "E1", "semester": "S2" },
    { "id": 71, "courseId": "HS1201", "courseName": "English", "department": "ECE", "year": "E1", "semester": "S2" },
  
    { "id": 72, "courseId": "EE1201", "courseName": "Network Theory-II", "department": "EEE", "year": "E1", "semester": "S2" },
    { "id": 73, "courseId": "MA1202", "courseName": "Differential Equations and Laplace Transforms", "department": "EEE", "year": "E1", "semester": "S2" },
    { "id": 74, "courseId": "CY1201", "courseName": "Engineering Chemistry", "department": "EEE", "year": "E1", "semester": "S2" },
    { "id": 75, "courseId": "CS1202", "courseName": "Programming for Problem Solving", "department": "EEE", "year": "E1", "semester": "S2" },
    { "id": 76, "courseId": "BM1205", "courseName": "Constitution of India", "department": "EEE", "year": "E1", "semester": "S2" },
    { "id": 77, "courseId": "EC1203", "courseName": "Analog Electronic Circuits-I", "department": "EEE", "year": "E1", "semester": "S2" },
  
    { "id": 78, "courseId": "MA1201", "courseName": "Differential Equations & Vector Calculus", "department": "ME", "year": "E1", "semester": "S2" },
    { "id": 79, "courseId": "CY1201", "courseName": "Engineering Chemistry", "department": "ME", "year": "E1", "semester": "S2" },
    { "id": 80, "courseId": "CS1202", "courseName": "Programming for Problem Solving", "department": "ME", "year": "E1", "semester": "S2" },
    { "id": 81, "courseId": "ME1201", "courseName": "Engineering Mechanics", "department": "ME", "year": "E1", "semester": "S2" },
    { "id": 82, "courseId": "ME1202", "courseName": "Introduction to Manufacturing Processes", "department": "ME", "year": "E1", "semester": "S2" },
    { "id": 83, "courseId": "BM1205", "courseName": "Constitution of India", "department": "ME", "year": "E1", "semester": "S2" },
  
    { "id": 84, "courseId": "MA1201", "courseName": "Differential Equations and Vector Calculus", "department": "MME", "year": "E1", "semester": "S2" },
    { "id": 85, "courseId": "MM1201", "courseName": "Physics of Materials", "department": "MME", "year": "E1", "semester": "S2" },
    { "id": 86, "courseId": "CY1201", "courseName": "Engineering Chemistry", "department": "MME", "year": "E1", "semester": "S2" },
    { "id": 87, "courseId": "CS1202", "courseName": "Programming for Problem Solving", "department": "MME", "year": "E1", "semester": "S2" },
    { "id": 88, "courseId": "BM1205", "courseName": "Constitution of India", "department": "MME", "year": "E1", "semester": "S2" },
  
  
  
    // E2 S1
    { "id": 89, "courseId": "MA2101", "courseName": "Probability and Laplace Transform", "department": "CHE", "year": "E2", "semester": "S1" },
    { "id": 90, "courseId": "CH2101", "courseName": "Chemical Process Calculations", "department": "CHE", "year": "E2", "semester": "S1" },
    { "id": 91, "courseId": "CH2102", "courseName": "Chemical Engineering Thermodynamics", "department": "CHE", "year": "E2", "semester": "S1" },
    { "id": 92, "courseId": "CH2103", "courseName": "Chemical Engineering Fluid Mechanics", "department": "CHE", "year": "E2", "semester": "S1" },
    { "id": 93, "courseId": "MM2105", "courseName": "Materials Science", "department": "CHE", "year": "E2", "semester": "S1" },
    { "id": 94, "courseId": "BS2103", "courseName": "Biology for Chemical Engineering", "department": "CHE", "year": "E2", "semester": "S1" },
  
    { "id": 95, "courseId": "CE2102", "courseName": "Building Materials and Concrete Technology", "department": "CE", "year": "E2", "semester": "S1" },
    { "id": 96, "courseId": "CE2103", "courseName": "Mechanics of Materials", "department": "CE", "year": "E2", "semester": "S1" },
    { "id": 97, "courseId": "CE2104", "courseName": "Fluid Mechanics", "department": "CE", "year": "E2", "semester": "S1" },
    { "id": 98, "courseId": "MA2103", "courseName": "Probability and Statistics", "department": "CE", "year": "E2", "semester": "S1" },
    { "id": 99, "courseId": "CE2101", "courseName": "Civil Engineering-Societal and Global Impact", "department": "CE", "year": "E2", "semester": "S1" },
    { "id": 100, "courseId": "BS2101", "courseName": "Environmental Science", "department": "CE", "year": "E2", "semester": "S1" },
  
    { "id": 101, "courseId": "BM2101", "courseName": "Managerial Economics and Financial Analysis", "department": "CSE", "year": "E2", "semester": "S1" },
    { "id": 102, "courseId": "CS2101", "courseName": "Database Management System", "department": "CSE", "year": "E2", "semester": "S1" },
    { "id": 103, "courseId": "CS2102", "courseName": "Object Oriented Programming Structures through Java", "department": "CSE", "year": "E2", "semester": "S1" },
    { "id": 104, "courseId": "CS2103", "courseName": "Computer Organization and Architecture", "department": "CSE", "year": "E2", "semester": "S1" },
    { "id": 105, "courseId": "EC2105", "courseName": "Digital Electronic Circuits", "department": "CSE", "year": "E2", "semester": "S1" },
    { "id": 106, "courseId": "HS2101", "courseName": "Essence of Indian Traditional Knowledge", "department": "CSE", "year": "E2", "semester": "S1" },
  
    { "id": 107, "courseId": "CY2102", "courseName": "Engineering Chemistry", "department": "ECE", "year": "E2", "semester": "S1" },
    { "id": 108, "courseId": "MA2104", "courseName": "Transform Calculus and Complex Analysis", "department": "ECE", "year": "E2", "semester": "S1" },
    { "id": 109, "courseId": "EE2102", "courseName": "Electrical Technology", "department": "ECE", "year": "E2", "semester": "S1" },
    { "id": 110, "courseId": "EC2102", "courseName": "Signals and Systems", "department": "ECE", "year": "E2", "semester": "S1" },
    { "id": 111, "courseId": "EC2101", "courseName": "Probability Theory and Stochastic Processes", "department": "ECE", "year": "E2", "semester": "S1" },
    { "id": 112, "courseId": "HS2010", "courseName": "Essence of Indian Traditional Knowledge", "department": "ECE", "year": "E2", "semester": "S1" },
  
    { "id": 113, "courseId": "EE2101", "courseName": "Electrical Machines-I", "department": "EEE", "year": "E2", "semester": "S1" },
    { "id": 114, "courseId": "EC2103", "courseName": "Analog Electronic Circuits-II", "department": "EEE", "year": "E2", "semester": "S1" },
    { "id": 115, "courseId": "EE2103", "courseName": "Electro Magnetic Fields", "department": "EEE", "year": "E2", "semester": "S1" },
    { "id": 116, "courseId": "CS2301", "courseName": "Data Structures", "department": "EEE", "year": "E2", "semester": "S1" },
    { "id": 117, "courseId": "ME2105", "courseName": "Engineering Mechanics", "department": "EEE", "year": "E2", "semester": "S1" },
    { "id": 118, "courseId": "MA2105", "courseName": "Vector Calculus and Complex analysis", "department": "EEE", "year": "E2", "semester": "S1" },
  
    { "id": 119, "courseId": "ME2104", "courseName": "Kinematics of Machinery", "department": "ME", "year": "E2", "semester": "S1" },
    { "id": 120, "courseId": "ME2101", "courseName": "Strength of Materials", "department": "ME", "year": "E2", "semester": "S1" },
    { "id": 121, "courseId": "ME2102", "courseName": "Thermodynamics", "department": "ME", "year": "E2", "semester": "S1" },
    { "id": 122, "courseId": "ME2103", "courseName": "Materials Engineering", "department": "ME", "year": "E2", "semester": "S1" },
    { "id": 123, "courseId": "MA2102", "courseName": "Probability and Complex Analysis", "department": "ME", "year": "E2", "semester": "S1" },
    { "id": 124, "courseId": "BM2107", "courseName": "Startup Entrepreneurship", "department": "ME", "year": "E2", "semester": "S1" },
  
    { "id": 125, "courseId": "MA2107", "courseName": "Probability and Laplace Transforms", "department": "MME", "year": "E2", "semester": "S1" },
    { "id": 126, "courseId": "BS2101", "courseName": "Environmental Science", "department": "MME", "year": "E2", "semester": "S1" },
    { "id": 127, "courseId": "MM2103", "courseName": "Physical Metallurgy", "department": "MME", "year": "E2", "semester": "S1" },
    { "id": 128, "courseId": "MM2101", "courseName": "Metallurgical Thermodynamics", "department": "MME", "year": "E2", "semester": "S1" },
    { "id": 129, "courseId": "MM2104", "courseName": "Mechanics of Solids", "department": "MME", "year": "E2", "semester": "S1" },
    { "id": 130, "courseId": "MM2102", "courseName": "Non Metallic Materials", "department": "MME", "year": "E2", "semester": "S1" },
  
  
  
    // E2 S2
    { "id": 131, "courseId": "CE2201", "courseName": "Hydraulic Engineering", "department": "CE", "year": "E2", "semester": "S2" },
    { "id": 132, "courseId": "CE2202", "courseName": "Surveying", "department": "CE", "year": "E2", "semester": "S2" },
    { "id": 133, "courseId": "CE2203", "courseName": "Structural Analysis-I", "department": "CE", "year": "E2", "semester": "S2" },
    { "id": 134, "courseId": "CE2205", "courseName": "Water Resources Engineering - I", "department": "CE", "year": "E2", "semester": "S2" },
    { "id": 135, "courseId": "CE2204", "courseName": "Design of Concrete Structures", "department": "CE", "year": "E2", "semester": "S2" },
    { "id": 136, "courseId": "BM2205", "courseName": "Constitution of India", "department": "CE", "year": "E2", "semester": "S2" },
    { "id": 137, "courseId": "HS2201", "courseName": "Effective Technical Communication - I", "department": "CE", "year": "E2", "semester": "S2" },
  
    { "id": 138, "courseId": "CH2201", "courseName": "Process Heat Transfer", "department": "CHE", "year": "E2", "semester": "S2" },
    { "id": 139, "courseId": "CH2202", "courseName": "Mechanical Unit Operations", "department": "CHE", "year": "E2", "semester": "S2" },
    { "id": 140, "courseId": "EE2204", "courseName": "Basic Electrical & Electronics Engineering", "department": "CHE", "year": "E2", "semester": "S2" },
    { "id": 141, "courseId": "CH2203", "courseName": "Mass Transfer Operations-I", "department": "CHE", "year": "E2", "semester": "S2" },
    { "id": 142, "courseId": "BM2202", "courseName": "Fundamentals of Management for Engineers", "department": "CHE", "year": "E2", "semester": "S2" },
  
    { "id": 143, "courseId": "MA2202", "courseName": "Probability and Statistics", "department": "CSE", "year": "E2", "semester": "S2" },
    { "id": 144, "courseId": "CS2203", "courseName": "Design and Analysis of Algorithms", "department": "CSE", "year": "E2", "semester": "S2" },
    { "id": 145, "courseId": "CS2201", "courseName": "Web Technologies", "department": "CSE", "year": "E2", "semester": "S2" },
    { "id": 146, "courseId": "CS2202", "courseName": "Operating System", "department": "CSE", "year": "E2", "semester": "S2" },
  
    { "id": 147, "courseId": "MA2201", "courseName": "Numerical Methods", "department": "ECE", "year": "E2", "semester": "S2" },
    { "id": 148, "courseId": "EE2205", "courseName": "Control Systems", "department": "ECE", "year": "E2", "semester": "S2" },
    { "id": 149, "courseId": "EC2201", "courseName": "Analog Circuits", "department": "ECE", "year": "E2", "semester": "S2" },
    { "id": 150, "courseId": "CS2205", "courseName": "Object Oriented Programming", "department": "ECE", "year": "E2", "semester": "S2" },
    { "id": 151, "courseId": "EC2203", "courseName": "Electromagnetic Waves", "department": "ECE", "year": "E2", "semester": "S2" },
    { "id": 152, "courseId": "EC2202", "courseName": "Digital Systems Design", "department": "ECE", "year": "E2", "semester": "S2" },
    { "id": 153, "courseId": "BS2201", "courseName": "Environmental Science", "department": "ECE", "year": "E2", "semester": "S2" },
  
    { "id": 154, "courseId": "EE2201", "courseName": "Electrical Machines-II", "department": "EEE", "year": "E2", "semester": "S2" },
    { "id": 155, "courseId": "EE2202", "courseName": "Power Electronics", "department": "EEE", "year": "E2", "semester": "S2" },
    { "id": 156, "courseId": "EC2205", "courseName": "Digital Electronics", "department": "EEE", "year": "E2", "semester": "S2" },
    { "id": 157, "courseId": "EE2203", "courseName": "Power Systems-I", "department": "EEE", "year": "E2", "semester": "S2" },
    { "id": 158, "courseId": "EC2206", "courseName": "Signals and Systems", "department": "EEE", "year": "E2", "semester": "S2" },
    { "id": 159, "courseId": "HS2201", "courseName": "Essence of Indian Traditional Knowledge", "department": "EEE", "year": "E2", "semester": "S2" },
  
    { "id": 160, "courseId": "ME2201", "courseName": "Fluid Mechanics and Hydraulic Machines", "department": "ME", "year": "E2", "semester": "S2" },
    { "id": 161, "courseId": "ME2203", "courseName": "Manufacturing Technology I", "department": "ME", "year": "E2", "semester": "S2" },
    { "id": 162, "courseId": "ME2202", "courseName": "Dynamics of Machinery", "department": "ME", "year": "E2", "semester": "S2" },
    { "id": 163, "courseId": "EC2207", "courseName": "Electronics ICs Application", "department": "ME", "year": "E2", "semester": "S2" },
    { "id": 164, "courseId": "ME2211", "courseName": "Composite Materials", "department": "ME", "year": "E2", "semester": "S2" },
    { "id": 165, "courseId": "HS2201", "courseName": "Essence of Indian Traditional Knowledge", "department": "ME", "year": "E2", "semester": "S2" },
  
    { "id": 166, "courseId": "BM2201", "courseName": "Managerial Economics and Financial Analysis", "department": "MME", "year": "E2", "semester": "S2" },
    { "id": 167, "courseId": "HS2201", "courseName": "Essence of Indian Traditional Knowledge", "department": "MME", "year": "E2", "semester": "S2" },
    { "id": 168, "courseId": "MM2203", "courseName": "Mechanical Properties of Materials", "department": "MME", "year": "E2", "semester": "S2" },
    { "id": 169, "courseId": "MM2204", "courseName": "Metal Casting and Joining", "department": "MME", "year": "E2", "semester": "S2" },
    { "id": 170, "courseId": "MM2201", "courseName": "Phase Transformations", "department": "MME", "year": "E2", "semester": "S2" },
    { "id": 171, "courseId": "MM2202", "courseName": "Iron and Steel Making", "department": "MME", "year": "E2", "semester": "S2" },
  
  
  
    // E3 S1
    { "id": 172, "courseId": "CH3101", "courseName": "Chemical Reaction Engineering-I", "department": "CHE", "year": "E3", "semester": "S1" },
    { "id": 173, "courseId": "CH3103", "courseName": "Chemical Technology", "department": "CHE", "year": "E3", "semester": "S1" },
    { "id": 174, "courseId": "CH3102", "courseName": "Mass Transfer Operations-II", "department": "CHE", "year": "E3", "semester": "S1" },
    { "id": 175, "courseId": "CH3122", "courseName": "Energy Engineering", "department": "CHE", "year": "E3", "semester": "S1" },
    { "id": 176, "courseId": "CH3112", "courseName": "Numerical methods for Chemical Engineering", "department": "CHE", "year": "E3", "semester": "S1" },
    { "id": 177, "courseId": "BM3101", "courseName": "Managerial Economics and Financial Analysis", "department": "CHE", "year": "E3", "semester": "S1" },
    
    { "id": 178, "courseId": "CE3101", "courseName": "Estimation and Costing", "department": "CE", "year": "E3", "semester": "S1" },
    { "id": 179, "courseId": "CE3102", "courseName": "Structural Analysis-II", "department": "CE", "year": "E3", "semester": "S1" },
    { "id": 180, "courseId": "CE3103", "courseName": "Highway and Traffic Engineering", "department": "CE", "year": "E3", "semester": "S1" },
    { "id": 181, "courseId": "CE3104", "courseName": "Soil Mechanics", "department": "CE", "year": "E3", "semester": "S1" },
    { "id": 182, "courseId": "CE3105", "courseName": "Design of Steel Structures", "department": "CE", "year": "E3", "semester": "S1" },
    { "id": 183, "courseId": "CE3106", "courseName": "Water Resources Engineering-II", "department": "CE", "year": "E3", "semester": "S1" },
    
    { "id": 184, "courseId": "BM3102", "courseName": "Fundamentals of Management for Engineers", "department": "CSE", "year": "E3", "semester": "S1" },
    { "id": 185, "courseId": "CS3101", "courseName": "Computer Networks", "department": "CSE", "year": "E3", "semester": "S1" },
    { "id": 186, "courseId": "CS3102", "courseName": "Cloud Computing", "department": "CSE", "year": "E3", "semester": "S1" },
    { "id": 187, "courseId": "CS3103", "courseName": "Artificial Intelligence", "department": "CSE", "year": "E3", "semester": "S1" },
    { "id": 188, "courseId": "CS3104", "courseName": "Software Engineering", "department": "CSE", "year": "E3", "semester": "S1" },
    { "id": 189, "courseId": "CS3113", "courseName": "Data Analytics", "department": "CSE", "year": "E3", "semester": "S1" },
  
    { "id": 190, "courseId": "EC3101", "courseName": "Analog and Digital Communications", "department": "ECE", "year": "E3", "semester": "S1" },
    { "id": 191, "courseId": "EC3102", "courseName": "Computer Architecture", "department": "ECE", "year": "E3", "semester": "S1" },
    { "id": 192, "courseId": "EC3103", "courseName": "Digital Signal Processing", "department": "ECE", "year": "E3", "semester": "S1" },
    { "id": 193, "courseId": "EC3105", "courseName": "VLSI Engineering", "department": "ECE", "year": "E3", "semester": "S1" },
    { "id": 194, "courseId": "BM3101", "courseName": "Managerial Economics and Financial analysis", "department": "ECE", "year": "E3", "semester": "S1" },
    { "id": 195, "courseId": "CS3303", "courseName": "Data Structures", "department": "ECE", "year": "E3", "semester": "S1" },
  
    { "id": 196, "courseId": "EE3101", "courseName": "Power Systems-II", "department": "EEE", "year": "E3", "semester": "S1" },
    { "id": 197, "courseId": "EE3102", "courseName": "Control Systems", "department": "EEE", "year": "E3", "semester": "S1" },
    { "id": 198, "courseId": "EE3103", "courseName": "Electrical Measurements and Instrumentation", "department": "EEE", "year": "E3", "semester": "S1" },
    { "id": 199, "courseId": "EC3104", "courseName": "Micro Processors & Micro Controllers", "department": "EEE", "year": "E3", "semester": "S1" },
  
    { "id": 200, "courseId": "ME3101", "courseName": "Heat Transfer", "department": "ME", "year": "E3", "semester": "S1" },
    { "id": 201, "courseId": "ME3103", "courseName": "Design of Machine Members", "department": "ME", "year": "E3", "semester": "S1" },
    { "id": 202, "courseId": "ME3102", "courseName": "IC Engine and Hybrid Vehicle", "department": "ME", "year": "E3", "semester": "S1" },
    { "id": 203, "courseId": "ME3104", "courseName": "Manufacturing Technology II", "department": "ME", "year": "E3", "semester": "S1" },
    { "id": 204, "courseId": "ME3301", "courseName": "Smart Materials", "department": "ME", "year": "E3", "semester": "S1" },
    { "id": 205, "courseId": "BM3103", "courseName": "Operations research", "department": "ME", "year": "E3", "semester": "S1" },
  
    { "id": 206, "courseId": "BM3102", "courseName": "Fundamentals of Management for Engineers", "department": "MME", "year": "E3", "semester": "S1" },
    { "id": 207, "courseId": "MM3101", "courseName": "Heat Treatment", "department": "MME", "year": "E3", "semester": "S1" },
    { "id": 208, "courseId": "MM3102", "courseName": "Non Ferrous Extractive Metallurgy", "department": "MME", "year": "E3", "semester": "S1" },
    { "id": 209, "courseId": "MM3103", "courseName": "Mechanical Working of Metals", "department": "MME", "year": "E3", "semester": "S1" },
    { "id": 210, "courseId": "MM3104", "courseName": "Non-Destructive Testing", "department": "MME", "year": "E3", "semester": "S1" },
  
  
  
    // E3 S2
    { "id": 211, "courseId": "CE3201", "courseName": "Construction Planning and Management", "department": "CE", "year": "E3", "semester": "S2" },
    { "id": 212, "courseId": "CE3202", "courseName": "Environmental Engineering", "department": "CE", "year": "E3", "semester": "S2" },
    { "id": 213, "courseId": "CE3211", "courseName": "Foundation Engineering", "department": "CE", "year": "E3", "semester": "S2" },
    { "id": 214, "courseId": "CE3221", "courseName": "Railway and Airport Engineering", "department": "CE", "year": "E3", "semester": "S2" },
    { "id": 215, "courseId": "HS3201", "courseName": "Essence of Indian tradition and knowledge", "department": "CE", "year": "E3", "semester": "S2" },
    { "id": 216, "courseId": "BM3201", "courseName": "Managerial Economics and Financial analysis", "department": "CE", "year": "E3", "semester": "S2" },
    { "id": 217, "courseId": "CE3206", "courseName": "Effective Technical Communication -II", "department": "CE", "year": "E3", "semester": "S2" },
  
    { "id": 218, "courseId": "CH3201", "courseName": "Chemical Reaction Engineering-II", "department": "CHE", "year": "E3", "semester": "S2" },
    { "id": 219, "courseId": "CH3202", "courseName": "Instrumentation & Process Control", "department": "CHE", "year": "E3", "semester": "S2" },
    { "id": 220, "courseId": "CH3203", "courseName": "Process Equipment Design", "department": "CHE", "year": "E3", "semester": "S2" },
    { "id": 221, "courseId": "CH3232", "courseName": "Renewable Energy Sources", "department": "CHE", "year": "E3", "semester": "S2" },
    { "id": 222, "courseId": "BS3402", "courseName": "Technology of Pharmaceuticals and Fine Chemicals", "department": "CHE", "year": "E3", "semester": "S2" },
    { "id": 223, "courseId": "CH3241", "courseName": "Petroleum Engineering", "department": "CHE", "year": "E3", "semester": "S2" },
  
    { "id": 224, "courseId": "EC3203", "courseName": "Introduction to Internet of Things", "department": "CSE", "year": "E3", "semester": "S2" },
    { "id": 225, "courseId": "CS3201", "courseName": "DevOps", "department": "CSE", "year": "E3", "semester": "S2" },
    { "id": 226, "courseId": "CS3202", "courseName": "Machine Learning", "department": "CSE", "year": "E3", "semester": "S2" },
    { "id": 227, "courseId": "CS3203", "courseName": "Automata Theory and Compiler Design", "department": "CSE", "year": "E3", "semester": "S2" },
    { "id": 228, "courseId": "CS3225", "courseName": "Human Computer Interaction", "department": "CSE", "year": "E3", "semester": "S2" },
    { "id": 229, "courseId": "CS3232", "courseName": "Adhoc Sensor Networks", "department": "CSE", "year": "E3", "semester": "S2" },
  
    { "id": 230, "courseId": "CS3204", "courseName": "Computer Networks", "department": "ECE", "year": "E3", "semester": "S2" },
    { "id": 231, "courseId": "CS3205", "courseName": "Operating Systems", "department": "ECE", "year": "E3", "semester": "S2" },
    { "id": 232, "courseId": "EC3201", "courseName": "Microprocessor and Microcontrollers", "department": "ECE", "year": "E3", "semester": "S2" },
    { "id": 233, "courseId": "EC3202", "courseName": "RF and Microwave Engineering", "department": "ECE", "year": "E3", "semester": "S2" },
    { "id": 234, "courseId": "EC3212", "courseName": "Machine Learning Techniques", "department": "ECE", "year": "E3", "semester": "S2" },
    { "id": 235, "courseId": "EC3221", "courseName": "Digital Image Processing", "department": "ECE", "year": "E3", "semester": "S2" },
  
    { "id": 236, "courseId": "EE3201", "courseName": "Power semestericonductor Drives", "department": "EEE", "year": "E3", "semester": "S2" },
    { "id": 237, "courseId": "EE3202", "courseName": "Power Systems Operation and Control", "department": "EEE", "year": "E3", "semester": "S2" },
    { "id": 238, "courseId": "EE3211", "courseName": "Power Systems Protection", "department": "EEE", "year": "E3", "semester": "S2" },
    { "id": 239, "courseId": "EE3221", "courseName": "Wind and Solar Energy System", "department": "EEE", "year": "E3", "semester": "S2" },
    { "id": 240, "courseId": "CS3401", "courseName": "Object Oriented Programming Structures through Java", "department": "EEE", "year": "E3", "semester": "S2" },
    { "id": 241, "courseId": "EE3231", "courseName": "HVDC Transmission", "department": "EEE", "year": "E3", "semester": "S2" },
  
    { "id": 242, "courseId": "ME3201", "courseName": "Power Plant Engineering", "department": "ME", "year": "E3", "semester": "S2" },
    { "id": 243, "courseId": "ME3202", "courseName": "Design of Transmission Elements", "department": "ME", "year": "E3", "semester": "S2" },
    { "id": 244, "courseId": "ME3203", "courseName": "Computer Aided Engineering", "department": "ME", "year": "E3", "semester": "S2" },
    { "id": 245, "courseId": "ME3204", "courseName": "Instrumentation and Control system", "department": "ME", "year": "E3", "semester": "S2" },
    { "id": 246, "courseId": "ME3222", "courseName": "Non Traditional Manufacturing Processes", "department": "ME", "year": "E3", "semester": "S2" },
    { "id": 247, "courseId": "BM3201", "courseName": "Managerial Economics and Financial Analysis", "department": "ME", "year": "E3", "semester": "S2" },
  
    { "id": 248, "courseId": "MM3201", "courseName": "Materials Characterization", "department": "MME", "year": "E3", "semester": "S2" },
    { "id": 249, "courseId": "MM3202", "courseName": "Corrosion Engineering", "department": "MME", "year": "E3", "semester": "S2" },
    { "id": 250, "courseId": "MM3203", "courseName": "Powder Metallurgy and Additive Manufacturing", "department": "MME", "year": "E3", "semester": "S2" },
    { "id": 251, "courseId": "MM3212", "courseName": "Fracture Mechanics", "department": "MME", "year": "E3", "semester": "S2" },
    { "id": 252, "courseId": "MM3221", "courseName": "Secondary Steel Making", "department": "MME", "year": "E3", "semester": "S2" },
  
  
  
    // E4 S1
    { "id": 253, "courseId": "CH4101", "courseName": "Process Modeling and Simulation", "department": "CHE", "year": "E4", "semester": "S1" },
    { "id": 254, "courseId": "CH4103", "courseName": "Plant Design and Economics", "department": "CHE", "year": "E4", "semester": "S1" },
    { "id": 255, "courseId": "CH4153", "courseName": "Water and Waste Water Treatment", "department": "CHE", "year": "E4", "semester": "S1" },
    { "id": 256, "courseId": "CH4102", "courseName": "Transport Phenomena", "department": "CHE", "year": "E4", "semester": "S1" },
    { "id": 257, "courseId": "HS4101", "courseName": "Essence of Indian Traditional Knowledge", "department": "CHE", "year": "E4", "semester": "S1" },
  
    { "id": 258, "courseId": "BM4111", "courseName": "Professional Law and Ethics", "department": "CE", "year": "E4", "semester": "S1" },
    { "id": 259, "courseId": "CE4101", "courseName": "Remote Sensing and GIS", "department": "CE", "year": "E4", "semester": "S1" },
    { "id": 260, "courseId": "CE4131", "courseName": "Solid and Hazardous Waste Management", "department": "CE", "year": "E4", "semester": "S1" },
    { "id": 261, "courseId": "CE4141", "courseName": "Ground Improvement Techniques", "department": "CE", "year": "E4", "semester": "S1" },
    { "id": 262, "courseId": "BS4301", "courseName": "Bio Informatics", "department": "CE", "year": "E4", "semester": "S1" },
    { "id": 263, "courseId": "CE4156", "courseName": "Rehabilitation and Retrofitting of Structures", "department": "CE", "year": "E4", "semester": "S1" },
  
    { "id": 264, "courseId": "CS4144", "courseName": "Natural Language Processing with Deep Learning", "department": "CSE", "year": "E4", "semester": "S1" },
    { "id": 265, "courseId": "CS4101", "courseName": "Cryptography and Network Security", "department": "CSE", "year": "E4", "semester": "S1" },
    { "id": 266, "courseId": "CS4154", "courseName": "Software Testing Methodologies", "department": "CSE", "year": "E4", "semester": "S1" },
    { "id": 267, "courseId": "BM4106", "courseName": "Intellectual Property Rights", "department": "CSE", "year": "E4", "semester": "S1" },
    { "id": 268, "courseId": "BS4304", "courseName": "Biomedical Engineering", "department": "CSE", "year": "E4", "semester": "S1" },
    { "id": 269, "courseId": "BS4301", "courseName": "Bioinformatics", "department": "CSE", "year": "E4", "semester": "S1" },
  
    { "id": 270, "courseId": "BM4111", "courseName": "Professional Law and Ethics", "department": "ECE", "year": "E4", "semester": "S1" },
    { "id": 271, "courseId": "EC4131", "courseName": "Wireless Communications", "department": "ECE", "year": "E4", "semester": "S1" },
    { "id": 272, "courseId": "EC4141", "courseName": "IOT and applications", "department": "ECE", "year": "E4", "semester": "S1" },
    { "id": 273, "courseId": "EC4151", "courseName": "Antennas and wave propagation", "department": "ECE", "year": "E4", "semester": "S1" },
  
    { "id": 274, "courseId": "EE4101", "courseName": "Utilization of Electrical Energy", "department": "EEE", "year": "E4", "semester": "S1" },
    { "id": 275, "courseId": "EE4142", "courseName": "Artificial Neural Networks and Fuzzy Systems", "department": "EEE", "year": "E4", "semester": "S1" },
    { "id": 276, "courseId": "EE4154", "courseName": "Hybrid Electrical Vehicle", "department": "EEE", "year": "E4", "semester": "S1" },
    { "id": 277, "courseId": "BM4101", "courseName": "Managerial Economics and Financial Analysis", "department": "EEE", "year": "E4", "semester": "S1" },
  
    { "id": 278, "courseId": "ME4101", "courseName": "Automation in Manufacturing", "department": "ME", "year": "E4", "semester": "S1" },
    { "id": 279, "courseId": "ME4102", "courseName": "Refrigeration and Air Conditioning", "department": "ME", "year": "E4", "semester": "S1" },
    { "id": 280, "courseId": "ME4155", "courseName": "Industrial Engineering", "department": "ME", "year": "E4", "semester": "S1" },
    { "id": 281, "courseId": "ME4131", "courseName": "Automotive Systems", "department": "ME", "year": "E4", "semester": "S1" },
    { "id": 282, "courseId": "ME4144", "courseName": "Additive Manufacturing Technology", "department": "ME", "year": "E4", "semester": "S1" },
  
    { "id": 283, "courseId": "MM4133", "courseName": "Advanced Ceramics and Composites", "department": "MME", "year": "E4", "semester": "S1" },
    { "id": 284, "courseId": "MM4141", "courseName": "Advanced Materials Processing", "department": "MME", "year": "E4", "semester": "S1" },
    { "id": 285, "courseId": "BS4303", "courseName": "Biomaterials", "department": "MME", "year": "E4", "semester": "S1" },
    { "id": 286, "courseId": "BS4304", "courseName": "Biomedical Engineering", "department": "MME", "year": "E4", "semester": "S1" },
    { "id": 287, "courseId": "MM4152", "courseName": "Surface Engineering and Coating Technology", "department": "MME", "year": "E4", "semester": "S1" },
  
  
  
    // E4 S2
    { "id": 288, "courseId": "CE4252", "courseName": "Environmental Impact Assessment", "department": "CE", "year": "E4", "semester": "S2" },
    { "id": 289, "courseId": "BM4414", "courseName": "Intellectual Property Rights", "department": "CE", "year": "E4", "semester": "S2" },
    { "id": 290, "courseId": "BS4401", "courseName": "Sustainable Technologies", "department": "CE", "year": "E4", "semester": "S2" },
    { "id": 291, "courseId": "BM4416", "courseName": "Entrepreneurship & New Ventures", "department": "CE", "year": "E4", "semester": "S2" },
  
    { "id": 292, "courseId": "CH4251", "courseName": "Process Optimization", "department": "CHE", "year": "E4", "semester": "S2" },
    { "id": 293, "courseId": "CH4253", "courseName": "Advance Separation Process", "department": "CHE", "year": "E4", "semester": "S2" },
    { "id": 294, "courseId": "BM4416", "courseName": "Entrepreneurship and New Ventures", "department": "CHE", "year": "E4", "semester": "S2" },
    { "id": 295, "courseId": "BM4414", "courseName": "Intellectual Property Rights", "department": "CHE", "year": "E4", "semester": "S2" },
    { "id": 296, "courseId": "BS4401", "courseName": "Sustainable Technology", "department": "CHE", "year": "E4", "semester": "S2" },
  
    { "id": 297, "courseId": "CS4404", "courseName": "Cyber Law and Ethics", "department": "CSE", "year": "E4", "semester": "S2" },
    { "id": 298, "courseId": "CE4402", "courseName": "Disaster Management", "department": "CSE", "year": "E4", "semester": "S2" },
    { "id": 299, "courseId": "BM4414", "courseName": "Intellectual Property Rights", "department": "CSE", "year": "E4", "semester": "S2" },
    { "id": 300, "courseId": "BM4416", "courseName": "Entrepreneurship and New Ventures", "department": "CSE", "year": "E4", "semester": "S2" },
    { "id": 301, "courseId": "BS4401", "courseName": "Sustainable Technology", "department": "CSE", "year": "E4", "semester": "S2" },
  
    { "id": 302, "courseId": "EC4406", "courseName": "Wireless Sensor Networks", "department": "ECE", "year": "E4", "semester": "S2" },
    { "id": 303, "courseId": "BM4210", "courseName": "Professional Law and Ethics", "department": "ECE", "year": "E4", "semester": "S2" },
  
    { "id": 304, "courseId": "EE4252", "courseName": "Electric and Hybrid Vehicles", "department": "EEE", "year": "E4", "semester": "S2" },
    { "id": 305, "courseId": "CE4402", "courseName": "Disaster Management", "department": "EEE", "year": "E4", "semester": "S2" },
    { "id": 306, "courseId": "BM4414", "courseName": "Intellectual Property Rights", "department": "EEE", "year": "E4", "semester": "S2" },
    { "id": 307, "courseId": "BS4401", "courseName": "Sustainable Technology", "department": "EEE", "year": "E4", "semester": "S2" },
  
    { "id": 308, "courseId": "ME4261", "courseName": "Welding Technology", "department": "ME", "year": "E4", "semester": "S2" },
    { "id": 309, "courseId": "ME4403", "courseName": "Non Destructive Testing", "department": "ME", "year": "E4", "semester": "S2" },
  
    { "id": 310, "courseId": "MM4241", "courseName": "Light Metals and Alloys", "department": "MME", "year": "E4", "semester": "S2" },
    { "id": 311, "courseId": "MM4242", "courseName": "Composite Materials", "department": "MME", "year": "E4", "semester": "S2" },
    { "id": 312, "courseId": "MM4251", "courseName": "Advanced Materials Processing", "department": "MME", "year": "E4", "semester": "S2" },
    { "id": 313, "courseId": "MM4252", "courseName": "Polymer Engineering", "department": "MME", "year": "E4", "semester": "S2" },
    
    // P1 Lab
    { "id": 314, "courseId": "PY701", "courseName": "Physics Lab", "department": "PUC", "year": "1", "semester": "S1" },
    { "id": 315, "courseId": "CY701", "courseName": "Chemistry Lab", "department": "PUC", "year": "1", "semester": "S1" },
    // P2 Lab
    { "id": 316, "courseId": "CY801", "courseName": "Physics Lab", "department": "PUC", "year": "2", "semester": "S1" },
    { "id": 317, "courseId": "PY801", "courseName": "Chemistry Lab", "department": "PUC", "year": "2", "semester": "S1" },

    // E1

    { "id": 318, "courseId": "CS1701", "courseName": "Programing for Problem Solving Lab", "department": "CHE", "year": "1", "semester": "S1" },
    { "id": 319, "courseId": "CY1701", "courseName": "Engineering Chemistry Lab", "department": "CHE", "year": "1", "semester": "S1" },
    { "id": 320, "courseId": "ME1703", "courseName": "Engineering Workshop", "department": "CHE", "year": "1", "semester": "S1" },

    { "id": 321, "courseId": "ME1703", "courseName": "Engineering Workshop", "department": "CHE", "year": "1", "semester": "S1" },
    { "id": 322, "courseId": "ME1703", "courseName": "Engineering Workshop", "department": "CHE", "year": "1", "semester": "S1" },
    { "id": 323, "courseId": "ME1703", "courseName": "Engineering Workshop", "department": "CHE", "year": "1", "semester": "S1" },
    

  ]; 
