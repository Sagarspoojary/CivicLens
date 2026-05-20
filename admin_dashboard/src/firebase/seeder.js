import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./config";

// Predefined Departments
export const DEPARTMENTS = [
  "Waste Management",
  "Road Department",
  "Water Board",
  "Electricity Department",
  "Municipality",
  "Traffic Department",
  "Public Health Department",
  "Animal Welfare Department"
];

// Predefined official credentials with custom passwords as requested
export const PREDEFINED_USERS = [
  // Waste Management Department
  { email: "waste001@civiclens.gov", password: "Waste@123", role: "Waste Management", name: "Waste Officer 001" },
  { email: "waste002@civiclens.gov", password: "Waste@123", role: "Waste Management", name: "Waste Inspector 002" },
  { email: "waste003@civiclens.gov", password: "Waste@123", role: "Waste Management", name: "Waste Director 003" },
  
  // Road Department
  { email: "road001@civiclens.gov", password: "Road@123", role: "Road Department", name: "Road Engineer 001" },
  { email: "road002@civiclens.gov", password: "Road@123", role: "Road Department", name: "Road Inspector 002" },
  { email: "road003@civiclens.gov", password: "Road@123", role: "Road Department", name: "Road Superintendent 003" },
  
  // Water Board
  { email: "water001@civiclens.gov", password: "Water@123", role: "Water Board", name: "Water Superintendent 001" },
  { email: "water002@civiclens.gov", password: "Water@123", role: "Water Board", name: "Water Inspector 002" },
  { email: "water003@civiclens.gov", password: "Water@123", role: "Water Board", name: "Water Director 003" },
  
  // Electricity Department
  { email: "electricity001@civiclens.gov", password: "Electric@123", role: "Electricity Department", name: "Grid Engineer 001" },
  { email: "electricity002@civiclens.gov", password: "Electric@123", role: "Electricity Department", name: "Elec Inspector 002" },
  { email: "electricity003@civiclens.gov", password: "Electric@123", role: "Electricity Department", name: "Grid Director 003" },
  
  // Municipality / Drainage Department
  { email: "municipality001@civiclens.gov", password: "Muni@123", role: "Municipality", name: "Muni Commissioner 001" },
  { email: "municipality002@civiclens.gov", password: "Muni@123", role: "Municipality", name: "Muni Assistant 002" },
  { email: "municipality003@civiclens.gov", password: "Muni@123", role: "Municipality", name: "Muni Director 003" },
  
  // Traffic Department
  { email: "traffic001@civiclens.gov", password: "Traffic@123", role: "Traffic Department", name: "Traffic DCP 001" },
  { email: "traffic002@civiclens.gov", password: "Traffic@123", role: "Traffic Department", name: "Traffic Inspector 002" },
  { email: "traffic003@civiclens.gov", password: "Traffic@123", role: "Traffic Department", name: "Traffic ACP 003" },
  
  // Public Health Department
  { email: "health001@civiclens.gov", password: "Health@123", role: "Public Health Department", name: "Health Officer 001" },
  { email: "health002@civiclens.gov", password: "Health@123", role: "Public Health Department", name: "Health Inspector 002" },
  { email: "health003@civiclens.gov", password: "Health@123", role: "Public Health Department", name: "Health Director 003" },
  
  // Animal Welfare Department
  { email: "animal001@civiclens.gov", password: "Animal@123", role: "Animal Welfare Department", name: "Animal Welfare Lead 001" },
  { email: "animal002@civiclens.gov", password: "Animal@123", role: "Animal Welfare Department", name: "Animal Welfare Inspector 002" },
  { email: "animal003@civiclens.gov", password: "Animal@123", role: "Animal Welfare Department", name: "Animal Welfare Vet 003" },

  // Super Admin
  { email: "admin@civiclens.gov", password: "Admin@123", role: "Administrator", name: "Super Admin Clearance" }
];

