type QuarterCheckboxesProps = {
  quarters: any;
  chart: 'stages' | 'products';
};
function QuarterCheckboxes({ quarters, chart }: QuarterCheckboxesProps) {
  return quarters.map((quarter: any) => {
    const quarterAsString = `Q${quarter.start.quarter()}-${quarter.start.format(
      'YY'
    )}`;

    return (
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="checkbox"
          id={quarterAsString + chart}
        />
        <label className="form-check-label" htmlFor={quarterAsString + chart}>
          {quarterAsString}
        </label>
      </div>
    );
  });
}

export { QuarterCheckboxes };
