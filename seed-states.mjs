import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const states = [
  { state: 'AL', stateName: 'Alabama', filingFee: 20000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 10000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.alabama.gov/business-entities' },
  { state: 'AK', stateName: 'Alaska', filingFee: 25000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 10000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.commerce.alaska.gov/cbp/main/' },
  { state: 'AZ', stateName: 'Arizona', filingFee: 5000, processingTime: '1-2 weeks', annualReportRequired: false, annualReportFee: 0, publicationRequired: true, registeredAgentRequired: true, filingUrl: 'https://ecorp.azcc.gov/' },
  { state: 'AR', stateName: 'Arkansas', filingFee: 4500, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 15000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.arkansas.gov/business-commercial-services' },
  { state: 'CA', stateName: 'California', filingFee: 7000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 80000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://bizfileonline.sos.ca.gov/' },
  { state: 'CO', stateName: 'Colorado', filingFee: 5000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 1000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.coloradosos.gov/biz/Home.do' },
  { state: 'CT', stateName: 'Connecticut', filingFee: 12000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 8000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://portal.ct.gov/SOTS/Business-Services' },
  { state: 'DE', stateName: 'Delaware', filingFee: 9000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 30000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://corp.delaware.gov/' },
  { state: 'FL', stateName: 'Florida', filingFee: 12500, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 13875, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://dos.myflorida.com/sunbiz/' },
  { state: 'GA', stateName: 'Georgia', filingFee: 10000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 5000, publicationRequired: true, registeredAgentRequired: true, filingUrl: 'https://ecorp.sos.ga.gov/' },
  { state: 'HI', stateName: 'Hawaii', filingFee: 5000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 1500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://hbe.ehawaii.gov/' },
  { state: 'ID', stateName: 'Idaho', filingFee: 10000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://sosbiz.idaho.gov/' },
  { state: 'IL', stateName: 'Illinois', filingFee: 15000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 7500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.ilsos.gov/departments/business_services/' },
  { state: 'IN', stateName: 'Indiana', filingFee: 9500, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 5000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.in.gov/sos/business/' },
  { state: 'IA', stateName: 'Iowa', filingFee: 5000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 4500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://sos.iowa.gov/business/' },
  { state: 'KS', stateName: 'Kansas', filingFee: 16500, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 5000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.kssos.org/business/business.html' },
  { state: 'KY', stateName: 'Kentucky', filingFee: 4000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 1500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://web.sos.ky.gov/ftsearch/' },
  { state: 'LA', stateName: 'Louisiana', filingFee: 10000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 3500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.la.gov/BusinessServices/' },
  { state: 'ME', stateName: 'Maine', filingFee: 17500, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 8500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.maine.gov/sos/cec/corp/' },
  { state: 'MD', stateName: 'Maryland', filingFee: 10000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 30000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://egov.maryland.gov/businessexpress/' },
  { state: 'MA', stateName: 'Massachusetts', filingFee: 50000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 50000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sec.state.ma.us/cor/coridx.htm' },
  { state: 'MI', stateName: 'Michigan', filingFee: 5000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 2500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://cofs.lara.michigan.gov/' },
  { state: 'MN', stateName: 'Minnesota', filingFee: 13500, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.state.mn.us/business-liens/' },
  { state: 'MS', stateName: 'Mississippi', filingFee: 5000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.ms.gov/business-services' },
  { state: 'MO', stateName: 'Missouri', filingFee: 5000, processingTime: '1-2 weeks', annualReportRequired: false, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.mo.gov/business' },
  { state: 'MT', stateName: 'Montana', filingFee: 7000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 2000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://biz.sosmt.gov/' },
  { state: 'NE', stateName: 'Nebraska', filingFee: 10000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 1300, publicationRequired: true, registeredAgentRequired: true, filingUrl: 'https://www.nebraska.gov/sos/corp/' },
  { state: 'NV', stateName: 'Nevada', filingFee: 42500, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 35000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.nvsos.gov/sos/businesses' },
  { state: 'NH', stateName: 'New Hampshire', filingFee: 10000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 10000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.nh.gov/corporations' },
  { state: 'NJ', stateName: 'New Jersey', filingFee: 12500, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 7500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.nj.gov/treasury/revenue/dcr/programs/llc.shtml' },
  { state: 'NM', stateName: 'New Mexico', filingFee: 5000, processingTime: '2-3 weeks', annualReportRequired: false, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://portal.sos.state.nm.us/' },
  { state: 'NY', stateName: 'New York', filingFee: 20000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 900, publicationRequired: true, registeredAgentRequired: true, filingUrl: 'https://www.dos.ny.gov/corps/' },
  { state: 'NC', stateName: 'North Carolina', filingFee: 12500, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 20000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sosnc.gov/online_services' },
  { state: 'ND', stateName: 'North Dakota', filingFee: 13500, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 5000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://firststop.sos.nd.gov/' },
  { state: 'OH', stateName: 'Ohio', filingFee: 9900, processingTime: '1-2 weeks', annualReportRequired: false, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.state.oh.us/businesses/' },
  { state: 'OK', stateName: 'Oklahoma', filingFee: 10000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 2500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.ok.gov/business/default.aspx' },
  { state: 'OR', stateName: 'Oregon', filingFee: 10000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 10000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://sos.oregon.gov/business/' },
  { state: 'PA', stateName: 'Pennsylvania', filingFee: 12500, processingTime: '2-3 weeks', annualReportRequired: false, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.dos.pa.gov/BusinessCharities/' },
  { state: 'RI', stateName: 'Rhode Island', filingFee: 15000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 5000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://business.sos.ri.gov/' },
  { state: 'SC', stateName: 'South Carolina', filingFee: 11000, processingTime: '2-3 weeks', annualReportRequired: false, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://businessfilings.sc.gov/' },
  { state: 'SD', stateName: 'South Dakota', filingFee: 15000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 5000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://sosenterprise.sd.gov/' },
  { state: 'TN', stateName: 'Tennessee', filingFee: 30000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 30000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://tnbear.tn.gov/' },
  { state: 'TX', stateName: 'Texas', filingFee: 30000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 0, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.state.tx.us/corp/index.shtml' },
  { state: 'UT', stateName: 'Utah', filingFee: 7000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 1800, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://corporations.utah.gov/' },
  { state: 'VT', stateName: 'Vermont', filingFee: 12500, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 3500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://sos.vermont.gov/corporations/' },
  { state: 'VA', stateName: 'Virginia', filingFee: 10000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 5000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.scc.virginia.gov/clk/begin.aspx' },
  { state: 'WA', stateName: 'Washington', filingFee: 20000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 6900, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.sos.wa.gov/corps/' },
  { state: 'WV', stateName: 'West Virginia', filingFee: 10000, processingTime: '2-4 weeks', annualReportRequired: true, annualReportFee: 2500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://apps.wv.gov/SOS/BusinessEntitySearch/' },
  { state: 'WI', stateName: 'Wisconsin', filingFee: 13000, processingTime: '2-3 weeks', annualReportRequired: true, annualReportFee: 2500, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://www.wdfi.org/corporations/' },
  { state: 'WY', stateName: 'Wyoming', filingFee: 10000, processingTime: '1-2 weeks', annualReportRequired: true, annualReportFee: 6000, publicationRequired: false, registeredAgentRequired: true, filingUrl: 'https://sos.wyo.gov/Business/' },
];

console.log(`Seeding ${states.length} state requirements...`);

for (const state of states) {
  try {
    await connection.query(
      `INSERT INTO stateRequirements (state, stateName, filingFee, processingTime, annualReportRequired, annualReportFee, publicationRequired, registeredAgentRequired, filingUrl)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
       stateName = VALUES(stateName),
       filingFee = VALUES(filingFee),
       processingTime = VALUES(processingTime),
       annualReportRequired = VALUES(annualReportRequired),
       annualReportFee = VALUES(annualReportFee),
       publicationRequired = VALUES(publicationRequired),
       registeredAgentRequired = VALUES(registeredAgentRequired),
       filingUrl = VALUES(filingUrl)`,
      [
        state.state,
        state.stateName,
        state.filingFee,
        state.processingTime,
        state.annualReportRequired,
        state.annualReportFee,
        state.publicationRequired,
        state.registeredAgentRequired,
        state.filingUrl,
      ]
    );
    console.log(`✓ ${state.stateName} (${state.state})`);
  } catch (error) {
    console.error(`✗ Failed to seed ${state.stateName}:`, error.message);
  }
}

await connection.end();
console.log('\n✅ State requirements seeded successfully!');