// Rich, high-fidelity mock complaints
export const MOCK_COMPLAINTS = [
  {
    id: "comp-001",
    complaintType: "Garbage Overflow & Waste Pileup",
    assignedDepartment: "Waste Management",
    imageUrl: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?w=600&auto=format&fit=crop&q=80",
    description: "Huge garbage accumulation near the local primary school. Bad smell is spreading, posing a major health hazard for children.",
    location: {
      lat: 12.971598,
      lng: 77.594562,
      address: "24th Main Road, Sector 2, HSR Layout, Bengaluru"
    },
    priority: "High",
    status: "Pending",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    userId: "citizen_hsr_44"
  },
  {
    id: "comp-002",
    complaintType: "Clogged Sewer and Waste Drainage",
    assignedDepartment: "Waste Management",
    imageUrl: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?w=600&auto=format&fit=crop&q=80",
    description: "Sewer drainage has completely overflowed onto the public street. Walking has become impossible.",
    location: {
      lat: 12.934533,
      lng: 77.610122,
      address: "Koramanagala 4th Block, near Maharaja Signal, Bengaluru"
    },
    priority: "Critical",
    status: "In Progress",
    timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), // 12 hours ago
    userId: "citizen_kora_99"
  },
  {
    id: "comp-003",
    complaintType: "Hazardous Industrial Pothole",
    assignedDepartment: "Road Department",
    imageUrl: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?w=600&auto=format&fit=crop&q=80",
    description: "Extremely deep pothole in the middle of the main lane. Several two-wheelers have crashed here in the dark.",
    location: {
      lat: 12.978912,
      lng: 77.640234,
      address: "100 Feet Road, Indiranagar, near Metro Station, Bengaluru"
    },
    priority: "Critical",
    status: "Pending",
    timestamp: new Date(Date.now() - 3600000 * 4).toISOString(), // 4 hours ago
    userId: "citizen_indira_12"
  },
  {
    id: "comp-004",
    complaintType: "Damaged Sidewalk & Broken Curbs",
    assignedDepartment: "Road Department",
    imageUrl: "https://images.unsplash.com/photo-1584467541268-b040f83be3fd?w=600&auto=format&fit=crop&q=80",
    description: "The concrete slabs on the walking path are broken and caving in. Highly unsafe for senior citizens.",
    location: {
      lat: 12.959123,
      lng: 77.697412,
      address: "Marathahalli Bridge Underpass walking lane, Bengaluru"
    },
    priority: "Medium",
    status: "Resolved",
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    userId: "citizen_marath_02"
  },
  {
    id: "comp-005",
    complaintType: "Main Water Pipeline Burst",
    assignedDepartment: "Water Board",
    imageUrl: "https://images.unsplash.com/photo-1542013936693-8848e574047a?w=600&auto=format&fit=crop&q=80",
    description: "A huge water pipe burst. Millions of liters of clean drinking water are being wasted and flooding the road.",
    location: {
      lat: 12.927921,
      lng: 77.681123,
      address: "Outer Ring Road, near Bellandur EcoSpace, Bengaluru"
    },
    priority: "Critical",
    status: "In Progress",
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(), // 1 hour ago
    userId: "citizen_bella_77"
  },
  {
    id: "comp-006",
    complaintType: "Contaminated Drinking Water Supply",
    assignedDepartment: "Water Board",
    imageUrl: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=600&auto=format&fit=crop&q=80",
    description: "Tap water in our community has turned muddy brown and smells bad. Unusable and dangerous.",
    location: {
      lat: 13.028912,
      lng: 77.589123,
      address: "Hebbal, Vinayaka Nagar, 3rd Cross, Bengaluru"
    },
    priority: "High",
    status: "Pending",
    timestamp: new Date(Date.now() - 3600000 * 20).toISOString(),
    userId: "citizen_hebbal_11"
  },
  {
    id: "comp-007",
    complaintType: "Sparking Transformer & Hanging Wires",
    assignedDepartment: "Electricity Department",
    imageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&auto=format&fit=crop&q=80",
    description: "Power transformer is sparking constantly during winds. Loose live wires are hanging at arm's height.",
    location: {
      lat: 12.908234,
      lng: 77.571234,
      address: "Jayanagar 4th T Block, near swimming pool, Bengaluru"
    },
    priority: "Critical",
    status: "Pending",
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    userId: "citizen_jaya_05"
  },
  {
    id: "comp-008",
    complaintType: "Streetlight Outage / Dark Alleyways",
    assignedDepartment: "Electricity Department",
    imageUrl: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&auto=format&fit=crop&q=80",
    description: "Complete row of streetlights has been out for 5 days. Girls feel extremely unsafe walking back from work.",
    location: {
      lat: 12.981234,
      lng: 77.591234,
      address: "Cunningham Road, near Fortis Hospital, Bengaluru"
    },
    priority: "Medium",
    status: "Resolved",
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    userId: "citizen_cunn_88"
  },
  {
    id: "comp-009",
    complaintType: "Unauthorized Encroachment on Sidewalks",
    assignedDepartment: "Municipality",
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80",
    description: "Stalls and commercial shops have occupied the walking path. Pedestrians forced onto high-speed road.",
    location: {
      lat: 12.969123,
      lng: 77.620123,
      address: "Domlur Flyover Underpass Market, Bengaluru"
    },
    priority: "Medium",
    status: "Pending",
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    userId: "citizen_dom_09"
  },
  {
    id: "comp-010",
    complaintType: "Broken Traffic Signal - Heavy Jams",
    assignedDepartment: "Traffic Department",
    imageUrl: "https://images.unsplash.com/photo-1494832421162-538999141953?w=600&auto=format&fit=crop&q=80",
    description: "The main traffic lights at the junction are completely dead. Heavy gridlock and high risk of accidents.",
    location: {
      lat: 12.938912,
      lng: 77.624123,
      address: "Sony World Signal Junction, Koramangala, Bengaluru"
    },
    priority: "High",
    status: "Pending",
    timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    userId: "citizen_kora_55"
  },
  {
    id: "comp-011",
    complaintType: "Unchecked Mosquito Breeding Grounds",
    assignedDepartment: "Public Health Department",
    imageUrl: "https://images.unsplash.com/photo-1532187643603-ba119ca4109e?w=600&auto=format&fit=crop&q=80",
    description: "Stagnant marshy water has collected at this vacant lot. Huge breeding ground, Dengue cases spreading fast.",
    location: {
      lat: 12.991234,
      lng: 77.661234,
      address: "Kasturi Nagar, near Lake road, Bengaluru"
    },
    priority: "High",
    status: "In Progress",
    timestamp: new Date(Date.now() - 3600000 * 30).toISOString(),
    userId: "citizen_kast_44"
  },
  {
    id: "comp-012",
    complaintType: "Injured Stray Animal Rescue",
    assignedDepartment: "Animal Welfare Department",
    imageUrl: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop&q=80",
    description: "Stray dog was hit by a speeding vehicle and is lying injured on the side road. Needs vet assistance ASAP.",
    location: {
      lat: 12.961234,
      lng: 77.641234,
      address: "HAL 2nd Stage, near ESI Hospital, Bengaluru"
    },
    priority: "High",
    status: "Pending",
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userId: "citizen_hal_90"
  }
];

