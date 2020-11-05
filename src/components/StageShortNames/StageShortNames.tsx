import React from 'react';
import { printStage } from '../../helpers';
import { Stage } from '../../Task/Task';

const StageShortNames = () => {
  const stages = Object.values(Stage)
    .filter((v) => typeof v === 'string')
    .map((stage) => printStage(stage as string, 'dropdown'));

  return (
    <>
      <p className="font-weight-bold">
        <sup>*</sup>Status values:
      </p>
      {stages.map((v, i) => (i + 1 === stages.length ? `${v}` : `${v} | `))}
    </>
  );
};

export { StageShortNames };
