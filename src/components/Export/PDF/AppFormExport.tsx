import { tableLayout, fonts } from './settings';
import { footerImage } from './footer-image';

const checkedSquare = { text: '', style: { font: 'Icons' } };
const emptySquare = { text: '', style: { font: 'Icons' } };

class AppFormExport {
  state: any;
  docDefinition: any;

  renderProperSquare = (table: string, row: number, item: string) =>
    this.state.DBState[table][row].includes(item) ? checkedSquare : emptySquare;

  constructor(state: any) {
    this.state = state;
    const companyProfile = {
      table: {
        widths: [120, '*'],
        body: [
          [
            'Applicant of report',
            { text: state.applicantName, fillColor: '#FFFF08' },
          ],
          ['Contact Person', { text: 'Vitaly Aliev', fillColor: '#FFFF08' }],
          [
            'Contact email',
            { text: 'vit@xmtextiles.com', fillColor: '#FFFF08' },
          ],
        ],
      },
      layout: 'basic',
    };

    const header = [
      {
        text: 'Fabric Test Application Form',
        style: {
          fontSize: 14,
          bold: true,
          alignment: 'center',
        },
      },
      {
        text: [
          { text: 'Company profile', fontSize: 11, bold: true },
          ' (Applicant information in report)',
        ],
        style: { alignment: 'center' },
      },
    ];

    const sampleInformation = {
      table: {
        widths: [120, 80, '*', 40, 40, 40],
        body: [
          // 1 row of header
          [
            {
              text: [
                { text: 'Sample Information', fontSize: 11, bold: true },
                { text: ' (Test sample information in report)' },
              ],
              colSpan: 6,
              style: { alignment: 'center' },
            },
            {},
            {},
            {},
            {},
            {},
          ],
          // 2 row of header
          [
            {
              text: [
                { text: '*Single Layer Fabric', fontSize: 11, bold: true },
                {
                  text:
                    ' (Please note that the sentence of sample Ref. can`t include composition/ weight/ color information)',
                  color: 'red',
                },
              ],
              colSpan: 6,
              style: { alignment: 'center' },
            },
            {},
            {},
            {},
            {},
            {},
          ],

          [
            'Fabric ref.',
            { text: state.article, colSpan: 5, fillColor: '#FFFF08' },
            {},
            {},
            {},
            {},
          ],
          [
            'Composition and percentage',
            { text: state.product, colSpan: 5, fillColor: '#FFFF08' },
            {},
            {},
            {},
            {},
          ],
          [
            'Weight',
            {
              text: state.product
                .slice(1 + state.product.lastIndexOf(','))
                .trim(),
              colSpan: 5,
              fillColor: '#FFFF08',
            },
            {},
            {},
            {},
            {},
          ],
          [
            'Color',
            { text: state.colour, colSpan: 5, fillColor: '#FFFF08' },
            {},
            {},
            {},
            {},
          ],
          [
            'Others (if any)',
            { text: state.partNumber || '', colSpan: 5, fillColor: '#FFFF08' },
            {},
            {},
            {},
            {},
          ],
          [
            {
              text: '*Multilayer Fabric (if any)',
              colSpan: 6,
              fontSize: 11,
              bold: true,
              alignment: 'center',
            },
            {},
            {},
            {},
            {},
            {},
          ],
          [
            'Number of material',
            'Ref.',
            'Composition & Percentage',
            'Weight',
            'Color',
            'Others',
          ],
          ['Layer 1', '', '', '', '', ''],
          ['Layer 2', '', '', '', '', ''],
          ['Others (if any)', '', '', '', '', ''],
        ],
      },
      layout: 'basic',
    };

    const testRequirement = {
      table: {
        widths: [120, 35, 35, 35, 35, 35, 35, 35, '*'],
        body: [
          // 1 row of header
          [
            {
              text: 'Test requirement',
              fontSize: 11,
              bold: true,
              colSpan: 9,
              alignment: 'center',
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
          // 2 row of header
          [
            {
              text: [
                {
                  text:
                    '*Test according to completed Standard Requirement (mandatory test included)',
                  fontSize: 11,
                  bold: true,
                },
                {
                  text:
                    ' - Please mark "V" in below □ to confirm your standardlized and optional requirement.',
                  bold: true,
                },
              ],
              colSpan: 9,
              fillColor: '#FFFF08',
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],

          [
            { text: 'Standard No.', alignment: 'center' },
            {
              text: 'Optional Test Item under Standard',
              colSpan: 7,
              alignment: 'center',
            },
            {},
            {},
            {},
            {},
            {},
            {},
            'Notice (if any)',
          ],
          [
            {
              text: [
                this.renderProperSquare('testRequirement', 0, 'EN 11611'),
                ' EN 11611',
              ],
            },
            {
              text: [
                this.renderProperSquare('testRequirement', 0, 'A1'),
                ' A1',
              ],
            },
            {
              text: [
                this.renderProperSquare('testRequirement', 0, 'A2'),
                ' A2',
              ],
            },
            { text: '', colSpan: 5 },
            {},
            {},
            {},
            {},
            '',
          ],
          [
            {
              text: [
                this.renderProperSquare('testRequirement', 1, 'EN 11612'),
                ' EN 11612',
              ],
            },
            {
              text: [
                this.renderProperSquare('testRequirement', 1, 'A1'),
                ' A1',
              ],
            },
            {
              text: [
                this.renderProperSquare('testRequirement', 1, 'A2'),
                ' A2',
              ],
            },
            {
              text: [this.renderProperSquare('testRequirement', 1, 'B'), ' B'],
            },
            {
              text: [this.renderProperSquare('testRequirement', 1, 'C'), ' C'],
            },
            {
              text: [this.renderProperSquare('testRequirement', 1, 'D'), ' D'],
            },
            {
              text: [this.renderProperSquare('testRequirement', 1, 'E'), ' E'],
            },
            {
              text: [this.renderProperSquare('testRequirement', 1, 'F'), ' F'],
            },
            '',
          ],
          [
            {
              text: [
                this.renderProperSquare('testRequirement', 2, 'EN 1149-5'),
                ' EN 1149-5',
              ],
            },
            {
              text: [
                this.renderProperSquare('testRequirement', 2, 'EN 1149-1'),
                ' EN 1149-1',
              ],
              colSpan: 2,
            },
            {},
            {
              text: [
                this.renderProperSquare('testRequirement', 2, 'EN 1149-3'),
                ' EN 1149-3',
              ],
              colSpan: 2,
            },
            {},
            { text: '', colSpan: 3 },
            {},
            {},
            '',
          ],
          [
            {
              text: [
                this.renderProperSquare('testRequirement', 3, 'EN 61482-1-2'),
                ' EN 61482-1-2',
              ],
            },
            {
              text: [
                this.renderProperSquare('testRequirement', 3, 'Class 1'),
                ' Class 1',
              ],
              colSpan: 2,
            },
            {},
            {
              text: [
                this.renderProperSquare('testRequirement', 3, 'Class 2'),
                ' Class 2',
              ],
              colSpan: 2,
            },
            {},
            { text: '', colSpan: 3 },
            {},
            {},
            '',
          ],
          [
            {
              text: [
                this.renderProperSquare('testRequirement', 4, 'EN 20471'),
                ' EN 20471',
              ],
            },
            {
              text: `According to Standard Mandotory Test Requirement`,
              colSpan: 7,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            '',
          ],
          [
            {
              text: [
                this.renderProperSquare('testRequirement', 5, 'EN 14116'),
                ' EN 14116',
              ],
            },
            {
              text: `According to Standard Mandotory Test Requirement`,
              colSpan: 7,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            '',
          ],
          [
            {
              text: [
                this.renderProperSquare('testRequirement', 6, 'EN 343'),
                ' EN 343',
              ],
            },
            {
              text: `According to Standard Mandotory Test Requirement`,
              colSpan: 7,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            '',
          ],
          [
            {
              text: [
                this.renderProperSquare(
                  'testRequirement',
                  7,
                  'Other Standard 1'
                ),
                ' Other Standard 1',
              ],
            },
            {
              text: state.DBState.testRequirement[7].includes(
                'Other Standard 1'
              )
                ? state.DBState.otherStandard1
                : 'According to Standard Mandotory Test Requirement',
              colSpan: 7,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            '',
          ],
          [
            {
              text: [
                this.renderProperSquare(
                  'testRequirement',
                  8,
                  'Other Standard 2'
                ),
                ' Other Standard 2',
              ],
            },
            {
              text: `According to Standard Mandotory Test Requirement`,
              colSpan: 7,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            '',
          ],
          [
            {
              text: [
                emptySquare,
                ' Separate report for each standard - If you need to separate report for you several standard test requirement.',
              ],
              colSpan: 9,
              fillColor: '#FFFF08',
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
          [
            {
              text:
                ' *Test according to single method (If any) - Please write down your requirement of test standard No./ Name in below space.',
              bold: true,
              fontSize: 9,
              colSpan: 9,
              fillColor: '#FFFF08',
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
          [
            { text: 'Test 1: ', width: 40 },
            { text: '', colSpan: 2 },
            {},
            'Test 2: ',
            { text: '', colSpan: 2 },
            {},
            'Test 3: ',
            { text: '', colSpan: 2 },
            {},
          ],
          [
            { text: 'Test 4: ', width: 40 },
            { text: '', colSpan: 2 },
            {},
            'Test 5: ',
            { text: '', colSpan: 2 },
            {},
            'Test 6: ',
            { text: '', colSpan: 2 },
            {},
          ],
          [
            'Others (if any)',
            { text: '', colSpan: 8 },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        ],
      },
      layout: 'basic',
    };

    const washPreTreatment = {
      table: {
        widths: [120, '*', 90, '*', '*', '*', '*', '*', '*'],
        body: [
          [
            {
              text: [
                'Wash Pre-treatment Requirement - Please mark down V in below ',
                emptySquare,
                ' for your wash requirement',
              ],
              colSpan: 9,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
          [
            { text: 'Wash Method', alignment: 'center' },
            { text: 'Cycles', alignment: 'center' },
            { text: 'Wash Temperature', alignment: 'center' },
            { text: 'Dry Method', colSpan: 6, alignment: 'center' },
            {},
            {},
            {},
            {},
            {},
          ],
          [
            'Domestic Wash(ISO 6330)',
            {
              text: state.DBState.cycles[0],
              fillColor: '#FFFF08',
              alignment: 'center',
            },
            {
              text: `${state.DBState.washTemp}C`,
              fillColor: '#FFFF08',
              alignment: 'center',
            },
            {
              text: [this.renderProperSquare('washPreTreatment', 0, 'A'), ' A'],
              fillColor: '#FFFF08',
            },
            {
              text: [this.renderProperSquare('washPreTreatment', 0, 'B'), ' B'],
              fillColor: '#FFFF08',
            },
            {
              text: [this.renderProperSquare('washPreTreatment', 0, 'C'), ' C'],
              fillColor: '#FFFF08',
            },
            {
              text: [this.renderProperSquare('washPreTreatment', 0, 'D'), ' D'],
              fillColor: '#FFFF08',
            },
            {
              text: [this.renderProperSquare('washPreTreatment', 0, 'E'), ' E'],
              fillColor: '#FFFF08',
            },
            {
              text: [this.renderProperSquare('washPreTreatment', 0, 'F'), ' F'],
              fillColor: '#FFFF08',
            },
          ],
          [
            'Industrial Wash (ISO 15797)',
            {
              text: state.DBState.cycles[1],
              fillColor: '#FFFF08',
              alignment: 'center',
            },
            { text: 'According to standard', alignment: 'center' },
            {
              text: [
                this.renderProperSquare('washPreTreatment', 1, 'Tumble Dry'),
                ' Tumble Dry',
              ],
              alignment: 'center',
              fillColor: '#FFFF08',
              colSpan: 3,
            },
            {},
            {},
            {
              text: [
                this.renderProperSquare('washPreTreatment', 1, 'Tunnel Dry'),
                ' Tunnel Dry',
              ],
              alignment: 'center',
              fillColor: '#FFFF08',
              colSpan: 3,
            },
            {},
            {},
          ],
          [
            'Others (if any)',
            { text: '', fillColor: '#FFFF08' },
            '',
            { text: '', colSpan: 6 },
            {},
            {},
            {},
            {},
            {},
          ],
          [
            'Notice (if any)',
            { text: '', colSpan: 8 },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
          [
            {
              text:
                '*When wash according to EN ISO 6330 method, the usual Temperature will be 30/ 40/ 50/ 60/ 70/ 92°C; Dry Method - A: line dry/ B: drip line dry/ C: flat dry/ D: drip flat dry/ E: flat press/ F: tumbler dry. Please mention your requirement or any other °C/ Dry Requirement according to standard.',
              color: 'red',
              colSpan: 9,
              fontSize: 7,
            },
            {},
            {},
            {},
            {},
            {},
            {},
            {},
            {},
          ],
        ],
      },
      layout: 'basic',
    };

    const footer = [
      {
        columns: [
          {
            width: 350,
            text:
              'Please mark the "FACE side" on your fabric sample for our kind reference.',
            fillColor: '#FFFF08',
            margin: [0, 6],
            color: 'red',
          },
          {
            width: '*',
            text: 'Applicant: ____________________________',
            margin: [0, 6],
          },
        ],
      },
      {
        columns: [
          {
            width: 120,
            text: 'PI/ OFFER in: ',
            fillColor: '#FFFF08',
            color: 'red',
          },
          {
            width: '*',
            text: [
              this.renderProperSquare('footer', 0, 'EUR'),
              ' EUR /   ',
              this.renderProperSquare('footer', 0, 'USD'),
              '   USD /   ',
              this.renderProperSquare('footer', 0, 'RMB'),
              '   RMB',
            ],
          },
        ],
      },
      {
        columns: [
          {
            width: 120,
            text: 'Test Certificate: ',
            fillColor: '#FFFF08',
            color: 'red',
          },
          {
            width: '*',
            text: [
              this.renderProperSquare('footer', 1, 'NO'),
              ' NO   /   ',
              this.renderProperSquare('footer', 1, 'Required'),
              '   Required',
            ],
          },
        ],
      },
      {
        text: [
          'According to EA Resolution 2014(33)31, All the information of the test report is forbidden to make any change once be issued. So that it is ',
          { text: 'very important', color: 'red' },
          ' to confirm all your test / report information for your application and keep us informed if there are any change ',
          { text: 'before report issued', color: 'red' },
          '. If there are any more inquire or doubt, please feel free to contact ',
          {
            text: 'Simon - Email: simon@aitex.es / Mob.: +86 139 2953 3372',
            bold: true,
          },
        ],
        fontSize: 7,
        fillColor: '#FFFF08',
      },
      {
        width: 450,
        height: 40,
        alignment: 'center',
        image: footerImage,
      },
    ];

    this.docDefinition = {
      content: [
        header,
        companyProfile,
        { text: '', margin: [0, 0.5] },
        sampleInformation,
        { text: '', margin: [0, 0.5] },
        testRequirement,
        { text: '', margin: [0, 0.5] },
        washPreTreatment,
        { text: '', margin: [0, 0.5] },
        footer,
      ],
      info: {
        title: `Fabric Test Application Form_${state.serialNumber}_${state.article}.pdf`,
        author: 'XM Group',
      },
      defaultStyle: {
        fontSize: 9,
        font: 'Arial',
      },
      pageMargins: [30, 15] as [number, number],
    };
  }

  save = () =>
    this.create().then((pdf) =>
      pdf.download(
        `Fabric Test Application Form_${this.state.serialNumber}_${this.state.article}.pdf`
      )
    );

  create = () =>
    Promise.all([
      import('pdfmake/build/pdfmake'),
      import('./vfs_fonts.js'),
    ]).then(([pdfmake, vfs]: any) =>
      pdfmake.createPdf(this.docDefinition, tableLayout, fonts, vfs.vfs)
    );
}

export { AppFormExport };
