import React from 'react';
import pdfMake from "pdfmake/build/pdfmake";
import { vfs } from './vfs_fonts.js';

import { tableLayout, fonts } from './settings';
import { footerImage } from './footer-image';
import { IState } from '../../../defaults';


const checkedSquare = { text: '', style: { font: 'Icons' } };
const emptySquare = { text: '', style: { font: 'Icons' } };


class AppFormExport extends React.Component<IState> {

  fabricAppForm = document.getElementById('FabricApplicationForm');

  // @ts-ignore
  renderProperSquare = (id: string) => this.fabricAppForm.querySelector(id).checked ? checkedSquare : emptySquare;
  
  companyProfile = {
    table: {
      widths: [120, '*'],
      body: [
        ['Applicant of report', { text: this.props.applicantName, fillColor: '#FFFF08' }],
        ['Contact Person', { text: 'Vitaly Aliev', fillColor: '#FFFF08' }],
        ['Contact email', { text: 'vit@xmtextiles.com', fillColor: '#FFFF08' }]
      ]
    },
    layout: 'basic'
  };

  header = [
    {
      text: 'Fabric Test Application Form',
      style: {
        fontSize: 14,
        bold: true,
        alignment: 'center'
      },
    },
    {
      text: [
        { text: 'Company profile', fontSize: 11, bold: true },
        ' (Applicant information in report)'
      ],
      style: { alignment: 'center' },
    }
  ];

