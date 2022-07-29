type DateFormatType = `${number}${string}` | '';

enum Stage {
  '00. Paused',
  '01. Canceled',
  '02. Estimate',
  '0. Sample to be prepared',
  '1. Sample Sent',
  '2. Sample Arrived',
  '3. PI Issued',
  '4. Payment Done',
  '5. Testing is started',
  '6. Pre-treatment done',
  '7. Test-report ready',
  '8. Certificate ready',
  '9. Ended',
  '10. Repeat Testing is started',
  '11. Repeat Test-report ready',
}

type FabricAppForm = {
  testRequirement: any[];
  washPreTreatment: any[];
  footer: ['EUR' | 'USD' | 'RMB'[], 'NO' | 'Required'[]];
  cycles: string[];
  washTemp: `${number}`;
  otherStandard1: string;
  otherStandard2: string;
  rem?: string;
  [key: string]: any;
};

interface TaskState {
  standardsResult: {
    [key: string]: 'pass' | 'fail';
  };
  attachedFiles: any;
  FabricAppForm: FabricAppForm;
  link: string;
  news: string;
  testingTime: string;
  serialNumber: string;
  applicantName: string;
  testingCompany: string;
  stage: Stage | string;
  standards: string;
  proforma: string;
  proformaReceivedDate: string;
  proformaNumber: string;
  proformaReceived2: string;
  proformaReceivedDate2: string;
  proformaNumber2: string;
  article: string;
  product: string;
  code: string;
  colour: string;
  testReport: string;
  certificate: string;
  materialNeeded: string;
  pretreatment1: string;
  pretreatment1Result: string;
  pretreatment2: string;
  pretreatment3: string;
  length: string;
  width: string;
  partNumber: string;
  rollNumber: string;
  brand: 'XMT' | 'XMS' | 'XMF' | 'XMG' | '';
  pausedUntil: DateFormatType;
  readyOn: DateFormatType;
  sentOn: DateFormatType;
  receivedOn: DateFormatType;
  startedOn: DateFormatType;
  testFinishedOnPlanDate: DateFormatType;
  testFinishedOnRealDate: DateFormatType;
  certReceivedOnPlanDate: DateFormatType;
  certReceivedOnRealDate: DateFormatType;
  factory: string;
  expirationDate: DateFormatType;
  comments: string;
  otherTextInDescription: string | null;
  resume: undefined | 'fail' | 'pass' | 'no sample' | 'partly';
  rem?: string;
  quoteNo1?: string;
  quoteNo2?: string;
  activeQuoteNo?: string;
  proformaInvoiceNo1?: string;
  proformaInvoiceNo2?: string;
  payments: Payment[];
  totalPrice?: string;
  [key: string]: any;
}

interface Payment {
  price: string;
  paid: boolean;
  paymentDate: string;
  quoteNo: string;
  proformaInvoiceNo: string;
  activeQuoteNo?: boolean;
  [key: string]: string | boolean | undefined;
}

export { Stage };
export type { TaskState, Payment, FabricAppForm };
