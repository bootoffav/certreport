import { printStage } from '../../helpers';
import { Stage } from '../../Task/Task';

const StageShortNames = () => {
  const stages = Object.values(Stage).filter((v) => typeof v === 'string');
  const values = stages.map((stage) => printStage(stage as string, 'dropdown'));

  return (
    <ul>
      <span className="font-weight-bold">
        <sup>*</sup>Status values:
      </span>
      {values.map((v) => (
        <li className="pl-2" style={{ listStyleType: 'none' }}>
          {v}
        </li>
      ))}
    </ul>
  );
};

export { StageShortNames };