// Initialize local database in simulation mode
export const initializeSimulatedData = () => {
  const usersExist = localStorage.getItem("civiclens_sim_users");
  const complaintsExist = localStorage.getItem("civiclens_sim_complaints");

  if (!usersExist) {
    localStorage.setItem("civiclens_sim_users", JSON.stringify(PREDEFINED_USERS));
  }
  if (!complaintsExist) {
    localStorage.setItem("civiclens_sim_complaints", JSON.stringify(MOCK_COMPLAINTS));
  }
  console.log("CivicLens Simulator: Local Storage database initialized successfully.");
};

// Seed real Firebase Auth and Firestore with predefined users
export const seedRealFirebase = async () => {
  if (!auth || !db) {
    throw new Error("Firebase services are not active. Verify VITE_FIREBASE config in your environmental parameters.");
  }

  let successCount = 0;
  let skippedCount = 0;
  const errors = [];

  for (const user of PREDEFINED_USERS) {
    try {
      let uid = null;
      try {
        // Try creating the user
        const res = await createUserWithEmailAndPassword(auth, user.email, user.password);
        uid = res.user.uid;
        successCount++;
      } catch (authError) {
        if (authError.code === "auth/email-already-in-use") {
          // If already in use, we attempt to sign them in to fetch the UID, then update Firestore
          try {
            const res = await signInWithEmailAndPassword(auth, user.email, user.password);
            uid = res.user.uid;
            skippedCount++;
          } catch (signInErr) {
            errors.push(`${user.email} (failed signin): ${signInErr.message}`);
            continue;
          }
        } else {
          errors.push(`${user.email} (failed creation): ${authError.message}`);
          continue;
        }
      }

      if (uid) {
        // Save user role & name to Firestore "users" collection
        await setDoc(doc(db, "users", uid), {
          email: user.email,
          role: user.role,
          displayName: user.name,
          createdAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error(`Failed seeding ${user.email}:`, err);
      errors.push(`${user.email}: ${err.message}`);
    }
  }

  return { successCount, skippedCount, errors };
};
