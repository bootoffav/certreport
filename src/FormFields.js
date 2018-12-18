import React from 'react';
import DatePicker from "react-datepicker";

const PickDate = props =>
  <div className="col">
    {props.label}
    <div className="form-group">
      <DatePicker className="form-control" required
        selected={
          props.date
          // ? props.date.toDate()
          ? new Date(props.date)
          : null
        }
        dateFormat="dd.MM.yyyy"
        onChange={props.handleChange}
      />
    </div>
  </div>

const BaseInput = props =>
  <div className={props.col || 'col'}>
    <div className="form-group">
      {props.label}
      <input required className="form-control"
        placeholder={props.placeholder} id={props.id} value={props.value} onChange={props.handleChange}/>
    </div>
  </div>

export { PickDate, BaseInput };