import { Icon } from 'tabler-react';

interface StandardResultProps {
  standard: string;
  id: string;
  updateResult: any;
  result: string;
  reset: any;
}

function StandardResult({
  standard,
  id,
  result,
  updateResult,
  reset,
}: StandardResultProps) {
  return (
    <>
      <div className="ml-auto form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          checked={result === 'fail'}
          onChange={(e) => updateResult(e.target.value)}
          name={`radioOptions${id}`}
          data-standard={standard}
          id={`radioFail${id}`}
          value="fail"
        />
        <label className="form-check-label">
          <Icon prefix="fe" width="60" className="redIcon" name="thumbs-down" />
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          checked={result === 'pass'}
          onChange={(e) => updateResult(e.target.value)}
          name={`radioOptions${id}`}
          data-standard={standard}
          id={`radioPass${id}`}
          value="pass"
        />
        <label className="form-check-label">
          <Icon prefix="fe" width="60" className="greenIcon" name="thumbs-up" />
        </label>
      </div>
      <div className="form-check form-check-inline">
        <input
          className="form-check-input"
          type="radio"
          checked={result === 'partly'}
          onChange={(e) => updateResult(e.target.value)}
          name={`radioOptions${id}`}
          data-standard={standard}
          id={`radioPartly${id}`}
          value="partly"
        />
        <label className="form-check-label">
          <Icon
            prefix="fe"
            width="60"
            className="yellowIcon"
            name="alert-circle"
          />
        </label>
      </div>
      <button
        type="button"
        className="btn btn-sm btn-link btn-reset"
        data-standard={standard}
        onClick={reset}
      >
        Reset
      </button>
    </>
  );
}

export { StandardResult };
