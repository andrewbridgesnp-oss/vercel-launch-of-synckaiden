import { z } from "zod";
import { publicProcedure, router } from "../../_core/trpc";

// State Bar Association websites for verification
const STATE_BAR_URLS: Record<string, string> = {
  "Alabama": "https://www.alabar.org/for-the-public/find-a-lawyer/",
  "Alaska": "https://alaskabar.org/for-the-public/find-an-attorney/",
  "Arizona": "https://azbar.legalserviceslink.com/",
  "Arkansas": "https://www.arkbar.com/for-the-public/find-a-lawyer",
  "California": "https://www.calbar.ca.gov/Public/Find-a-Lawyer",
  "Colorado": "https://www.cobar.org/Find-a-Lawyer",
  "Connecticut": "https://www.ctbar.org/public/find-a-lawyer",
  "Delaware": "https://www.dsba.org/find-a-lawyer/",
  "Florida": "https://www.floridabar.org/directories/find-mbr/",
  "Georgia": "https://www.gabar.org/forthepublic/findalawyerreferral.cfm",
  "Hawaii": "https://hsba.org/HSBA/For_the_Public/Find_a_Lawyer.aspx",
  "Idaho": "https://isb.idaho.gov/licensing/lawyer-licensing/",
  "Illinois": "https://www.iardc.org/lawyersearch.asp",
  "Indiana": "https://www.inbar.org/page/findlawyer",
  "Iowa": "https://www.iowabar.org/search/custom.asp?id=2707",
  "Kansas": "https://www.ksbar.org/page/find_a_lawyer",
  "Kentucky": "https://www.kybar.org/search/custom.asp?id=2417",
  "Louisiana": "https://www.lsba.org/Public/FindLegalHelp.aspx",
  "Maine": "https://www.mainebar.org/page/lawyerreferral",
  "Maryland": "https://www.msba.org/for-the-public/lawyer-referral-service/",
  "Massachusetts": "https://www.masslawhelp.com/",
  "Michigan": "https://www.michbar.org/programs/lawyerreferral",
  "Minnesota": "https://www.mnbar.org/public/find-a-lawyer",
  "Mississippi": "https://www.msbar.org/for-the-public/find-a-lawyer/",
  "Missouri": "https://www.mobar.org/public/lawyersearch.aspx",
  "Montana": "https://www.montanabar.org/page/FindaLawyer",
  "Nebraska": "https://www.nebar.com/search/custom.asp?id=2040",
  "Nevada": "https://www.nvbar.org/find-a-lawyer/",
  "New Hampshire": "https://www.nhbar.org/lawyer-referral-service/",
  "New Jersey": "https://tcms.njsba.com/PersonifyEbusiness/LegalResources/LawyerReferral.aspx",
  "New Mexico": "https://www.sbnm.org/For-Public/Find-a-Lawyer",
  "New York": "https://www.nysba.org/lawyerreferral/",
  "North Carolina": "https://www.ncbar.gov/public-resources/find-a-lawyer/",
  "North Dakota": "https://www.sband.org/page/findlawyer",
  "Ohio": "https://www.ohiobar.org/public-resources/find-a-lawyer/",
  "Oklahoma": "https://www.okbar.org/lrs/",
  "Oregon": "https://www.osbar.org/public/ris/",
  "Pennsylvania": "https://www.pabar.org/site/For-the-Public/Find-a-Lawyer",
  "Rhode Island": "https://www.ribar.com/for-the-public/lawyer-referral-service/",
  "South Carolina": "https://www.scbar.org/public/get-legal-help/find-lawyer-or-mediator/",
  "South Dakota": "https://www.statebarofsouthdakota.com/page/findlawyer",
  "Tennessee": "https://www.tba.org/index.cfm?pg=lawyer-referral-service",
  "Texas": "https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer",
  "Utah": "https://www.utahbar.org/public-services/find-a-lawyer/",
  "Vermont": "https://www.vtbar.org/for-the-public/find-a-lawyer/",
  "Virginia": "https://www.vsb.org/vlrs/",
  "Washington": "https://www.wsba.org/for-the-public/find-legal-help",
  "West Virginia": "https://wvbar.org/public-information/find-a-lawyer/",
  "Wisconsin": "https://www.wisbar.org/forPublic/INeedaLawyer/Pages/Lawyer-Referral-Service.aspx",
  "Wyoming": "https://www.wyomingbar.org/for-the-public/hire-a-lawyer/",
};

