// import ExcelJS from "exceljs/dist/es5/exceljs.browser";
// import * as ExcelJs from 'exceljs/dist/exceljs';
import fileSaver from "file-saverjs";

// export default class ExcelExport {
//   constructor(data : any) {
//     const wb = new ExcelJS.Workbook();
//     const sh = wb.addWorksheet('My Sheet');
//     const productCharacteristicTableCellStructure = {
//       // value: `NAME OF APPLICANT: ${data.applicantName}`,
//       alignment: {
//         vertical: 'middle', horizontal: 'center'
//       },
//       font: {
//         name: 'Calibri',
//         size: 14
//       },
//       height: 10,
//       border: {
//         top: {style:'thin'},
//         left: {style:'thin'},
//         bottom: {style:'thin'},
//         right: {style:'thin'}
//       }
//     }

//     sh.mergeCells('A1:A4');
//     sh.getColumn('A').width = 2;
//     sh.getColumn('B').width = 60;
//     sh.mergeCells('B1:B2');
//     sh.mergeCells('B3:B4');
//     sh.mergeCells('C1:C4');
//     sh.mergeCells('D1:D4');
//     sh.mergeCells('E1:E4');
//     sh.mergeCells('F1:F4');
//     sh.mergeCells('G1:G4');
//     sh.mergeCells('H1:H4');
//     sh.mergeCells('I1:I4');
//     sh.getCell('A2').fill = {
//       type: 'pattern',
//       pattern:'solid',
//       fgColor:{argb:'FFFFFF00'},
//       bgColor:{argb:'FF0000FF'}
//   };

//     Object.assign({}, )
//     Object.assign(sh.getCell('A1'), { ...productCharacteristicTableCellStructure, value: '#', });
//     Object.assign(sh.getCell('B1'), { ...productCharacteristicTableCellStructure, value: `NAME OF APPLICANT: ${data.applicantName}`});
//     Object.assign(sh.getCell('B3'), { ...productCharacteristicTableCellStructure, value: 'Product'});
//     Object.assign(sh.getCell('B5'), { ...productCharacteristicTableCellStructure, value: data.product });
//     Object.assign(sh.getCell('C5'), { ...productCharacteristicTableCellStructure, value: data.code });
//     Object.assign(sh.getCell('D5'), { ...productCharacteristicTableCellStructure, value: data.article });
//     Object.assign(sh.getCell('E5'), { ...productCharacteristicTableCellStructure, value: data.color });
//     Object.assign(sh.getCell('F5'), { ...productCharacteristicTableCellStructure, value: data.length });
//     Object.assign(sh.getCell('G5'), { ...productCharacteristicTableCellStructure, value: data.width});
//     Object.assign(sh.getCell('H5'), { ...productCharacteristicTableCellStructure, value: data.partNumber });
//     Object.assign(sh.getCell('I5'), { ...productCharacteristicTableCellStructure, value: data.rollNumber });

//     // sh.getCell('A1').fill = {
//     //   type: 'pattern',
//     //   pattern: 'none',
//     //   fgColor:{
//     //     argb: 'ffff5500'
//     //   }
//   // };
//     // sh.getCell('A1').value = 'Hello, World!';
//     // sh.getCell('A2').value = 7;

//     wb.xlsx.writeBuffer()
//       .then(buffer => fileSaver(
//         new Blob([buffer], { type: "application/octet-stream" }),
//         `${data.serialNumber} - ${data.applicantName}.xlsx`)
//       );
//     }
  
// }
