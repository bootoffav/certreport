// total: ITotalQuarterSpent;

// total: {
//   start,
//   end,
//   amount: this.countTotalSpendings(quarters),
//   active: true,
// },

// countTotalSpendings = (quarters: any) => {
//   return Math.round(
//     Object.values(quarters).reduce(
//       (acc: number, quarter: any) => acc + quarter.spent,
//       0
//     )
//   );
// };

// const total = (
//   <Grid.Col width={3} key="total">
//     <Card>
//       <Card.Header>
//         <div className="form-check form-check-inline">
//           <input
//             className="form-check-input"
//             type="checkbox"
//             defaultChecked={this.state.total.active}
//             onChange={({ currentTarget }) => {
//               this.setState(
//                 {
//                   total: {
//                     ...this.state.total,
//                     active: currentTarget.checked,
//                   },
//                 },
//                 () => {
//                   this.props.updateQuarters({
//                     allDataInChartsVisible: currentTarget.checked,
//                   });
//                 }
//               );
//             }}
//           />
//         </div>
//         <div className="mx-auto quarterHeader">
//           {this.state.total.start} - {this.state.total.end}
//         </div>
//       </Card.Header>
//       <Card.Body>
//         <Header.H3 className="text-center">
//           <div>TOTAL: €{this.state.total.amount.toLocaleString()}</div>
//         </Header.H3>
//       </Card.Body>
//     </Card>
//   </Grid.Col>
// );

interface ITotalQuarterSpent {
  start: string;
  end: string;
  amount: number;
  active: boolean;
}

export {};