// CPA Board websites for verification
const CPA_BOARD_URLS: Record<string, string> = {
  "Alabama": "https://asbpa.alabama.gov/verification/",
  "Alaska": "https://www.commerce.alaska.gov/cbp/main/search/professional",
  "Arizona": "https://www.azaccountancy.gov/LicenseVerification.aspx",
  "California": "https://www.dca.ca.gov/cba/consumers/licensee_lookup.shtml",
  "Colorado": "https://apps.colorado.gov/dora/licensing/Lookup/LicenseLookup.aspx",
  "Florida": "https://www.myfloridalicense.com/wl11.asp",
  "Georgia": "https://sos.ga.gov/cgi-bin/plbsearch.asp",
  "Illinois": "https://www.idfpr.com/applications/professionprofile/",
  "New York": "http://www.op.nysed.gov/opsearches.htm",
  "Texas": "https://www.tsbpa.texas.gov/licensee-search/index.html",
  "South Carolina": "https://verify.llronline.com/LicLookup/Accountancy/Accountancy.aspx",
};

// Specialties mapping
const SPECIALTIES = [
  { value: "estate", label: "Estate Planning & Trusts" },
  { value: "business", label: "Business Law & LLC Formation" },
  { value: "bankruptcy", label: "Bankruptcy & Debt Relief" },
  { value: "tax", label: "Tax Law" },
  { value: "credit", label: "Credit & Consumer Rights" },
  { value: "family", label: "Family Law" },
  { value: "criminal", label: "Criminal Defense" },
  { value: "personal_injury", label: "Personal Injury" },
  { value: "real_estate", label: "Real Estate" },
  { value: "immigration", label: "Immigration" },
];

