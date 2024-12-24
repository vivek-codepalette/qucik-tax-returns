'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight, Plus, Upload, CheckCircle, FileText, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { SignatureCanvas } from '@/components/ui/signature-pad'


type FormStep = 'employment' | 'income' | 'details' | 'dob' | 'email' | 'refund' | 'address' | 'identity' | 'summary' | 'signature' | 'thankyou'

interface StepConfig {
  title: string
  description: string
  progress: number
}

interface AddressResult {
  thoroughfare: string
  postal_town: string
  postcode: string
  admin_county?: string
}

const STEPS: Record<FormStep, StepConfig> = {
  employment: {
    title: 'Your employment status',
    description: 'Tell us about your employment status when you received your PPI refund(s)',
    progress: 10
  },
  income: {
    title: 'Your income',
    description: 'Tell us about your income when you received your PPI refund(s)', 
    progress: 20
  },
  details: {
    title: 'Your Details',
    description: 'Complete your details to see if you\'re entitled to a refund for tax deducted from your compensation',
    progress: 30
  },
  dob: {
    title: 'Your date of birth',
    description: 'Please select your date of birth',
    progress: 40
  },
  email: {
    title: 'Your email address',
    description: 'Please enter your email address to complete your claim',
    progress: 50
  },
  refund: {
    title: 'Your PPI refund(s)',
    description: 'Select the year for each refund, then enter the total amount and tax deducted',
    progress: 60
  },
  address: {
    title: 'Home Address',
    description: 'Please enter your current address',
    progress: 70
  },
  identity: {
    title: 'Confirm your identity',
    description: 'Enter your National Insurance (NI) number to verify your identity',
    progress: 80
  },
  summary: {
    title: 'Summary',
    description: 'Please review your details below and provide your consent to submit your claim to HMRC',
    progress: 90
  },
  signature: {
    title: 'Your signature',
    description: 'Your signature will be applied to an R40 and 64-8 form and used to submit your claim to HMRC.',
    progress: 95
  },
  thankyou: {
    title: 'Thank you, Vivek!',
    description: 'We have received your claim information and will start processing it soon.',
    progress: 100
  }
}

interface FormData {
  employment: string
  income: string
  firstName: string
  lastName: string
  mobile: string
  privacyPolicy: boolean
  dobDay: string
  dobMonth: string
  dobYear: string
  email: string
  refunds: Array<{
    lender: string
    taxYear: string
    totalAmount: string
    taxDeduction: string
    files: File[]
  }>
  noMoreRefunds: boolean
  postcode: string
  address: string
  addressLine1: string
  addressLine2: string
  city: string
  county: string
  fullPostcode: string
  niNumber: string
  signature: string
}

const LENDERS = [
  'Barclays',
  'Halifax',
  'HSBC',
  'Lloyds',
  'Nationwide',
  'NatWest',
  'RBS',
  'Santander'
]

const TAX_YEARS = Array.from({ length: 10 }, (_, i) => {
  const year = new Date().getFullYear() - i
  return `${year - 1}/${year}`
})

