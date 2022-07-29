// import CheckBox from './Checkbox';

// const WashPreTreatment = () => (
//   <table id="washPreTreatment" className="table table-sm table-bordered">
//     <thead className="text-center">
//       <tr>
//         <th colSpan={9}>
//           Wash Pre-treatment Requirement - Please mark down below for your wash
//           requirement
//         </th>
//       </tr>
//     </thead>
//     <tbody>
//       <tr className="text-center">
//         <td>Wash Method</td>
//         <td>Cycles</td>
//         <td>Wash Temperature &#8451;</td>
//         <td colSpan={6}>Dry Method</td>
//       </tr>
//       <tr>
//         <td>Domestic Wash(ISO 6330)</td>
//         <td>
//           <input
//             type="number"
//             className="form-control form-control-sm input-xs"
//             id="washPreTreatment_0_cycles"
//             // value={state.cycles[0]}
//             onChange={
//               ({ currentTarget: { value } }) => {}
//               //   props.updateParent({
//               //     ...state,
//               //     cycles: [value, state.cycles[1]],
//               //   })
//             }
//           />
//         </td>
//         <td>
//           <input
//             type="number"
//             className="form-control form-control-sm input-xs"
//             id="washPreTreatment_0_temperature"
//             // value={state.washTemp}
//             onChange={
//               ({ currentTarget: { value } }) => {}
//               //   // props.updateParent({
//               //   //   ...state,
//               //   //   washTemp: value,
//               //   // })
//             }
//           />
//         </td>

//         {['A', 'B', 'C', 'D', 'E', 'F'].map((item) => (
//           <td key={item}>
//             <CheckBox
//               table={'washPreTreatment'}
//               label={item}
//               // checked={state.washPreTreatment[0].includes(item)}
//               // onChange={() => toggleCheckboxState('washPreTreatment', 0, item)}
//             />
//           </td>
//         ))}
//       </tr>
//       <tr>
//         <td>Industrial Wash(ISO 15797)</td>
//         <td>
//           <input
//             type="number"
//             className="form-control form-control-sm input-xs"
//             id="washPreTreatment_1_cycles"
//             // value={state.cycles[1]}
//             onChange={
//               ({ currentTarget: { value } }) => {}
//               //   props.updateParent({
//               //     ...state,
//               //     cycles: [state.cycles[0], value],
//               //   })
//             }
//           />
//         </td>
//         <td>According to standard</td>
//         {['Tumble Dry', 'Tunnel Dry'].map((item) => (
//           <td colSpan={3} key={item}>
//             <CheckBox
//               table={'washPreTreatment'}
//               label={item}
//               // checked={state.washPreTreatment[1].includes(item)}
//               // onChange={() => toggleCheckboxState('washPreTreatment', 1, item)}
//             />
//           </td>
//         ))}
//       </tr>
//     </tbody>
//   </table>
// );

// export default WashPreTreatment;

export {};