  sampleInformation = {
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
            style: { alignment: 'center' }
          },
          {}, {}, {}, {}, {}
        ],
        // 2 row of header
        [
          {
            text: [
              { text: '*Single Layer Fabric', fontSize: 11, bold: true },
              { text: ' (Please note that the sentence of sample Ref. can`t include composition/ weight/ color information)', color: 'red' }
            ],
            colSpan: 6,
            style: { alignment: 'center' }
          },
          {}, {}, {}, {}, {}
        ],

        [
          'Fabric ref.',
          { text: this.props.article, colSpan: 5, fillColor: '#FFFF08' },
          {}, {}, {}, {}],
        [
          'Composition and percentage',
          { text: this.props.product, colSpan: 5, fillColor: '#FFFF08' },
          {}, {}, {}, {}],
        [
          'Weight',
          {
            text: this.props.product.slice(1 + this.props.product.lastIndexOf(',')).trim(),
            colSpan: 5, fillColor: '#FFFF08'
          },
          {}, {}, {}, {}],
        [
          'Color',
          { text: this.props.colour, colSpan: 5, fillColor: '#FFFF08' },
          {}, {}, {}, {}],
        [
          'Others (if any)',
          { text: this.props.partNumber || '', colSpan: 5, fillColor: '#FFFF08' },
          {}, {}, {}, {}],
        [
          { text: '*Multilayer Fabric (if any)', colSpan: 6, fontSize: 11, bold: true, alignment: 'center' },
          {}, {}, {}, {}, {}],
        ['Number of material', 'Ref.', 'Composition & Percentage', 'Weight', 'Color', 'Others'],
        ['Layer 1', '', '', '', '', ''],
        ['Layer 2', '', '', '', '', ''],
        ['Others (if any)', '', '', '', '', ''],
      ],
    },
    layout: 'basic',
  };
  
  testRequirement = {
    table: {
      widths: [120, 35, 35, 35, 35, 35, 35, 35, '*'],
      body: [
        // 1 row of header
        [
          { text: 'Test requirement', fontSize: 11, bold: true, colSpan: 9, alignment: 'center' },
          {}, {}, {}, {}, {}, {}, {}, {}
        ],
        // 2 row of header
        [
          {
            text: [
              { text: '*Test according to completed Standard Requirement (mandatory test included)', fontSize: 11, bold: true },
              { text: ' - Please mark "V" in below □ to confirm your standardlized and optional requirement.', bold: true }
            ],
            colSpan: 9, fillColor: '#FFFF08'
          },
          {}, {}, {}, {}, {}, {}, {}, {}
        ],

        [
          { text: 'Standard No.', alignment: 'center' },
          { text: 'Optional Test Item under Standard', colSpan: 7, alignment: 'center' },
          {}, {}, {}, {}, {}, {}, 'Notice (if any)'],
        [
          {
            text: [this.renderProperSquare('#testRequirement_EN-11611'), ' EN 11611']
          },
          {
            text: [this.renderProperSquare('#testRequirement_A1'), ' A1'] },
          { text: [this.renderProperSquare('#testRequirement_A2'), ' A2'] },
          { text: '', colSpan: 5 }, {}, {}, {}, {},
          ''],
        [
          { text: [this.renderProperSquare('#testRequirement_EN-11612'), ' EN 11612'] },
          { text: [this.renderProperSquare('#testRequirement_2_A1'), ' A1'] },
          { text: [this.renderProperSquare('#testRequirement_2_A2'), ' A2'] },
          { text: [this.renderProperSquare('#testRequirement_B'), ' B'] },
          { text: [this.renderProperSquare('#testRequirement_C'), ' C'] },
          { text: [this.renderProperSquare('#testRequirement_D'), ' D'] },
          { text: [this.renderProperSquare('#testRequirement_E'), ' E'] },
          { text: [this.renderProperSquare('#testRequirement_F'), ' F'] },
          ''],
        [
          { text: [this.renderProperSquare('#testRequirement_EN-1149-5'), ' EN 1149-5'] },
          { text: [this.renderProperSquare('#testRequirement_EN-1149-1'), ' EN 1149-1'], colSpan: 2}, {},
          { text: [this.renderProperSquare('#testRequirement_EN-1149-3'), ' EN 1149-3'], colSpan: 2 }, {},
          { text: '', colSpan: 3 }, {}, {},
          ''
        ],
        [
          { text: [this.renderProperSquare('#testRequirement_EN-61482-1-2'), ' EN 61482-1-2'] },
          { text: [this.renderProperSquare('#testRequirement_Class-1'), ' Class 1'], colSpan: 2 }, {},
          { text: [this.renderProperSquare('#testRequirement_Class-2'), ' Class 2'], colSpan: 2 }, {},
          { text: '', colSpan: 3 }, {}, {},
          ''
        ],
        [
          { text: [this.renderProperSquare('#testRequirement_EN-20471'), ' EN 20471'] },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          { text: [this.renderProperSquare('#testRequirement_EN-14116'), ' EN 14116'] },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          { text: [this.renderProperSquare('#testRequirement_EN-343'), ' EN 343'] },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          { text: [this.renderProperSquare('#testRequirement_Other-Standard-1'), ' Other Standard 1'] },
          {
            text: 
            // @ts-ignore
              (this.fabricAppForm.querySelector('#testRequirement_Other-Standard-1') as HTMLInputElement).checked
                ? (document.getElementById('testRequirement_Other-Standard-1-description') as HTMLInputElement).value
                : 'According to Standard Mandotory Test Requirement'
            , colSpan: 7
            }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          { text: [this.renderProperSquare('#testRequirement_Other-Standard-2'), ' Other Standard 2'] },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          {
            text: [emptySquare, ' Separate report for each standard - If you need to separate report for you several standard test requirement.'],
            colSpan: 9, fillColor: '#FFFF08'
          },
          {}, {}, {}, {}, {}, {}, {}, {}
        ],
        [
          {
            text: ' *Test according to single method (If any) - Please write down your requirement of test standard No./ Name in below space.',
            bold: true, fontSize: 9, colSpan: 9, fillColor: '#FFFF08'
          },
          {}, {}, {}, {}, {}, {}, {}, {}
        ],
        [
          { text: 'Test 1: ', width: 40 },
          { text: '', colSpan: 2 }, {},
          'Test 2: ',
          { text: '', colSpan: 2 }, {},
          'Test 3: ',
          { text: '', colSpan: 2 }, {}
        ],
        [
          { text: 'Test 4: ', width: 40 },
          { text: '', colSpan: 2 }, {},
          'Test 5: ',
          { text: '', colSpan: 2 }, {},
          'Test 6: ',
          { text: '', colSpan: 2 }, {}
        ],
        [
          'Others (if any)',
          { text: '', colSpan: 8 }, {}, {}, {}, {}, {}, {}, {}
        ]
      ],
    },
    layout: 'basic'
  };

  washPreTreatment = {
    table: {
      widths: [120, '*', 90, '*', '*', '*', '*', '*', '*'],
      body: [
        [{
          text: ['Wash Pre-treatment Requirement - Please mark down V in below ', emptySquare, ' for your wash requirement'],
          colSpan: 9
        }, {}, {}, {}, {}, {}, {}, {}, {}],
        [
          { text: 'Wash Method', alignment: 'center' },
          { text: 'Cycles', alignment: 'center' },
          { text: 'Wash Temperature', alignment: 'center' },
          { text: 'Dry Method', colSpan: 6, alignment: 'center' }, {}, {}, {}, {}, {}
        ],
        [
          'Domestic Wash(ISO 6330)',
          { text: (document.getElementById('washPreTreatment_0_cycles') as HTMLInputElement).value, fillColor: '#FFFF08', alignment: 'center' },
          { text: `${(document.getElementById('washPreTreatment_0_temperature') as HTMLInputElement).value}C`, fillColor: '#FFFF08', alignment: 'center' },
          { text: [this.renderProperSquare('#washPreTreatment_A'), ' A'], fillColor: '#FFFF08' },
          { text: [this.renderProperSquare('#washPreTreatment_B'), ' B'], fillColor: '#FFFF08' },
          { text: [this.renderProperSquare('#washPreTreatment_C'), ' C'], fillColor: '#FFFF08' },
          { text: [this.renderProperSquare('#washPreTreatment_D'), ' D'], fillColor: '#FFFF08' },
          { text: [this.renderProperSquare('#washPreTreatment_E'), ' E'], fillColor: '#FFFF08' },
          { text: [this.renderProperSquare('#washPreTreatment_F'), ' F'], fillColor: '#FFFF08' },
        ],
        [
          'Industrial Wash (ISO 15797)',
          { text: (document.getElementById('washPreTreatment_1_cycles') as HTMLInputElement).value, fillColor: '#FFFF08', alignment: 'center' },
          { text: 'According to standard', alignment: 'center' },
          {
            text: [this.renderProperSquare('#washPreTreatment_Tumble-Dry'), ' Tumble Dry'],
            alignment: 'center', fillColor: '#FFFF08', colSpan: 3
          }, {}, {},
          {
            text: [this.renderProperSquare('#washPreTreatment_Tunnel-Dry'), ' Tunnel Dry'],
            alignment: 'center', fillColor: '#FFFF08', colSpan: 3
          }, {}, {}
        ],
        [
          'Others (if any)',
          { text: '', fillColor: '#FFFF08' },
          '',
          { text: '', colSpan: 6 }, {}, {}, {}, {}, {}
        ],
        [
          'Notice (if any)',
          { text: '', colSpan: 8 }, {}, {}, {}, {}, {}, {}, {}
        ],
        [
          {
            text: '*When wash according to EN ISO 6330 method, the usual Temperature will be 30/ 40/ 50/ 60/ 70/ 92°C; Dry Method - A: line dry/ B: drip line dry/ C: flat dry/ D: drip flat dry/ E: flat press/ F: tumbler dry. Please mention your requirement or any other °C/ Dry Requirement according to standard.',
            color: 'red', colSpan: 9, fontSize: 7
          }, {}, {}, {}, {}, {}, {}, {}, {}
        ]
      ]
    },
    layout: 'basic'
  };

  footer = [
    {
      columns: [
        {
          width: 350,
          text: 'Please mark the "FACE side" on your fabric sample for our kind reference.',
          fillColor: '#FFFF08',
          margin: [0, 6],
          color: 'red'
        },
        {
          width: '*',
          text: 'Applicant: ____________________________',
          margin: [0, 6],
        }]
    },
    {
      columns: [
        {
          width: 120,
          text: 'PI/ OFFER in: ',
          fillColor: '#FFFF08',
          color: 'red'
        },
        {
          width: '*',
          text: [
            this.renderProperSquare('#footer_EUR'), ' EUR /   ',
            this.renderProperSquare('#footer_USD'), '   USD /   ',
            this.renderProperSquare('#footer_RMB'), '   RMB'
          ]
        }]
    }, {
      columns: [
        {
          width: 120,
          text: 'Test Certificate: ',
          fillColor: '#FFFF08',
          color: 'red'
        },
        {
          width: '*',
          text: [ this.renderProperSquare('#footer_NO'), ' NO   /   ', this.renderProperSquare('#footer_Required'), '   Required' ]
      }]
    }, {
      text: [
        'According to EA Resolution 2014(33)31, All the information of the test report is forbidden to make any change once be issued. So that it is ',
        { text: 'very important', color: 'red' },
        ' to confirm all your test / report information for your application and keep us informed if there are any change ',
        { text: 'before report issued', color: 'red' },
        '. If there are any more inquire or doubt, please feel free to contact ',
        { text: 'Simon - Email: simon@aitex.es / Mob.: +86 139 2953 3372', bold: true }],
      fontSize: 7, fillColor: '#FFFF08',
    }, {
      width: 450,
      height: 40,
      alignment: 'center',
      image: footerImage
    }
  ];

  docDefinition = {
    content: [
      this.header,
      this.companyProfile,
      { text: '', margin: [0, 0.5] },
      this.sampleInformation,
      { text: '', margin: [0, 0.5] },
      this.testRequirement,
      { text: '', margin: [0, 0.5] },
      this.washPreTreatment,
      { text: '', margin: [0, 0.5] },
      this.footer
    ],
    info: {
      title: `Fabric Test Application Form_${this.props.serialNumber}_${this.props.article}.pdf`,
      author: 'XM Group',
    },
    defaultStyle: {
      fontSize: 10,
      font: 'Arial',
    },
    pageMargins: [30, 15] as [number, number]
  };
  
  save() {
    this.create().download(`Fabric Test Application Form_${this.props.serialNumber}_${this.props.article}.pdf`);
  }

  create() {
    return pdfMake.createPdf(this.docDefinition, tableLayout, fonts, vfs);
  }
}

export { AppFormExport as default };