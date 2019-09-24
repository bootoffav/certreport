// @ts-ignore
import ExcelJS from "exceljs/dist/es5/exceljs.browser";
import fileSaver from "file-saverjs";
import { IState } from '../../defaults';

interface IExcelFabricTestForm {
  createWorksheet: () => void;
  renderHeader: () => void;
  renderCompanyProfile: () => void;
  renderSampleInformation: () => void;
  renderTestRequirement: () => void;
  renderPreTreatmentRequirement: () => void;
  renderFooter: () => void;
  renderGap: () => void;
  currentRow: number;
};

const bThin = { style: 'thin' };
const bThick = { style: 'thick' };
const centralAligns = {
  horizontal: 'center',
  vertical: 'middle'
};

export default class ExcelExport implements IExcelFabricTestForm {
  wb: any;
  sh: any;
  data: IState;
  currentRow = 1;

  constructor(data: any) {
    this.data = data;
    this.createWorksheet();
    this.renderHeader();
    this.renderCompanyProfile();
    this.renderGap();
    this.renderSampleInformation();
    this.renderGap();
    this.renderTestRequirement();
    this.renderGap();
    this.renderPreTreatmentRequirement();
    this.renderFooter();
  }

  createWorksheet() {
    this.wb = new ExcelJS.Workbook();
    this.sh = this.wb.addWorksheet('Fabric Test Application Form', {
      pageSetup: {
        paperSize: 9,
        orientation: 'landscape'
      }
    });
  }

  renderGap() {
    this.sh.getRow(this.currentRow++).height = 4;
  }

