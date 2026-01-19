import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, Calculator, ExternalLink, Search, Shield, CheckCircle, MapPin, Building2 } from "lucide-react";
import { Link } from "wouter";

// Official State Bar Association "Find a Lawyer" links - All 50 states + DC
const STATE_BAR_LINKS: Record<string, { name: string; lawyerSearch: string; cpaBoard: string }> = {
  AL: { name: "Alabama", lawyerSearch: "https://www.alabar.org/for-the-public/find-a-lawyer/", cpaBoard: "https://asbpa.alabama.gov/verify" },
  AK: { name: "Alaska", lawyerSearch: "https://www.alaskabar.org/for-the-public/find-a-lawyer/", cpaBoard: "https://www.commerce.alaska.gov/cbp/main/search/professional" },
  AZ: { name: "Arizona", lawyerSearch: "https://www.azbar.org/for-the-public/find-a-lawyer/", cpaBoard: "https://azaccountancy.gov/verify-a-license/" },
  AR: { name: "Arkansas", lawyerSearch: "https://www.arkbar.com/for-the-public/find-a-lawyer", cpaBoard: "https://www.asbpa.arkansas.gov/license-verification" },
  CA: { name: "California", lawyerSearch: "https://www.calbar.ca.gov/Attorneys/LawyerSearch", cpaBoard: "https://www.dca.ca.gov/cba/consumers/licensee_lookup.shtml" },
  CO: { name: "Colorado", lawyerSearch: "https://www.cobar.org/For-the-Public/Find-a-Lawyer", cpaBoard: "https://www.dora.state.co.us/licensing/lookup/lookup.aspx" },
  CT: { name: "Connecticut", lawyerSearch: "https://www.ctbar.org/public/find-a-lawyer", cpaBoard: "https://www.elicense.ct.gov/Lookup/LicenseLookup.aspx" },
  DE: { name: "Delaware", lawyerSearch: "https://www.dsba.org/find-a-lawyer/", cpaBoard: "https://dpr.delaware.gov/license-lookup/" },
  FL: { name: "Florida", lawyerSearch: "https://www.floridabar.org/directories/find-mbr/", cpaBoard: "https://www.myfloridalicense.com/wl11.asp" },
  GA: { name: "Georgia", lawyerSearch: "https://www.gabar.org/forthepublic/findalawyer.cfm", cpaBoard: "https://cpaverify.org/" },
  HI: { name: "Hawaii", lawyerSearch: "https://hsba.org/HSBA/For_the_Public/Find_a_Lawyer.aspx", cpaBoard: "https://pvl.ehawaii.gov/pvlsearch/" },
  ID: { name: "Idaho", lawyerSearch: "https://isb.idaho.gov/licensing/find-a-lawyer/", cpaBoard: "https://isba.idaho.gov/verify-a-license/" },
  IL: { name: "Illinois", lawyerSearch: "https://www.iardc.org/lawyersearch.asp", cpaBoard: "https://www.ildfpr.com/LicenseLookUp/LicenseLookup.aspx" },
  IN: { name: "Indiana", lawyerSearch: "https://www.inbar.org/for-the-public/find-a-lawyer/", cpaBoard: "https://mylicense.in.gov/EVerification/Search.aspx" },
  IA: { name: "Iowa", lawyerSearch: "https://www.iowabar.org/search/custom.asp?id=2962", cpaBoard: "https://plb.iowa.gov/licensee-search" },
  KS: { name: "Kansas", lawyerSearch: "https://www.kansasbar.org/for-the-public/find-a-lawyer", cpaBoard: "https://www.kansas.gov/bota/verify.do" },
  KY: { name: "Kentucky", lawyerSearch: "https://www.kybar.org/search/custom.asp?id=2962", cpaBoard: "https://cpa.ky.gov/Pages/Licensee-Search.aspx" },
  LA: { name: "Louisiana", lawyerSearch: "https://www.lsba.org/Public/FindLegalHelp.aspx", cpaBoard: "https://cpaboard.state.la.us/verify-a-license/" },
  ME: { name: "Maine", lawyerSearch: "https://www.mainebar.org/page/LawyerSearch", cpaBoard: "https://www.maine.gov/pfr/professionallicensing/professions/accountants" },
  MD: { name: "Maryland", lawyerSearch: "https://www.msba.org/for-the-public/lawyer-referral-service/", cpaBoard: "https://www.dllr.state.md.us/cgi-bin/ElectronicLicensing/OP_Search/OP_search.cgi" },
  MA: { name: "Massachusetts", lawyerSearch: "https://www.massbbo.org/AttorneySearch", cpaBoard: "https://www.mass.gov/orgs/board-of-registration-of-public-accountants" },
  MI: { name: "Michigan", lawyerSearch: "https://www.michbar.org/programs/lawyerfinder", cpaBoard: "https://www.michigan.gov/lara/bureau-list/bpl/occ/acct" },
  MN: { name: "Minnesota", lawyerSearch: "https://www.mnbar.org/resources/lawyer-referral", cpaBoard: "https://www.boa.state.mn.us/LicenseVerification.aspx" },
  MS: { name: "Mississippi", lawyerSearch: "https://www.msbar.org/for-the-public/find-a-lawyer.aspx", cpaBoard: "https://www.msbpa.ms.gov/verify" },
  MO: { name: "Missouri", lawyerSearch: "https://www.mobar.org/public/lawyersearch.aspx", cpaBoard: "https://pr.mo.gov/licensee-search-background.asp" },
  MT: { name: "Montana", lawyerSearch: "https://www.montanabar.org/page/LawyerSearch", cpaBoard: "https://boards.bsd.dli.mt.gov/public-accountants" },
  NE: { name: "Nebraska", lawyerSearch: "https://www.nebar.com/search/custom.asp?id=2962", cpaBoard: "https://www.nbpa.ne.gov/verify" },
  NV: { name: "Nevada", lawyerSearch: "https://www.nvbar.org/find-a-lawyer/", cpaBoard: "https://www.nvaccountancy.com/verify-a-license/" },
  NH: { name: "New Hampshire", lawyerSearch: "https://www.nhbar.org/lawyer-referral-service", cpaBoard: "https://www.oplc.nh.gov/board-accountancy" },
  NJ: { name: "New Jersey", lawyerSearch: "https://www.njsba.com/for-the-public/find-a-lawyer/", cpaBoard: "https://newjersey.mylicense.com/verification/" },
  NM: { name: "New Mexico", lawyerSearch: "https://www.sbnm.org/For-Public/Find-a-Lawyer", cpaBoard: "https://www.rld.state.nm.us/boards/Accountancy.aspx" },
  NY: { name: "New York", lawyerSearch: "https://www.nysba.org/lawyerreferral/", cpaBoard: "http://www.op.nysed.gov/opsearches.htm" },
  NC: { name: "North Carolina", lawyerSearch: "https://www.ncbar.gov/for-the-public/find-a-lawyer/", cpaBoard: "https://www.nccpaboard.gov/verify-a-license/" },
  ND: { name: "North Dakota", lawyerSearch: "https://www.sband.org/page/find_a_lawyer", cpaBoard: "https://www.ndsba.nd.gov/verify" },
  OH: { name: "Ohio", lawyerSearch: "https://www.ohiobar.org/public-resources/find-a-lawyer/", cpaBoard: "https://www.acc.ohio.gov/LicenseeLookup.aspx" },
  OK: { name: "Oklahoma", lawyerSearch: "https://www.okbar.org/freelegalanswers/", cpaBoard: "https://www.ok.gov/oab/Verify_a_License/" },
  OR: { name: "Oregon", lawyerSearch: "https://www.osbar.org/public/", cpaBoard: "https://www.oregon.gov/boa/Pages/Verify-a-License.aspx" },
  PA: { name: "Pennsylvania", lawyerSearch: "https://www.pabar.org/public/lfn/default.asp", cpaBoard: "https://www.pals.pa.gov/#/page/search" },
  RI: { name: "Rhode Island", lawyerSearch: "https://www.ribar.com/for-the-public/find-a-lawyer/", cpaBoard: "https://www.ri.gov/cgi-bin/dba/dbss/licensee_search.cgi" },
  SC: { name: "South Carolina", lawyerSearch: "https://www.scbar.org/public/find-a-lawyer/", cpaBoard: "https://verify.llronline.com/LicLookup/Accountancy/Accountancy.aspx" },
  SD: { name: "South Dakota", lawyerSearch: "https://www.statebarofsouthdakota.com/page/find-lawyer", cpaBoard: "https://dlr.sd.gov/accountancy/verify.aspx" },
  TN: { name: "Tennessee", lawyerSearch: "https://www.tba.org/index.cfm?pg=find-a-lawyer", cpaBoard: "https://verify.tn.gov/" },
  TX: { name: "Texas", lawyerSearch: "https://www.texasbar.com/AM/Template.cfm?Section=Find_A_Lawyer", cpaBoard: "https://www.tsbpa.texas.gov/licensee-search/" },
  UT: { name: "Utah", lawyerSearch: "https://www.utahbar.org/public-services/find-a-lawyer/", cpaBoard: "https://secure.utah.gov/llv/search/index.html" },
  VT: { name: "Vermont", lawyerSearch: "https://www.vtbar.org/for-the-public/find-a-lawyer/", cpaBoard: "https://www.sec.state.vt.us/professional-regulation/verify-a-license.aspx" },
  VA: { name: "Virginia", lawyerSearch: "https://www.vsb.org/vlrs/", cpaBoard: "https://www.boa.virginia.gov/verification/" },
  WA: { name: "Washington", lawyerSearch: "https://www.wsba.org/for-the-public/find-legal-help", cpaBoard: "https://www.dol.wa.gov/business/accountancy/verify.html" },
  WV: { name: "West Virginia", lawyerSearch: "https://www.wvbar.org/for-the-public/find-a-lawyer/", cpaBoard: "https://www.wvboacc.org/verify" },
  WI: { name: "Wisconsin", lawyerSearch: "https://www.wisbar.org/forpublic/ineedalawyer/pages/in-need-of-a-lawyer.aspx", cpaBoard: "https://dsps.wi.gov/Credentialing/LicenseLookup.aspx" },
  WY: { name: "Wyoming", lawyerSearch: "https://www.wyomingbar.org/for-the-public/find-a-lawyer/", cpaBoard: "https://cpaboard.wyo.gov/verify-a-license/" },
  DC: { name: "Washington D.C.", lawyerSearch: "https://www.dcbar.org/for-the-public/find-a-lawyer", cpaBoard: "https://dcra.dc.gov/node/1461091" },
};

