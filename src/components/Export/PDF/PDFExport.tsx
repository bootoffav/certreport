import React from 'react';
import { tableLayout } from './layouts';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;


class PDFExport extends React.Component {
  companyProfile = {
    table: {
      widths: [100, '*'],
      body: [
        // @ts-ignore
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
        fontSize: 16,
        bold: true,
        alignment: 'center'
      },
    },
    {
      text: [
        { text: 'Company profile', fontSize: 11, bold: true },
        ' (Applicant information in report)'
      ],
      style: { alignment: 'center', margin: [10, 10, 10, 10] },
    }
  ];

  sampleInformation = {
    table: {
      widths: [100, 80, '*', 40, 40, 40],
      body: [
        // 1 row of header
        [
          {
            text: [
              { text: 'Sample Information', fontSize: 11, bold: true },
              ' (Test sample information in report)'
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
          // @ts-ignore
          { text: this.props.article, colSpan: 5, fillColor: '#FFFF08' },
          {}, {}, {}, {}],
        [
          'Composition and percentage',
          // @ts-ignore
          { text: this.props.product, colSpan: 5, fillColor: '#FFFF08' },
          {}, {}, {}, {}],
        [
          'Weight',
          {
            // @ts-ignore
            text: this.props.product.slice(1 + this.props.product.lastIndexOf(',')).trim(),
            colSpan: 5, fillColor: '#FFFF08'
          },
          {}, {}, {}, {}],
        [
          'Color',
          // @ts-ignore
          { text: this.props.colour, colSpan: 5, fillColor: '#FFFF08' },
          {}, {}, {}, {}],
        [
          'Others (if any)',
          { text: '',  colSpan: 5, fillColor: '#FFFF08' },
          {}, {}, {}, {}],
        // *Multilayer Fabric row
        [
          { text: '*Multilayer Fabric (if any)', colSpan: 6, fontSize: 11, bold: true, alignment: 'center' },
          {}, {}, {}, {}, {}],
        ['Number of material', 'Ref.', 'Composition & Percentage', 'Weight', 'Color', 'Others'],
        ['Layer 1', '', '', '', '', ''],
        ['Layer 2', '', '', '', '', ''],
        ['Others (if any)', '', '', '', '', ''],
      ],
    },
    layout: 'basic'
  };
  
  testRequirement = {
    table: {
      widths: [100, 40, 40, 40, 40, 40, 40, 40, '*'],
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
              { text: ' - Please mark "√" in below □ to confirm your standardlized and optional requirement.', bold: true }
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
          { text: `${String.fromCharCode(0x2B1C)} EN 11611`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} A1`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} A2`, alignment: 'center' },
          { text: '', colSpan: 5 }, {}, {}, {}, {},
          ''],
        [
          { text: `${String.fromCharCode(0x2B1C)} EN 11612`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} A1`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} A2`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} B`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} C`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} D`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} E`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} F`, alignment: 'center' },
          ''],
        [
          { text: `${String.fromCharCode(0x2B1C)} EN 1149-5`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} EN 1149-1`, colSpan: 2, alignment: 'center' }, {},
          { text: `${String.fromCharCode(0x2B1C)} EN 1149-3`, colSpan: 2, alignment: 'center' }, {},
          { text: '', colSpan: 3 }, {}, {},
          ''
        ],
        [
          { text: `${String.fromCharCode(0x2B1C)} EN 61482-1-2`, alignment: 'center' },
          { text: `${String.fromCharCode(0x2B1C)} Class1`, colSpan: 2, alignment: 'center' }, {},
          { text: `${String.fromCharCode(0x2B1C)} Class2`, colSpan: 2, alignment: 'center' }, {},
          { text: '', colSpan: 3 }, {}, {},
          ''
        ],
        [
          { text: `${String.fromCharCode(0x2B1C)} EN 20471`, alignment: 'center' },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          { text: `${String.fromCharCode(0x2B1C)} EN 14116`, alignment: 'center' },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          { text: `${String.fromCharCode(0x2B1C)} EN 343`, alignment: 'center' },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          { text: `${String.fromCharCode(0x2B1C)} Other Standard 1`, alignment: 'center' },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          { text: `${String.fromCharCode(0x2B1C)} Other Standard 2`, alignment: 'center' },
          { text: `According to Standard Mandotory Test Requirement`, colSpan: 7 }, {}, {}, {}, {}, {}, {},
          ''
        ],
        [
          {
            text: `${String.fromCharCode(0x2B1C)} Separate report for each standard - If you need to separate report for you several standard test requirement.`,
            colSpan: 9, fillColor: '#FFFF08'
          },
          {}, {}, {}, {}, {}, {}, {}, {}
        ],
        [
          {
            text: ` *Test according to single method (If any) - Please write down your requiremen of test standard No./ Name in below space.`,
            bold: true, fontSize: 9, colSpan: 9, fillColor: '#FFFF08'
          },
          {}, {}, {}, {}, {}, {}, {}, {}
        ]



        // [
        //   { text: '*Multilayer Fabric (if any)', colSpan: 6, fontSize: 11, bold: true, alignment: 'center' },
        //   {}, {}, {}, {}, {}],
        // ['Number of material', 'Ref.', 'Composition & Percentage', 'Weight', 'Color', 'Others'],
        // ['Layer 1', '', '', '', '', ''],
        // ['Layer 2', '', '', '', '', ''],
        // ['Others (if any)', '', '', '', '', ''],
      ],
    },
    layout: 'basic'
  };

  docDefinition = {
    content: [
      this.header,
      this.companyProfile,
      { text: '', margin: [0, 1] },
      this.sampleInformation,
      { text: '', margin: [0, 1] },
      this.testRequirement,
      { text: '', margin: [0, 1] },
    ],
    defaultStyle: {
     fontSize: 8
    }
  };

  save() {
    pdfMake.createPdf(this.docDefinition, tableLayout).open();
    // @ts-ignore
    // pdfMake.createPdf(this.docDefinition).download(`Fabric Test Application Form ${this.props.applicantName}`);
  }
}

export { PDFExport as default };