  renderHeader() {
    // 1 row
    this.sh.mergeCells('A1:I1');
    this.sh.getRow(this.currentRow).font = { name: 'Times New Roman', size: 16, bold: true };
    this.sh.getCell('A' + this.currentRow).alignment = centralAligns;
    for (let col of ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I']) {
      this.sh.getColumn(col).width = 25;
    }
    this.sh.getRow(this.currentRow).height = 25;
    this.sh.getCell('A' + this.currentRow).value = 'Fabric Test Application Form';
    this.currentRow++;

    // 2 row
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getRow(this.currentRow).font = { name: 'Times New Roman', size: 13, bold: true };
    this.sh.getCell('A' + this.currentRow).alignment = centralAligns;
    this.sh.getRow(this.currentRow).height = 20;
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        { font: { name: 'Times New Roman', size: 14, 'bold': true }, text: 'Company Profile' },
        { text: ' (Applicant information in report)' }
      ]
    };
    this.currentRow++;
  }

  renderCompanyProfile() {
    // 3 row
    this.sh.getCell('A' + this.currentRow).border = { top: bThick, left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Applicant of Report';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { top: bThick, right: bThick, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).value = this.data.applicantName;
    this.currentRow++;

    // 4 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Contact Person';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).value = 'Vitaly Aliev';
    this.currentRow++;

    // 5 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, bottom: bThick, right: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Contact email';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThick };
    this.sh.getCell('B' + this.currentRow).value = 'vit@xmtextiles.com';
    this.currentRow++;
  }

  renderSampleInformation() {
    // 1 row
    this.sh.getRow(this.currentRow).height = 20;
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('A' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('A' + this.currentRow).border = { top: bThick, left: bThick, right: bThick };
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        { font: { name: 'Times New Roman', size: 14, 'bold': true }, text: 'Sample Information' },
        { text: ' (Test sample infromation in report)' }
      ]
    };
    this.currentRow++;

    // 2 row
    this.sh.getRow(this.currentRow).height = 20;
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThick, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        { font: { name: 'Times New Roman', size: 14, 'bold': true }, text: '*Single Layer Fabric ' },
        {
          font: { name: 'Times New Roman', size: 14, 'color': {'argb': 'FFF61D1D'} },
          text: "(Please note that the sentence of Sample Ref. can't include composition/ weight/ color information)"
        },
      ]
    };
    this.currentRow++;

    // 3 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Fabric Ref.';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).value = this.data.article;
    this.currentRow++;

    // 4 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Composition and Percentage';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).value = this.data.product.slice(0, this.data.product.lastIndexOf(',')).trim();
    this.currentRow++;

    // 5 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Weight';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).value = this.data.product.slice(1 + this.data.product.lastIndexOf(',')).trim();
    this.currentRow++;

    // 6 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Color';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).value = this.data.colour;
    this.currentRow++;

    // 7 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Others (If any)';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).value = `Code: ${this.data.code}, Part number: ${this.data.partNumber}, Roll Number: ${this.data.partNumber}`;
    this.currentRow++;

    // 8 row
    this.sh.getRow(this.currentRow).height = 20;
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('A' + this.currentRow).border = { top: bThick, left: bThick, right: bThick, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        { font: { name: 'Times New Roman', size: 14, 'bold': true }, text: '*Multilayer Fabric (If any)' },
      ]
    };
    this.currentRow++;

    // 9 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Number of material';
    
    this.sh.getCell('B' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).value = 'Ref.';
    
    this.sh.mergeCells(`C${this.currentRow}:E${this.currentRow}`);
    this.sh.getCell('C' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('C' + this.currentRow).alignment = { horizontal: 'center' };
    this.sh.getCell('C' + this.currentRow).value = 'Composition & Percentage';
    
    this.sh.getCell('F' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('F' + this.currentRow).value = 'Weight';
    
    this.sh.getCell('G' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.getCell('G' + this.currentRow).value = 'Color';
    this.sh.mergeCells(`H${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('H' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('H' + this.currentRow).value = 'Others';
    this.currentRow++;

    //10 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Layer 1';
    this.sh.getCell('B' + this.currentRow).border = { right: bThin, bottom: bThin };
    
    this.sh.mergeCells(`C${this.currentRow}:E${this.currentRow}`);
    this.sh.getCell('C' + this.currentRow).border = { right: bThin, bottom: bThin };

    this.sh.getCell('F' + this.currentRow).border = { right: bThin, bottom: bThin };
    
    this.sh.getCell('G' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.mergeCells(`H${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('H' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.currentRow++;
    
    //11 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Layer 2';
    this.sh.getCell('B' + this.currentRow).border = { right: bThin, bottom: bThin };
    
    this.sh.mergeCells(`C${this.currentRow}:E${this.currentRow}`);
    this.sh.getCell('C' + this.currentRow).border = { right: bThin, bottom: bThin };

    this.sh.getCell('F' + this.currentRow).border = { right: bThin, bottom: bThin };
    
    this.sh.getCell('G' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.mergeCells(`H${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('H' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.currentRow++;
    
    //12 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThick };
    this.sh.getCell('A' + this.currentRow).value = 'Others (If any)';
    this.sh.getCell('B' + this.currentRow).border = { right: bThin, bottom: bThick };
    
    this.sh.mergeCells(`C${this.currentRow}:E${this.currentRow}`);
    this.sh.getCell('C' + this.currentRow).border = { right: bThin, bottom: bThick };

    this.sh.getCell('F' + this.currentRow).border = { right: bThin, bottom: bThick };
    
    this.sh.getCell('G' + this.currentRow).border = { right: bThin, bottom: bThick };
    this.sh.mergeCells(`H${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('H' + this.currentRow).border = { right: bThick, bottom: bThick };
    this.currentRow++;
  }

  renderTestRequirement() {
    // 1 row
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('A' + this.currentRow).height = 26;
    this.sh.getCell('A' + this.currentRow).border = { top: bThick, left: bThick, right: bThick };
    this.sh.getCell('A' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        { text: 'Test Requirement', font: { name: 'Times New Roman', size: 14, 'bold': true } }
      ]
    };
    this.currentRow++;

    // 2 row
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('A' + this.currentRow).border = { right: bThick, left: bThick, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        { text: '*Test according to completed Standard Requirement (mandatory test included) ', font: { name: 'Times New Roman', size: 14, 'bold': true } },
        { text: 'Please mark below to confirm your standard and optional requirement' }
      ]
    };
    this.currentRow++;

    // 3 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Standard No.';
    this.sh.mergeCells(`B${this.currentRow}:H${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.getCell('B' + this.currentRow).alignment = { horizontal: 'center' };
    this.sh.getCell('B' + this.currentRow).value = 'Optional Test Item under Standard';
    this.sh.getCell('I' + this.currentRow).border = { bottom: bThin, right: bThick };
    this.sh.getCell('I' + this.currentRow).value = 'Notice (if any)';
    this.currentRow++;

    // 4 row
    
    // for (let standard of this.data.standards.split(', ')) {
    //   this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    //   this.sh.getCell('A' + this.currentRow).value = standard;
    //   this.sh.mergeCells(`B${this.currentRow}:H${this.currentRow}`);
    //   this.sh.getCell('B' + this.currentRow).border = { bottom: bThin, right: bThin };
    //   this.sh.getCell('E' + this.currentRow).border = { bottom: bThin, right: bThick };
    //   this.currentRow++;
    // }

    // next rows after all Standards
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, bottom: bThin, right: bThick };
    this.sh.getCell('A' + this.currentRow).height = 20;
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        {
          font: { name: 'Times New Roman', size: 14, 'bold': true },
          text: '*Test according to single method (If nay) - Please write down your test requirement No./ Name in below space. (if any)'
        }
      ]
    };
    this.currentRow++;

    // next+1 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, bottom: bThin, right: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Test 1:';
    this.sh.getCell('B' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.getCell('C' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.getCell('C' + this.currentRow).value = 'Test 2:';
    this.sh.mergeCells(`D${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('D' + this.currentRow).border = { bottom: bThin, right: bThick };
    this.currentRow++;

    // next+2 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, bottom: bThin, right: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Test 3:';
    this.sh.getCell('B' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.getCell('C' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.getCell('C' + this.currentRow).value = 'Test 4:';
    this.sh.mergeCells(`D${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('D' + this.currentRow).border = { bottom: bThin, right: bThick };
    this.currentRow++;

    // next+3 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, bottom: bThin, right: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Test 5:';
    this.sh.getCell('B' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.getCell('C' + this.currentRow).border = { bottom: bThin, right: bThin };
    this.sh.getCell('C' + this.currentRow).value = 'Test 6:';
    this.sh.mergeCells(`D${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('D' + this.currentRow).border = { bottom: bThin, right: bThick };
    this.currentRow++;

    // next+4 row
    this.sh.getCell('A' + this.currentRow).border = { right: bThin, bottom: bThick, left: bThick };
    this.sh.getCell('A' + this.currentRow).value = 'Others (If any)';
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThick };
    this.sh.getCell('B' + this.currentRow).value = 'According to EN 11612';
    this.currentRow++;
   }

  renderPreTreatmentRequirement() {
    // 1 row
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('A' + this.currentRow).border = { top: bThick, left: bThick, right: bThick, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).height = 20;
    this.sh.getCell('A' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        {
          text: 'Wash Pre-treatment Requirement - Please mark down below for your wash requirement',
          font: { name: 'Times New Roman', size: 14, 'bold': true }
        }
      ]
    };
    this.currentRow++;

    // 2 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('A' + this.currentRow).value = 'Wash Method';
    
    this.sh.getCell('B' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('B' + this.currentRow).value = 'Cycles';
    
    this.sh.getCell('C' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('C' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('C' + this.currentRow).value = 'Wash Temperature';

    this.sh.mergeCells(`D${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('D' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('D' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('D' + this.currentRow).value = 'Dry Method';
    this.currentRow++;

    // 3 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Domestic Wash (ISO 6330)';

    this.sh.getCell('B' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('B' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('B' + this.currentRow).value = '5';

    this.sh.getCell('C' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('C' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('C' + this.currentRow).value = '40';

    this.sh.getCell('D' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('D' + this.currentRow).value = '                             A';
    
    this.sh.getCell('E' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('E' + this.currentRow).value = '                             B';
    
    this.sh.getCell('F' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('F' + this.currentRow).value = '                             C';
    
    this.sh.getCell('G' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('G' + this.currentRow).value = '                             D';
    
    this.sh.getCell('H' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('H' + this.currentRow).value = '                             E';
    
    this.sh.getCell('I' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('I' + this.currentRow).value = '                             F';
    this.currentRow++;

    // 4 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Industrial Wash (ISO 15797)';

    this.sh.getCell('B' + this.currentRow).border = { right: bThin, bottom: bThin };

    this.sh.getCell('C' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('C' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('C' + this.currentRow).value = 'According to standard';

    this.sh.mergeCells(`D${this.currentRow}:F${this.currentRow}`);
    this.sh.getCell('D' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('D' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('D' + this.currentRow).value = 'Tumble Dry';

    this.sh.mergeCells(`G${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('G' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.sh.getCell('G' + this.currentRow).alignment = centralAligns;
    this.sh.getCell('G' + this.currentRow).value = 'Tunnel Dry';
    this.currentRow++;

    // 5 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Others (If any)';

    this.sh.getCell('B' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.getCell('C' + this.currentRow).border = { right: bThin, bottom: bThin };
    this.sh.mergeCells(`D${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('D' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.currentRow++;

    // 6 row
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThin, bottom: bThin };
    this.sh.getCell('A' + this.currentRow).value = 'Notice (If any)';
    
    this.sh.mergeCells(`B${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('B' + this.currentRow).border = { right: bThick, bottom: bThin };
    this.currentRow++;

    // 7 row
    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('A' + this.currentRow).border = { left: bThick, right: bThick, bottom: bThick };
    this.sh.getCell('A' + this.currentRow).value = {
      'richText': [
        {
          font: { name: 'Times New Roman', size: 10},
          text: '*When wash according to EN ISO 6330 method, the usual Temperature will be 30/ 40/ 50/ 60/ 70/ 92C; Dry Method - A: line dry/  B: drip line dry/  C: flat dry/  D: drip flat dry/  E: flat press/  F: tumbler dry.  Please mention your requirement or any other requirement according to standard.'
        }
      ]
    }
    this.currentRow++;
  }

  renderFooter() {
    // 1 row
    this.sh.mergeCells(`A${this.currentRow}:E${this.currentRow}`);
    this.sh.getRow(this.currentRow).height = 30;
    this.sh.getCell('A' + this.currentRow).value = 'Please mark the "face" on your fabric sample for our kind reference.';
    
    this.sh.mergeCells(`F${this.currentRow}:I${this.currentRow}`);
    this.sh.getCell('F' + this.currentRow).value = 'Applicant: ________________';
    this.currentRow++;
    
    // 2 row
    this.sh.getRow(this.currentRow).height = 20;
    this.sh.getCell('A' + this.currentRow).value = 'PI/OFFER in: ';

    this.sh.getCell('B' + this.currentRow).value = '[ ]  EUR /';
    this.sh.getCell('C' + this.currentRow).value = '[ ]  USD /';
    this.sh.getCell('D' + this.currentRow).value = '[ ]  RMB ';
    this.currentRow++;

    // 3 row
    this.sh.getRow(this.currentRow).height = 20;
    this.sh.getCell('A' + this.currentRow).value = 'Test Certificate:     ';

    this.sh.getCell('B' + this.currentRow).value = '[ ]  NO /';
    this.sh.getCell('C' + this.currentRow).value = '[ ]  Required';
    this.currentRow++;

    this.sh.mergeCells(`A${this.currentRow}:I${this.currentRow}`);
    // eslint-disable-next-line
    this.sh.getCell('A' + this.currentRow).value = 'According to EA Resolution 2014(33)31, all the information of the test report is \
    forbidden to make any change once be issued. So that it is very important to confirm all your test/report information for your \
    application and keep us informed if there are any change before report issued. If there are any more inquire or doubt, please \
    feel free to contact Simon - Email: simon@aitex.es / Mob.: +86 139 2953 3372';
    this.currentRow++;
  }

  save() {
    this.wb.xlsx.writeBuffer()
      .then((buffer: any) => fileSaver(
        new Blob([buffer], { type: "application/octet-stream" }),
        `Fabric Test Application Form_${this.data.serialNumber}_${this.data.article}.xlsx`)
      );
    }
  
}