const STATES = Object.entries(STATE_BAR_LINKS).map(([code, data]) => ({
  code,
  name: data.name,
})).sort((a, b) => a.name.localeCompare(b.name));

export default function Professionals() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [searchType, setSearchType] = useState<"lawyer" | "cpa">("lawyer");

  const selectedStateData = selectedState ? STATE_BAR_LINKS[selectedState] : null;

  return (
    <div className="min-h-screen bg-background luxury-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 gold-shimmer">Find a Licensed Professional</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with verified attorneys and CPAs through official state licensing boards.
            All professionals are licensed and in good standing.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-5 w-5 text-green-500" />
            <span>Official State Bar Links</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-5 w-5 text-blue-500" />
            <span>License Verified</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-5 w-5 text-purple-500" />
            <span>All 50 States + D.C.</span>
          </div>
        </div>

        {/* Search Section */}
        <Card className="max-w-2xl mx-auto mb-12 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search by State
            </CardTitle>
            <CardDescription>
              Select your state to find licensed attorneys or CPAs through official channels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Professional Type */}
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant={searchType === "lawyer" ? "default" : "outline"}
                className="h-20 flex flex-col gap-2"
                onClick={() => setSearchType("lawyer")}
              >
                <Scale className="h-6 w-6" />
                <span>Find an Attorney</span>
              </Button>
              <Button
                variant={searchType === "cpa" ? "default" : "outline"}
                className="h-20 flex flex-col gap-2"
                onClick={() => setSearchType("cpa")}
              >
                <Calculator className="h-6 w-6" />
                <span>Find a CPA</span>
              </Button>
            </div>

            {/* State Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Select Your State</label>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a state..." />
                </SelectTrigger>
                <SelectContent>
                  {STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search Button */}
            {selectedStateData && (
              <div className="pt-4">
                <a
                  href={searchType === "lawyer" ? selectedStateData.lawyerSearch : selectedStateData.cpaBoard}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button className="w-full h-14 text-lg" size="lg">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Search {selectedStateData.name} {searchType === "lawyer" ? "State Bar" : "CPA Board"}
                  </Button>
                </a>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  You'll be redirected to the official {selectedStateData.name} {searchType === "lawyer" ? "State Bar Association" : "Board of Accountancy"} website
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Select Your State</h3>
                <p className="text-sm text-muted-foreground">
                  Choose from all 50 states plus Washington D.C.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Search Official Database</h3>
                <p className="text-sm text-muted-foreground">
                  Access the official state bar or CPA board directory
                </p>
              </CardContent>
            </Card>
            <Card className="bg-card/50 border-border/50 text-center">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Contact Directly</h3>
                <p className="text-sm text-muted-foreground">
                  Reach out to verified, licensed professionals
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Why Use Official Sources */}
        <Card className="max-w-4xl mx-auto mb-12 bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Why We Link to Official Sources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">✓ Always Current</h4>
                <p className="text-sm text-muted-foreground">
                  State bar databases are updated in real-time with license status, disciplinary actions, and contact information.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✓ Verified Credentials</h4>
                <p className="text-sm text-muted-foreground">
                  Every professional listed has been verified by their state licensing board.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✓ Complete Coverage</h4>
                <p className="text-sm text-muted-foreground">
                  Access every licensed attorney and CPA in your state, not just a curated list.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">✓ No Bias</h4>
                <p className="text-sm text-muted-foreground">
                  We don't accept payment for listings. You see all qualified professionals equally.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs text-muted-foreground">
            <strong>Disclaimer:</strong> Kaiden AI provides links to official state licensing boards for your convenience.
            We do not endorse any specific attorney or CPA. Always verify credentials and conduct your own due diligence
            before engaging any professional. Attorney-client relationships are formed directly with the attorney you choose.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/terms" className="hover:text-primary">Terms of Service</Link>
            <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
            <Link href="/dashboard" className="hover:text-primary">Dashboard</Link>
          </div>
          <p>© 2024 Kaiden AI by Syndica Solutions. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}
