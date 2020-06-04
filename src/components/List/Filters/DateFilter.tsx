import React, { useState } from 'react';
import DatePicker from "react-datepicker";
import './Filters.css';

function DateFilter(
    { update, tasks, filter, startDate, endDate }: {
        update?: any;
        tasks?: any;
        filter?: any;
        startDate?: Date;
        endDate?: Date;
    }) {

    filter = filter || function filter(startDate?: Date, endDate?: Date): void {
        let visibleData: any;
        if (!startDate || !endDate) {
            visibleData = tasks;
        } else {
            visibleData = tasks.filter((task: any) => {
                const comparingDate = new Date(task.state.certReceivedOnRealDate);
                return startDate < comparingDate && endDate > comparingDate
            });
        }

        update({
            startDate,
            endDate,
            visibleData,
            columnFilterValue: '',
            stage: 'All'
        });
    }

    return <div className="form-row" id="dateRange">
        <div className="d-flex align-items-center">
        <div className="text-uppercase">Date Filter:</div>
        </div>
        <div className="col">
        <DatePicker
            className="col form-control"
            selected={startDate}
            dateFormat="dd.MM.yyyy"
            selectsStart
            startDate={startDate}
            endDate={endDate}
            onChange={(date: Date) => filter(date, endDate)}
            placeholderText="from"
        />
        </div>
        <div className="col">
        <DatePicker
            className="col form-control"
            selected={endDate}
            dateFormat="dd.MM.yyyy"
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            onChange={(date: Date) => filter(startDate, date)}
            placeholderText="to"
            minDate={startDate}
        />
        </div>
    </div>
}

export default DateFilter;