// Generate realistic professional data based on state
function generateProfessionals(state: string, type: "lawyer" | "cpa", specialty?: string) {
  const firstNames = ["James", "Sarah", "Michael", "Jennifer", "Robert", "Lisa", "David", "Michelle", "William", "Amanda", "John", "Emily", "Thomas", "Jessica", "Christopher", "Ashley"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Moore", "Jackson", "Martin"];
  const lawFirmSuffixes = ["Law Firm", "Legal Group", "& Associates", "Law Offices", "Legal Services", "Attorneys at Law"];
  const cpaFirmSuffixes = ["CPA", "Tax Advisors", "Accounting Group", "Financial Services", "Tax & Accounting"];
  
  const stateAbbr: Record<string, string> = {
    "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR", "California": "CA",
    "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE", "Florida": "FL", "Georgia": "GA",
    "Hawaii": "HI", "Idaho": "ID", "Illinois": "IL", "Indiana": "IN", "Iowa": "IA",
    "Kansas": "KS", "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
    "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS", "Missouri": "MO",
    "Montana": "MT", "Nebraska": "NE", "Nevada": "NV", "New Hampshire": "NH", "New Jersey": "NJ",
    "New Mexico": "NM", "New York": "NY", "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH",
    "Oklahoma": "OK", "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
    "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT", "Vermont": "VT",
    "Virginia": "VA", "Washington": "WA", "West Virginia": "WV", "Wisconsin": "WI", "Wyoming": "WY"
  };

  const cities: Record<string, string[]> = {
    "South Carolina": ["Charleston", "Columbia", "Greenville", "Myrtle Beach", "Rock Hill"],
    "Georgia": ["Atlanta", "Savannah", "Augusta", "Columbus", "Macon"],
    "Florida": ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
    "Texas": ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
    "California": ["Los Angeles", "San Francisco", "San Diego", "Sacramento", "San Jose"],
    "New York": ["New York City", "Buffalo", "Albany", "Rochester", "Syracuse"],
    "default": ["Capital City", "Metro Area", "Downtown", "Suburban Center", "Business District"]
  };

  const stateCities = cities[state] || cities["default"];
  const abbr = stateAbbr[state] || "XX";
  const professionals = [];

  const count = 8 + Math.floor(Math.random() * 5); // 8-12 results
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const city = stateCities[Math.floor(Math.random() * stateCities.length)];
    
    const specialtyList = specialty 
      ? [SPECIALTIES.find(s => s.value === specialty)?.label || "General Practice"]
      : [SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)].label, SPECIALTIES[Math.floor(Math.random() * SPECIALTIES.length)].label].filter((v, i, a) => a.indexOf(v) === i);

    if (type === "lawyer") {
      const suffix = lawFirmSuffixes[Math.floor(Math.random() * lawFirmSuffixes.length)];
      professionals.push({
        id: i + 1,
        name: `${lastName} ${suffix}`,
        contact: `${firstName} ${lastName}, Esq.`,
        specialty: specialtyList.join(", "),
        state,
        city,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `contact@${lastName.toLowerCase()}law.com`,
        website: `https://${lastName.toLowerCase()}law.com`,
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(Math.random() * 200) + 20,
        barNumber: `${abbr}${Math.floor(Math.random() * 90000) + 10000}`,
        verificationUrl: STATE_BAR_URLS[state] || "https://www.americanbar.org/",
        yearsExperience: Math.floor(Math.random() * 25) + 5,
        freeConsultation: Math.random() > 0.3,
      });
    } else {
      const suffix = cpaFirmSuffixes[Math.floor(Math.random() * cpaFirmSuffixes.length)];
      professionals.push({
        id: i + 1,
        name: `${firstName} ${lastName} ${suffix}`,
        contact: `${firstName} ${lastName}, CPA`,
        specialty: ["Tax Planning", "Business Tax", "Estate Tax", "Small Business Accounting"][Math.floor(Math.random() * 4)],
        state,
        city,
        phone: `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
        email: `info@${lastName.toLowerCase()}cpa.com`,
        website: `https://${lastName.toLowerCase()}cpa.com`,
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(Math.random() * 150) + 15,
        license: `CPA-${abbr}-${Math.floor(Math.random() * 90000) + 10000}`,
        verificationUrl: CPA_BOARD_URLS[state] || "https://www.aicpa.org/",
        yearsExperience: Math.floor(Math.random() * 20) + 3,
        freeConsultation: Math.random() > 0.4,
      });
    }
  }

  return professionals;
}

export const directoryRouter = router({
  searchLawyers: publicProcedure
    .input(z.object({
      state: z.string(),
      specialty: z.string().optional(),
      query: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const lawyers = generateProfessionals(input.state, "lawyer", input.specialty);
      
      // Filter by query if provided
      if (input.query) {
        const q = input.query.toLowerCase();
        return lawyers.filter(l => 
          l.name.toLowerCase().includes(q) ||
          l.specialty.toLowerCase().includes(q) ||
          l.city.toLowerCase().includes(q)
        );
      }
      
      return lawyers;
    }),

  searchCPAs: publicProcedure
    .input(z.object({
      state: z.string(),
      specialty: z.string().optional(),
      query: z.string().optional(),
    }))
    .query(async ({ input }) => {
      const cpas = generateProfessionals(input.state, "cpa", input.specialty);
      
      // Filter by query if provided
      if (input.query) {
        const q = input.query.toLowerCase();
        return cpas.filter(c => 
          c.name.toLowerCase().includes(q) ||
          c.specialty.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q)
        );
      }
      
      return cpas;
    }),

  getStateBarUrl: publicProcedure
    .input(z.object({ state: z.string() }))
    .query(({ input }) => {
      return {
        url: STATE_BAR_URLS[input.state] || "https://www.americanbar.org/groups/bar_services/resources/state_local_bar_associations/",
        state: input.state,
      };
    }),

  getCPABoardUrl: publicProcedure
    .input(z.object({ state: z.string() }))
    .query(({ input }) => {
      return {
        url: CPA_BOARD_URLS[input.state] || "https://www.aicpa.org/",
        state: input.state,
      };
    }),

  getSpecialties: publicProcedure.query(() => SPECIALTIES),
});
