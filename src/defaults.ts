import * as B24 from './B24/B24';

const baseStages = [
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
] as const;

const repeatStages = [
  '10. Repeat Sample to be prepared',
  '11. Repeat Sample Sent',
  '12. Repeat Sample Arrived',
  '13. Repeat PI issued',
  '14. Repeat Payment done',
  '15. Repeat Testing is started',
  '16. Repeat Pre-Treatment done',
  '17. Repeat Test-report ready',
  '18. Repeat Certificate ready',
] as const;

const stages = [
  {
    label: 'Base stages',
    options: baseStages.map((stage) => ({ value: stage, label: stage })),
  },
  {
    label: 'Repeat testing stages',
    options: repeatStages.map((stage) => ({ value: stage, label: stage })),
  },
];

const testingCompanies = [
  'Aitex (China)',
  'Aitex (Spain)',
  'BTTG (UK)',
  'CENTROCOT (Italy)',
  'CSI-Serico (Italy)',
  'Leitat (Spain)',
  'RISE( Sweden)',
  'Satra (UK)',
  'UL (USA)',
  'VTEC (USA)',
] as const;

let selectOptions: {
  standards: any[];
  testingCompany: any[];
  articles: any[];
  brand: any[];
  stages: any[];
  [key: string]: any;
} = {
  brand: [
    { value: 'C_10033', label: 'XMT' },
    { value: 'C_10035', label: 'XMF' },
    { value: 'C_10037', label: 'XMS' },
    { value: 'C_10041', label: 'XMG' },
  ],
  testingCompany: testingCompanies.map((tc) => ({ value: tc, label: tc })),
  stages,
  standards: JSON.parse(localStorage.getItem('standards') || '[]'),
  articles: JSON.parse(localStorage.getItem('articles') || '[]'),
};

const XMBranchOptions = [
  'XM Europe (Vilnius)',
  'XM Romania',
  'XM Spain',
  'XM Poland',
  'XM Italy',
  'XM Hungary',
  'XM Kazakhstan',
  'XM Brazil',
  'XM USA',
] as const;

const standardParamMap = {
  'EN 469': ['6.1 B.3.2 FR-New', '6.1 B.3.2 FR-Wash', '6.5 B.3.1 Heat-New'],
  'EN 20471': [
    '6.1 C-New',
    '6.1 C-Xenon',
    '6.1 R-New',
    '6.2 R-Wash',
    '7.5.1 C-Wash',
    '7.5.2 R-Wash',
    '7.5.3 R-Dry',
  ],
} as const;

function initApp() {
  const saveAndApply = (data: any[], item: string) => {
    localStorage.setItem(item, JSON.stringify(data));
    selectOptions[item] = data;
  };

  B24.get_products().then((data) => saveAndApply(data, 'articles'));
  B24.get_standards().then((data) => saveAndApply(data, 'standards'));
}

export {
  selectOptions,
  standardParamMap,
  initApp,
  stages,
  XMBranchOptions,
  baseStages,
  repeatStages,
  testingCompanies,
};
