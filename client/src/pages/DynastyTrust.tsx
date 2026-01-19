import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { AlertTriangle, CheckCircle2, ArrowRight, ArrowLeft, Crown, Shield, Building, Users, DollarSign, FileText, Scale, Info } from "lucide-react";

// Dynasty Trust favorable states
const DYNASTY_STATES = [
  { state: "South Dakota", perpetual: true, noStateTax: true, assetProtection: "Strong", rating: 5 },
  { state: "Nevada", perpetual: true, noStateTax: true, assetProtection: "Strong", rating: 5 },
  { state: "Delaware", perpetual: true, noStateTax: false, assetProtection: "Strong", rating: 4 },
  { state: "Alaska", perpetual: true, noStateTax: true, assetProtection: "Strong", rating: 4 },
  { state: "Wyoming", perpetual: true, noStateTax: true, assetProtection: "Moderate", rating: 4 },
  { state: "Tennessee", perpetual: false, noStateTax: true, assetProtection: "Moderate", rating: 3 },
  { state: "New Hampshire", perpetual: false, noStateTax: true, assetProtection: "Moderate", rating: 3 },
];

export default function DynastyTrust() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    // Step 1: Goals
    primaryGoal: "",
    estateValue: "",
    generations: "",
    // Step 2: Family
    hasSpouse: false,
    numChildren: "",
    numGrandchildren: "",
    // Step 3: Assets
    assetTypes: [] as string[],
    hasBusinessInterests: false,
    hasRealEstate: false,
    hasLifeInsurance: false,
    // Step 4: Concerns
    creditorProtection: false,
    divorceProtection: false,
    taxMinimization: false,
    spendthriftProtection: false,
    // Step 5: State Selection
    selectedState: "",
    // Step 6: Roles
    trusteeType: "",
    hasProtector: false,
  });

  const totalSteps = 7;
  const progress = ((step + 1) / totalSteps) * 100;

  const updateAssetTypes = (type: string, checked: boolean) => {
    if (checked) {
      setFormData({...formData, assetTypes: [...formData.assetTypes, type]});
    } else {
      setFormData({...formData, assetTypes: formData.assetTypes.filter(t => t !== type)});
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <Badge className="mb-4" variant="outline">
            <Crown className="h-3 w-3 mr-1" />
            Syndica Solutions Presents
          </Badge>
          <h1 className="text-3xl font-bold mb-2">The Southern Dynasty Trust</h1>
          <p className="text-muted-foreground">Interactive Workbook for Generational Wealth Planning</p>
        </div>

        {/* Legal Disclaimer */}
        <Card className="mb-6 border-amber-500/30 bg-amber-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-semibold text-amber-500 mb-2">Legal and Tax Disclaimer</p>
                <p className="text-muted-foreground mb-2">This workbook is provided for educational and informational purposes only. It is not intended to provide legal, tax, accounting, or financial advice, nor should it be relied upon as a substitute for professional consultation with qualified attorneys, certified public accountants, or financial advisors.</p>
                <p className="text-muted-foreground mb-2"><strong>You should not act or refrain from acting based solely on the information in this workbook.</strong> Before implementing any trust strategy, life insurance plan, or estate planning technique described herein, you must consult with:</p>
                <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
                  <li>A licensed attorney in your state who specializes in estate planning and trust law</li>
                  <li>A certified public accountant or tax professional familiar with gift, estate, and generation-skipping transfer taxes</li>
                  <li>A qualified insurance professional licensed to sell life insurance in your state</li>
                  <li>A corporate trustee or trust company authorized to provide fiduciary services</li>
                </ul>
                <p className="text-muted-foreground mt-2"><strong>NO ATTORNEY-CLIENT RELATIONSHIP:</strong> Use of this workbook does not create an attorney-client relationship between you and the author, publisher, or Syndica Solutions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>Step {step + 1} of {totalSteps}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step 0: Introduction */}
        {step === 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                What is a Dynasty Trust?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>A dynasty trust is a long-term or perpetual trust designed to hold and protect family wealth across multiple generations. Unlike traditional trusts that typically end after one or two generations, a dynasty trust can last for decades—or even indefinitely in states such as South Dakota.</p>
              
              <div className="grid md:grid-cols-3 gap-4 my-6">
                <Card className="bg-primary/5">
                  <CardContent className="pt-6 text-center">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Wealth Preservation</h4>
                    <p className="text-sm text-muted-foreground">Assets remain in trust, managed by a trustee, preventing heirs from quickly spending their inheritance.</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5">
                  <CardContent className="pt-6 text-center">
                    <DollarSign className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Tax Efficiency</h4>
                    <p className="text-sm text-muted-foreground">Minimize or avoid estate and gift taxes by applying the generation-skipping transfer (GST) tax exemption.</p>
                  </CardContent>
                </Card>
                <Card className="bg-primary/5">
                  <CardContent className="pt-6 text-center">
                    <Scale className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <h4 className="font-semibold">Asset Protection</h4>
                    <p className="text-sm text-muted-foreground">Shield assets from creditors, lawsuits, and divorce settlements of beneficiaries.</p>
                  </CardContent>
                </Card>
              </div>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="comparison">
                  <AccordionTrigger>Dynasty Trust vs. Traditional Trust</AccordionTrigger>
                  <AccordionContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2">Aspect</th>
                            <th className="text-left py-2">Dynasty Trust</th>
                            <th className="text-left py-2">Traditional Trust</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Duration</td>
                            <td className="py-2">Multiple generations or indefinitely</td>
                            <td className="py-2">Ends at beneficiary death or set term</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Tax Planning</td>
                            <td className="py-2">Uses lifetime gift and GST exemptions</td>
                            <td className="py-2">Limited estate tax benefits</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Control</td>
                            <td className="py-2">Strict terms preserve wealth</td>
                            <td className="py-2">More flexible, often distributes outright</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Estate Size</td>
                            <td className="py-2">Ideal for larger estates</td>
                            <td className="py-2">Suitable for smaller estates</td>
                          </tr>
                          <tr>
                            <td className="py-2 font-medium">Cost</td>
                            <td className="py-2">Higher (professional trustees)</td>
                            <td className="py-2">Generally simpler and less expensive</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Button onClick={() => setStep(1)} className="w-full mt-4">
                Begin Assessment <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Goals */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Define Your Goals</CardTitle>
              <CardDescription>Help us understand what you want to achieve with your estate plan.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>What is your primary goal?</Label>
                <Select value={formData.primaryGoal} onValueChange={(v) => setFormData({...formData, primaryGoal: v})}>
                  <SelectTrigger><SelectValue placeholder="Select primary goal" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wealth-transfer">Transfer wealth to future generations tax-efficiently</SelectItem>
                    <SelectItem value="asset-protection">Protect assets from creditors and lawsuits</SelectItem>
                    <SelectItem value="family-control">Maintain control over how wealth is used</SelectItem>
                    <SelectItem value="business-succession">Plan for business succession</SelectItem>
                    <SelectItem value="charitable">Combine family wealth with charitable giving</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Estimated total estate value</Label>
                <Select value={formData.estateValue} onValueChange={(v) => setFormData({...formData, estateValue: v})}>
                  <SelectTrigger><SelectValue placeholder="Select range" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="under-1m">Under $1 million</SelectItem>
                    <SelectItem value="1m-5m">$1 million - $5 million</SelectItem>
                    <SelectItem value="5m-13m">$5 million - $13 million</SelectItem>
                    <SelectItem value="13m-25m">$13 million - $25 million</SelectItem>
                    <SelectItem value="over-25m">Over $25 million</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">The 2024 federal estate tax exemption is $13.61 million per person.</p>
              </div>

              <div>
                <Label>How many generations do you want to plan for?</Label>
                <Select value={formData.generations} onValueChange={(v) => setFormData({...formData, generations: v})}>
                  <SelectTrigger><SelectValue placeholder="Select generations" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2">2 generations (children)</SelectItem>
                    <SelectItem value="3">3 generations (grandchildren)</SelectItem>
                    <SelectItem value="4+">4+ generations (great-grandchildren and beyond)</SelectItem>
                    <SelectItem value="perpetual">Perpetual (as long as legally allowed)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(0)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(2)} disabled={!formData.primaryGoal || !formData.estateValue}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Family Structure */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Step 2: Family Structure
              </CardTitle>
              <CardDescription>Tell us about your family to help structure beneficiary provisions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="spouse" 
                  checked={formData.hasSpouse}
                  onCheckedChange={(checked) => setFormData({...formData, hasSpouse: !!checked})}
                />
                <Label htmlFor="spouse">I have a spouse/partner to include in planning</Label>
              </div>

              <div>
                <Label>Number of children</Label>
                <Select value={formData.numChildren} onValueChange={(v) => setFormData({...formData, numChildren: v})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="2">2</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="4+">4 or more</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Number of grandchildren</Label>
                <Select value={formData.numGrandchildren} onValueChange={(v) => setFormData({...formData, numGrandchildren: v})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">None</SelectItem>
                    <SelectItem value="1-3">1-3</SelectItem>
                    <SelectItem value="4-6">4-6</SelectItem>
                    <SelectItem value="7+">7 or more</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(3)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Assets */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Step 3: Asset Types
              </CardTitle>
              <CardDescription>Select the types of assets you plan to transfer to the trust.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {[
                  { id: "cash", label: "Cash and Bank Accounts" },
                  { id: "stocks", label: "Stocks, Bonds, and Securities" },
                  { id: "realestate", label: "Real Estate Properties" },
                  { id: "business", label: "Business Interests / LLC Membership" },
                  { id: "lifeinsurance", label: "Life Insurance Policies" },
                  { id: "retirement", label: "Retirement Accounts (IRA, 401k)" },
                  { id: "collectibles", label: "Art, Collectibles, or Valuables" },
                  { id: "crypto", label: "Cryptocurrency / Digital Assets" },
                ].map(asset => (
                  <div key={asset.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={asset.id}
                      checked={formData.assetTypes.includes(asset.id)}
                      onCheckedChange={(checked) => updateAssetTypes(asset.id, !!checked)}
                    />
                    <Label htmlFor={asset.id}>{asset.label}</Label>
                  </div>
                ))}
              </div>

              {formData.assetTypes.includes("lifeinsurance") && (
                <div className="bg-primary/10 rounded-lg p-4 mt-4">
                  <h4 className="font-semibold mb-2">Consider an ILIT</h4>
                  <p className="text-sm text-muted-foreground">Life insurance can be held in an Irrevocable Life Insurance Trust (ILIT) paired with your dynasty trust. This keeps insurance proceeds out of your taxable estate while providing liquidity for estate taxes.</p>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(2)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(4)} disabled={formData.assetTypes.length === 0}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Protection Concerns */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Step 4: Protection Priorities
              </CardTitle>
              <CardDescription>Select the protections most important to you.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="creditor"
                    checked={formData.creditorProtection}
                    onCheckedChange={(checked) => setFormData({...formData, creditorProtection: !!checked})}
                  />
                  <Label htmlFor="creditor">Creditor Protection - Shield assets from lawsuits and creditors</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="divorce"
                    checked={formData.divorceProtection}
                    onCheckedChange={(checked) => setFormData({...formData, divorceProtection: !!checked})}
                  />
                  <Label htmlFor="divorce">Divorce Protection - Keep assets separate from marital property</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="tax"
                    checked={formData.taxMinimization}
                    onCheckedChange={(checked) => setFormData({...formData, taxMinimization: !!checked})}
                  />
                  <Label htmlFor="tax">Tax Minimization - Reduce estate, gift, and GST taxes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="spendthrift"
                    checked={formData.spendthriftProtection}
                    onCheckedChange={(checked) => setFormData({...formData, spendthriftProtection: !!checked})}
                  />
                  <Label htmlFor="spendthrift">Spendthrift Protection - Prevent heirs from wasting inheritance</Label>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(3)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(5)}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: State Selection */}
        {step === 5 && (
          <Card>
            <CardHeader>
              <CardTitle>Step 5: Choose a Trust Jurisdiction</CardTitle>
              <CardDescription>Some states offer more favorable laws for dynasty trusts. You can establish a trust in any state, regardless of where you live.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {DYNASTY_STATES.map(s => (
                  <div 
                    key={s.state}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${formData.selectedState === s.state ? 'border-primary bg-primary/5' : 'hover:border-primary/50'}`}
                    onClick={() => setFormData({...formData, selectedState: s.state})}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{s.state}</h4>
                        <div className="flex gap-2 mt-1">
                          {s.perpetual && <Badge variant="secondary">Perpetual</Badge>}
                          {s.noStateTax && <Badge variant="secondary">No State Tax</Badge>}
                          <Badge variant="outline">{s.assetProtection} Protection</Badge>
                        </div>
                      </div>
                      <div className="text-2xl">{"⭐".repeat(s.rating)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Why South Dakota?</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• <strong>Perpetual duration</strong> - No Rule Against Perpetuities</li>
                  <li>• <strong>No state taxes</strong> - No income, capital gains, estate, or inheritance tax</li>
                  <li>• <strong>Directed trusts</strong> - Separate investment and distribution control</li>
                  <li>• <strong>Strong asset protection</strong> - 2-year statute of limitations</li>
                  <li>• <strong>Privacy</strong> - Trust details remain confidential</li>
                </ul>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(4)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Button onClick={() => setStep(6)} disabled={!formData.selectedState}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Summary */}
        {step === 6 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Dynasty Trust Summary
              </CardTitle>
              <CardDescription>Review your selections and next steps.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">PRIMARY GOAL</h4>
                  <p className="capitalize">{formData.primaryGoal?.replace(/-/g, ' ')}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">ESTATE VALUE</h4>
                  <p className="capitalize">{formData.estateValue?.replace(/-/g, ' ')}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">GENERATIONS</h4>
                  <p>{formData.generations}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-muted-foreground">TRUST STATE</h4>
                  <p>{formData.selectedState}</p>
                </div>
              </div>

              <hr />

              <div>
                <h4 className="font-semibold mb-3">Recommended Next Steps</h4>
                <ol className="space-y-3">
                  {[
                    "Consult with an estate planning attorney licensed in your state",
                    "Work with a CPA to analyze tax implications and exemption usage",
                    "Select a corporate trustee in your chosen trust state",
                    "Consider whether to integrate an ILIT for life insurance",
                    "Draft and execute trust documents with legal counsel",
                    "Fund the trust with appropriate assets",
                    "File any required gift tax returns (Form 709)",
                  ].map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">{i + 1}</span>
                      <span className="text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground"><strong>Important:</strong> This summary is for educational purposes only. Dynasty trusts are complex legal instruments that require professional guidance. The information provided does not constitute legal or tax advice.</p>
              </div>

              <div className="flex gap-2 pt-4">
                <Button variant="outline" onClick={() => setStep(5)}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <Link href="/professionals">
                  <Button>Find Estate Planning Attorney <ArrowRight className="ml-2 h-4 w-4" /></Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 Syndica Solutions. All rights reserved.</p>
          <p className="mt-1">Based on "The Southern Dynasty - South Carolina Edition"</p>
        </div>
      </div>
    </div>
  );
}
