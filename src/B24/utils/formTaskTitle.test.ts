import formTaskTitle from './formTaskTitle';
import { StateAdapter } from '../../StateAdapter';

const state = {
  standardsResult: {},
  DBState: {
    testRequirement: [[], [], [], [], [], [], [], [], []],
    washPreTreatment: [[], []],
    footer: [[], []],
    cycles: ['5', ''],
    washTemp: '60',
    otherStandard1: 'According to Standard Mandotory Test Requirement',
    otherStandard2: 'According to Standard Mandotory Test Requirement',
    EN469Detail: {
      '6.1 B.3.2 FR-New': 'fail',
    },
    EN469Result: {
      '6.1 B.3.2 FR-New': '993',
      '6.1 B.3.2 FR-Wash': '0.8',
      '6.5 B.3.1 Heat-New': '5',
    },
    standards: {
      'EN 469': {
        result: 'fail',
      },
    },
    EN20471Result: {
      '6.1 C-Xenon': '5',
      '6.1 R-New': '',
    },
  },
  attachedFiles: [
    {
      ATTACHMENT_ID: 2119794,
      NAME: 'Fabric Test Application Form_329_Etna (1).pdf',
      SIZE: '126395',
      FILE_ID: '3870586',
      DOWNLOAD_URL:
        '/bitrix/tools/disk/uf.php?attachedId=2119794&auth%5Baplogin%5D=460&auth%5Bap%5D=eqdb0krximpzkoov&action=download&ncc=1',
      VIEW_URL:
        '/bitrix/tools/disk/uf.php?attachedId=2119794&auth%5Baplogin%5D=460&auth%5Bap%5D=eqdb0krximpzkoov&action=show&ncc=1',
    },
    {
      ATTACHMENT_ID: 2119796,
      NAME: 'Shipping label_329_Etna_ (1).pdf',
      SIZE: '33143',
      FILE_ID: '3870588',
      DOWNLOAD_URL:
        '/bitrix/tools/disk/uf.php?attachedId=2119796&auth%5Baplogin%5D=460&auth%5Bap%5D=eqdb0krximpzkoov&action=download&ncc=1',
      VIEW_URL:
        '/bitrix/tools/disk/uf.php?attachedId=2119796&auth%5Baplogin%5D=460&auth%5Bap%5D=eqdb0krximpzkoov&action=show&ncc=1',
    },
  ],
  link: '[URL=certreport.xmtextiles.com/edit/79732/]this task[/URL]',
  paid: false,
  proforma: '',
  paid2: false,
  news: '',
  length: '12',
  stage: '5. Testing is started',
  testingTime: '21',
  width: '1.5',
  proformaReceivedDate: '',
  proformaReceivedDate2: '',
  pausedUntil: '',
  readyOn: '12Aug2021',
  sentOn: '13Aug2021',
  receivedOn: '24Aug2021',
  repeatReceivedOn: '',
  startedOn: '31Aug2021',
  repeatStartedOn: '',
  testFinishedOnPlanDate: '11Oct2021',
  repeatTestFinishedOnPlanDate: '',
  testFinishedOnRealDate: '',
  repeatTestFinishedOnRealDate: '',
  certReceivedOnPlanDate: '14Oct2021',
  repeatCertReceivedOnPlanDate: '',
  certReceivedOnRealDate: '',
  repeatCertReceivedOnRealDate: '',
  paymentDate1: '',
  paymentDate2: '',
  proformaReceived: '',
  proformaReceived2: '',
  proformaNumber: '',
  proformaNumber2: '',
  applicantName: 'SHANGHAI XM GROUP LTD',
  product: '99% Cotton, 1% Antistatic, FR-Satin 4/1, 350 gsm',
  code: '99C/1AS-350FR-S',
  article: 'Etna',
  colour: 'Royal Blue',
  partNumber: '329',
  rollNumber: '329',
  serialNumber: '329',
  materialNeeded: '12 lineal meters',
  standards: 'EN 11612, EN 469, EN 20471',
  testingCompany: 'Aitex (Spain)',
  brand: 'XMF',
  price1: '',
  price2: '',
  comments: '',
  testReport: '1',
  certificate: '',
  pretreatment1: '50x75C, ISO 15797',
  pretreatment1Result: '',
  pretreatment2: 'no',
  pretreatment3: 'no',
  otherTextInDescription: '',
  rem: '',
  quoteNo1: 'OF.21-',
  quoteNo2: 'OF.21-',
  proformaInvoiceNo1: 'FPRO.21-',
  proformaInvoiceNo2: 'FPRO.21-',
  payments: [],
  requestStatus: 1,
  totalPrice: 3078.69,
  ufCrmTask: ['C_8823', 'C_10035', 'CO_6295'],
  accomplices: ['3524'],
  existsInDB: true,
  activeQuoteNo: '',
};

const stAd = new StateAdapter(state);

const titleOnlyWash1 =
  '329_Aitex (Spain) - EN 11612, EN 469, EN 20471 (50x75C, ISO 15797) - Etna, Royal Blue (send 13Aug2021 - plan 11Oct2021) = 3 078,69 € | Testing is started - 31.08.2021 | NAD - 11.10.2021';

it('forms Task title properly', () => {
  // wash1 has value, pretreatment2 is undef
  const title = formTaskTitle(state, stAd);
  expect(title).toBe(titleOnlyWash1);

  // wash1 and pretreatment2 have values
  const stateWithPretreatment2 = {
    ...state,
    pretreatment2: '50xDryClean, ISO 3175',
  };
  const titleWithPretreatment2 =
    '329_Aitex (Spain) - EN 11612, EN 469, EN 20471 (50x75C, ISO 15797; 50xDryClean, ISO 3175) - Etna, Royal Blue (send 13Aug2021 - plan 11Oct2021) = 3 078,69 € | Testing is started - 31.08.2021 | NAD - 11.10.2021';
  expect(formTaskTitle(stateWithPretreatment2, stAd)).toBe(
    titleWithPretreatment2
  );

  // wash1 is undef
  const stateWash1Undef = {
    ...state,
    pretreatment1: undefined,
  };
  const titleWash1Undef =
    '329_Aitex (Spain) - EN 11612, EN 469, EN 20471 - Etna, Royal Blue (send 13Aug2021 - plan 11Oct2021) = 3 078,69 € | Testing is started - 31.08.2021 | NAD - 11.10.2021';
  expect(formTaskTitle(stateWash1Undef, stAd)).toBe(titleWash1Undef);
});