export default function ClaimPage() {
  const [currentStep, setCurrentStep] = useState<FormStep>('employment')
  const [timeLeft, setTimeLeft] = useState(50)
  const [formData, setFormData] = useState<FormData>({
    employment: '',
    income: '',
    firstName: '',
    lastName: '',
    mobile: '',
    privacyPolicy: false,
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    email: '',
    refunds: [{
      lender: '',
      taxYear: '',
      totalAmount: '',
      taxDeduction: '',
      files: []
    }],
    noMoreRefunds: false,
    postcode: '',
    address: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    fullPostcode: '',
    niNumber: '',
    signature: ''
  })
  const [isEmailVerified] = useState(false)
  const [addressResults, setAddressResults] = useState<AddressResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isEmailVerified) {
      setCurrentStep('refund')
    }
  }, [isEmailVerified])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 'signature') {
      await submitClaim();
    } else if (currentStep === 'summary') {
      setCurrentStep('signature');
    } else if (currentStep === 'identity') {
      setCurrentStep('summary');
    } else if (currentStep === 'address') {
      setCurrentStep('identity');
    } else if (currentStep === 'refund') {
      setCurrentStep('address');
    } else if (currentStep === 'employment') {
      setCurrentStep('income');
    } else if (currentStep === 'income') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('dob');
    } else if (currentStep === 'dob') {
      setCurrentStep(isEmailVerified ? 'refund' : 'email');
    } else if (currentStep === 'email') {
      setCurrentStep('refund');
    }

    setTimeLeft(50);
    window.scrollTo(0, 0);
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 'employment':
        return !!formData.employment
      case 'income':
        return !!formData.income
      case 'details':
        return !!(
          formData.firstName &&
          formData.lastName &&
          formData.mobile &&
          formData.privacyPolicy
        )
      case 'dob':
        return !!(formData.dobDay && formData.dobMonth && formData.dobYear)
      case 'email':
        return !!formData.email && formData.email.includes('@')
      case 'refund':
        return formData.refunds.every(refund => 
          refund.lender && 
          refund.taxYear && 
          refund.totalAmount && 
          refund.taxDeduction
        ) || formData.noMoreRefunds
      case 'address':
        return !!(formData.address || (formData.addressLine1 && formData.fullPostcode))
      case 'identity':
        return !!formData.niNumber
      case 'signature':
        return true
      case 'summary':
        return formData.privacyPolicy
      default:
        return false
    }
  }

  const searchPostcode = async (postcode: string) => {
    setIsSearching(true)
    try {
      const response = await fetch(`/api/postcode?postcode=${encodeURIComponent(postcode)}`)
      const data = await response.json()
      
      if (data.result) {
        setAddressResults([data.result])
      }
    } catch (error) {
      console.error('Failed to search postcode:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const submitClaim = async () => {
    try {
      const payload = {
        employment: formData.employment,
        income: formData.income,
        firstName: formData.firstName,
        lastName: formData.lastName,
        mobile: formData.mobile,
        dateOfBirth: `${formData.dobDay}/${formData.dobMonth}/${formData.dobYear}`,
        email: formData.email,
        address: {
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          county: formData.county,
          postcode: formData.fullPostcode,
        },
        niNumber: formData.niNumber,
        refunds: formData.refunds.map(({ lender, taxYear, totalAmount, taxDeduction }) => ({
          lender,
          taxYear,
          totalAmount,
          taxDeduction
        })),
        signature: formData.signature,
        estimatedRefund: formData.refunds.reduce((total, refund) => 
          total + (parseFloat(refund.taxDeduction) || 0), 0
        )
      };

      const response = await fetch('/api/tax-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit claim');
      }

      setCurrentStep('thankyou');
    } catch (error) {
      console.error('Error submitting claim:', error);
      // Handle error (show error message to user)
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'employment':
        return (
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              What was your employment status?
            </Label>
            <RadioGroup
              value={formData.employment}
              onValueChange={(value) => setFormData({ ...formData, employment: value })}
              className="space-y-3"
            >
              {['Employed', 'Self employed', 'Unemployed', 'Retired'].map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label
                    htmlFor={option}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 'income':
        return (
          <div className="space-y-4">
            <Label className="text-base font-semibold">
              How much do you earn?
            </Label>
            <RadioGroup
              value={formData.income}
              onValueChange={(value) => setFormData({ ...formData, income: value })}
              className="space-y-3"
            >
              {[
                'Less than £12,570',
                '£12,571 to £50,270',
                '£50,271 to £150,000',
                'More than £150,000'
              ].map((option) => (
                <div
                  key={option}
                  className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <RadioGroupItem value={option} id={option} />
                  <Label
                    htmlFor={option}
                    className="flex-1 cursor-pointer text-base"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case 'details':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name(s)</Label>
                <Input
                  id="firstName"
                  placeholder="e.g. Joe"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="e.g. Bloggs"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile telephone number</Label>
              <Input
                id="mobile"
                placeholder="07123 456789"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
              />
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span>ℹ️</span>
                We need this so we can keep you updated on your claim by sms
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacy"
                checked={formData.privacyPolicy}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, privacyPolicy: checked as boolean })
                }
              />
              <Label
                htmlFor="privacy"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                By clicking continue, you confirm that you have read and agree to the{' '}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
              </Label>
            </div>
          </div>
        )

      case 'dob':
        return (
          <div className="space-y-6">
            <Label className="text-base font-semibold">Date of birth</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Select
                  value={formData.dobDay}
                  onValueChange={(value) => setFormData({ ...formData, dobDay: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Day</p>
              </div>
              <div className="space-y-2">
                <Select
                  value={formData.dobMonth}
                  onValueChange={(value) => setFormData({ ...formData, dobMonth: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      'January', 'February', 'March', 'April', 'May', 'June',
                      'July', 'August', 'September', 'October', 'November', 'December'
                    ].map((month, index) => (
                      <SelectItem key={month} value={(index + 1).toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Month</p>
              </div>
              <div className="space-y-2">
                <Select
                  value={formData.dobYear}
                  onValueChange={(value) => setFormData({ ...formData, dobYear: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from(
                      { length: 100 },
                      (_, i) => new Date().getFullYear() - i
                    ).map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">Year</p>
              </div>
            </div>
          </div>
        )

      case 'email':
        return isEmailVerified ? null : (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. joe.bloggs@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span>ℹ️</span>
                We&apos;ll send your claim details to this email address
              </p>
            </div>
          </div>
        )
      case 'refund':
        return (
          <div className="space-y-6">
            {formData.refunds.map((refund, index) => (
              <div key={index} className="space-y-6 p-6 border rounded-lg">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`lender-${index}`}>Select lender</Label>
                    <Select
                      value={refund.lender}
                      onValueChange={(value) => {
                        const updated = [...formData.refunds]
                        updated[index].lender = value
                        setFormData({ ...formData, refunds: updated })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {LENDERS.map(lender => (
                          <SelectItem key={lender} value={lender}>
                            {lender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`tax-year-${index}`}>Select tax year</Label>
                    <Select
                      value={refund.taxYear}
                      onValueChange={(value) => {
                        const updated = [...formData.refunds]
                        updated[index].taxYear = value
                        setFormData({ ...formData, refunds: updated })
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        {TAX_YEARS.map(year => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`amount-${index}`}>Total amount received</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">£</span>
                        <Input
                          id={`amount-${index}`}
                          className="pl-6"
                          value={refund.totalAmount}
                          onChange={(e) => {
                            const updated = [...formData.refunds]
                            updated[index].totalAmount = e.target.value
                            setFormData({ ...formData, refunds: updated })
                          }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`tax-${index}`}>Tax deduction</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">£</span>
                        <Input
                          id={`tax-${index}`}
                          className="pl-6"
                          value={refund.taxDeduction}
                          onChange={(e) => {
                            const updated = [...formData.refunds]
                            updated[index].taxDeduction = e.target.value
                            setFormData({ ...formData, refunds: updated })
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Offer Letter(s)</Label>
                    <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                      <input
                        type="file"
                        id={`files-${index}`}
                        className="hidden"
                        multiple
                        onChange={(e) => {
                          if (e.target.files) {
                            const updated = [...formData.refunds]
                            updated[index].files = Array.from(e.target.files)
                            setFormData({ ...formData, refunds: updated })
                          }
                        }}
                      />
                      <label
                        htmlFor={`files-${index}`}
                        className="cursor-pointer flex flex-col items-center gap-2"
                      >
                        <Upload className="h-6 w-6 text-gray-400" />
                        <span className="text-sm text-gray-600">Click to upload files</span>
                      </label>
                      {refund.files.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600">
                          {refund.files.length} file(s) selected
                        </div>
                      )}
                    </div>
                    <Link href="#" className="text-sm text-blue-600 hover:underline">
                      Don&apos;t have your offer letter?
                    </Link>
                  </div>
                </div>
              </div>
            ))}

            <div className="border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Continue on your phone</h3>
              <p className="text-sm text-gray-600 mb-4">
                For a fast and easy way to take the best photos scan the QR code. Your claim will automatically resume on your phone.
              </p>
              <div className="flex justify-between items-center">
                <Link href="#" className="text-sm text-blue-600 hover:underline">
                  Not working?
                </Link>
              </div>
            </div>

            {!formData.noMoreRefunds && (
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setFormData({
                    ...formData,
                    refunds: [
                      ...formData.refunds,
                      {
                        lender: '',
                        taxYear: '',
                        totalAmount: '',
                        taxDeduction: '',
                        files: []
                      }
                    ]
                  })
                }}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add another
              </Button>
            )}

            <div className="flex items-start space-x-2">
              <Checkbox
                id="no-more-refunds"
                checked={formData.noMoreRefunds}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, noMoreRefunds: checked as boolean })
                }
              />
              <Label
                htmlFor="no-more-refunds"
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I did not receive another refund
              </Label>
            </div>
          </div>
        )
      case 'address':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postcode">Postcode</Label>
                <div className="flex gap-2">
                  <Input
                    id="postcode"
                    placeholder="e.g. CH5 3UZ"
                    value={formData.postcode}
                    onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                    className="flex-1"
                  />
                  <Button 
                    type="button"
                    onClick={() => searchPostcode(formData.postcode)}
                    disabled={!formData.postcode || isSearching}
                    className="w-24"
                  >
                    Search
                  </Button>
                </div>
              </div>

              {addressResults.length > 0 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Select your address</Label>
                    <Select
                      value={formData.address}
                      onValueChange={(value) => {
                        const selected = addressResults.find(r => 
                          `${r.thoroughfare}, ${r.postal_town}, ${r.postcode}` === value
                        );
                        if (selected) {
                          setFormData({
                            ...formData,
                            address: value,
                            addressLine1: selected.thoroughfare || '',
                            city: selected.postal_town || '',
                            county: selected.admin_county || '',
                            fullPostcode: selected.postcode
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select your address..." />
                      </SelectTrigger>
                      <SelectContent>
                        {addressResults.map((result) => (
                          <SelectItem
                            key={result.postcode}
                            value={`${result.thoroughfare}, ${result.postal_town}, ${result.postcode}`}
                          >
                            {result.thoroughfare}, {result.postal_town}, {result.postcode}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Link
                    href="#"
                    className="text-sm text-blue-600 hover:underline"
                    onClick={(e) => {
                      e.preventDefault();
                      setAddressResults([]);
                    }}
                  >
                    enter your address manually instead
                  </Link>
                </div>
              )}

              {formData.address && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">Selected Address</h3>
                  <div className="space-y-1 text-sm">
                    <p>{formData.addressLine1}</p>
                    {formData.addressLine2 && <p>{formData.addressLine2}</p>}
                    <p>{formData.city}</p>
                    {formData.county && <p>{formData.county}</p>}
                    <p>{formData.fullPostcode}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )
      case 'identity':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="niNumber">National Insurance number</Label>
                <Input
                  id="niNumber"
                  placeholder="e.g. AB123456C"
                  value={formData.niNumber}
                  onChange={(e) => setFormData({ ...formData, niNumber: e.target.value.toUpperCase() })}
                  className="uppercase"
                />
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <span>ℹ️</span>
                  You can find your NI number on your payslip, P60, or any letters sent to you by HMRC relating to tax and benefits.
                </p>
              </div>
            </div>
          </div>
        )
      case 'summary':
        return (
          <div className="space-y-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3">
                <h2 className="font-semibold">Your details</h2>
              </div>
              <div className="divide-y">
                <div className="grid grid-cols-2 px-4 py-3">
                  <div className="text-gray-600 uppercase text-sm">Full name</div>
                  <div className="flex justify-between items-center">
                    <span>{formData.firstName} {formData.lastName}</span>
                    <Link href="#" onClick={() => setCurrentStep('details')} className="text-blue-600 text-sm">
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 px-4 py-3">
                  <div className="text-gray-600 uppercase text-sm">Date of birth</div>
                  <div className="flex justify-between items-center">
                    <span>{formData.dobDay}/{formData.dobMonth}/{formData.dobYear}</span>
                    <Link href="#" onClick={() => setCurrentStep('dob')} className="text-blue-600 text-sm">
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 px-4 py-3">
                  <div className="text-gray-600 uppercase text-sm">NI Number</div>
                  <div className="flex justify-between items-center">
                    <span>{formData.niNumber}</span>
                    <Link href="#" onClick={() => setCurrentStep('identity')} className="text-blue-600 text-sm">
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 px-4 py-3">
                  <div className="text-gray-600 uppercase text-sm">Phone</div>
                  <div className="flex justify-between items-center">
                    <span>{formData.mobile}</span>
                    <Link href="#" onClick={() => setCurrentStep('details')} className="text-blue-600 text-sm">
                      Edit
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-2 px-4 py-3">
                  <div className="text-gray-600 uppercase text-sm">Address</div>
                  <div className="flex justify-between items-center">
                    <span>{formData.addressLine1}, {formData.fullPostcode}</span>
                    <Link href="#" onClick={() => setCurrentStep('address')} className="text-blue-600 text-sm">
                      Edit
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-3">
                <h2 className="font-semibold">Your claim(s)</h2>
              </div>
              <div className="divide-y">
                {formData.refunds.map((refund, index) => (
                  <div key={index} className="px-4 py-3">
                    <div className="grid grid-cols-4 gap-4">
                      <div>
                        <div className="text-gray-600 uppercase text-sm">Lender</div>
                        <div>{refund.lender}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 uppercase text-sm">Year</div>
                        <div>{refund.taxYear}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 uppercase text-sm">Payout</div>
                        <div>£{refund.totalAmount}</div>
                      </div>
                      <div>
                        <div className="text-gray-600 uppercase text-sm">Tax</div>
                        <div>£{refund.taxDeduction}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="px-4 py-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => setCurrentStep('refund')}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add another
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="consent"
                  checked={formData.privacyPolicy}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, privacyPolicy: checked as boolean })
                  }
                />
                <Label
                  htmlFor="consent"
                  className="text-sm leading-normal"
                >
                  The information I&apos;ve provided is true and complete to the best of my knowledge. I understand I can submit my claim directly to HMRC for free, but I choose to authorise Quick Tax Claims Limited or its{' '}
                  <Link href="#" className="text-blue-600 hover:underline">
                    representatives
                  </Link>
                  {' '}as my nominee to request a recalculation of the entire tax year(s) and claim any outstanding rebates. If my claim is successful, a commission of 48% will be charged on all rebates. I have read and agree to the{' '}
                  <Link href="#" className="text-blue-600 hover:underline">
                    Terms of Engagement
                  </Link>
                  . You can cancel this agreement free of charge within the 14 day cooling off period.
                </Label>
              </div>
            </div>
          </div>
        )
      case 'signature':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Please draw your signature below</Label>
                <SignatureCanvas
                  onChange={(signature) => setFormData({ ...formData, signature })}
                  onClear={() => setFormData({ ...formData, signature: '' })}
                />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-500">
                    Please ensure your signature is accurate. You can start again by pressing &quot;Clear&quot;
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setFormData({ ...formData, signature: '' })}
                  >
                    Clear
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">What are you signing:</h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-2">
                    <span>•</span>
                    <p>
                      <span className="font-medium">64-8 Authorising Agent Form:</span> Allows HMRC to discuss and disclose information with us relating to your claim and tax records
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span>•</span>
                    <p>
                      <span className="font-medium">R40 claims a repayment of tax deducted from interest:</span> This is the claim form that will be submitted on your behalf and includes your appointment of nominee
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      case 'thankyou':
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-6 w-6" />
              <p>We have received your claim information and will start processing it soon.</p>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-2">Your refund could be</p>
                <p className="text-4xl font-bold">
                  £{formData.refunds.reduce((total, refund) => 
                    total + (parseFloat(refund.taxDeduction) || 0), 0
                  )}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">What happens next?</h3>
              <p className="text-gray-600">
                You will receive further updates about your claim through the contact details you
                have shared with us. All you have to do is sit back, relax, and wait until then.
              </p>
            </div>

            <div className="border rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="font-medium">Terms of Engagement</p>
                  <p className="text-sm text-gray-500">2 Pages • 89 KB • PDF</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        )
    }
  }

  const step = STEPS[currentStep]

  const handleBack = () => {
    if (currentStep === 'signature') {
      setCurrentStep('summary');
    } else if (currentStep === 'summary') {
      setCurrentStep('identity');
    } else if (currentStep === 'identity') {
      setCurrentStep('address');
    } else if (currentStep === 'address') {
      setCurrentStep('refund');
    } else if (currentStep === 'refund') {
      setCurrentStep(isEmailVerified ? 'dob' : 'email');
    } else if (currentStep === 'email') {
      setCurrentStep('dob');
    } else if (currentStep === 'dob') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('income');
    } else if (currentStep === 'income') {
      setCurrentStep('employment');
    }
    
    setTimeLeft(50);
    window.scrollTo(0, 0);
  }

  return (
    <>
      {/* Progress Bar */}
      <div className="h-2 bg-gray-200">
        <div 
          className="h-full bg-green-600 transition-all duration-500 ease-in-out" 
          style={{ width: `${step.progress}%` }}
        />
      </div>

      <main className="container flex-1 py-8 max-w-3xl">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              {step.title}
            </h1>
            <p className="text-gray-600">
              {step.description}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {renderStepContent()}

            {currentStep !== 'thankyou' && (
              <Button
                type="submit"
                disabled={!isStepValid()}
                className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg disabled:opacity-50"
              >
                <div className="flex-1">
                  {currentStep === 'signature' ? 'Submit' : 'Save and continue'}
                  <div className="text-sm font-normal">
                    {timeLeft} seconds remaining...
                  </div>
                </div>
                <ArrowRight className="ml-2" />
              </Button>
            )}
          </form>

          {currentStep !== 'employment' && currentStep !== 'thankyou' && (
            <Link
              href="#"
              onClick={handleBack}
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          )}
        </div>
      </main>
    </>
  )
}

