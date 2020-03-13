import React, { useContext } from 'react';
import { StatsCard, Header, Card } from 'tabler-react';
import { tasksInRange, StatCardsContext } from './Dashboard';


interface ICardProps {
  tasks: any[];
  startDate?: Date;
  endDate?: Date;
}

const CompletedCertifications = () => {
  const { tasks, startDate, endDate}: any = useContext(StatCardsContext);
  const completedCerts = () => {
    return tasksInRange(
      tasks,
      'certReceivedOnRealDate',
      startDate,
      endDate
    ).length;
  }

  const movement = () => {
    const totalCerts = tasksInRange(
      tasks,
      'certReceivedOnRealDate',
    ).length;

    return Math.round(completedCerts() * 100 / totalCerts);
  }

  return <StatsCard
    layout={1}
    movement={movement()}
    total={
      <div
        className="display-5"
        onClick={displayNone}
        >{completedCerts()}
      </div>
    }
    label="Completed certifications"
  />
}

const Products = () => {
  let { tasks, startDate, endDate}: any = useContext(StatCardsContext);

  const amountOfUniqueProducts = () => {
    tasks = startDate || endDate
      ? tasksInRange(tasks, 'CREATED_DATE', startDate, endDate)
      : tasks;
    
    return new Set(tasks.map(({ state: { article } }: any) => article)).size;
  }

  const movement = () => {
    const tasksBeforePeriod = tasksInRange(tasks, 'CREATED_DATE', new Date('December 17, 2010 03:24:00'), startDate).length;

    return Math.round(amountOfUniqueProducts() * 100 / tasksBeforePeriod);
  }

  return <StatsCard
    layout={1}
    movement={movement()}
    total={<div className="display-5">{amountOfUniqueProducts()}</div> }
    label="Products"
  />
}

const AmountOfCertifications = () => {
  const { tasks, startDate, endDate}: any = useContext(StatCardsContext);
  const amountOfOngoingCerts = () => tasksInRange(tasks, 'CREATED_DATE', startDate, endDate).length;

  const movement = () => {
    const tasksBeforePeriod = tasksInRange(tasks, 'CREATED_DATE', new Date('December 17, 2010 03:24:00'), startDate).length;
    return Math.round(amountOfOngoingCerts() * 100 / tasksBeforePeriod);
  }

  return <StatsCard
    layout={1}
    movement={movement()}
    total={
      <div
        className="display-5"
        onClick={displayNone}
      >{amountOfOngoingCerts()}</div>
    }
    label={`${startDate ? 'New' : 'All'} Certifications`}
  />
}

const displayNone = (e: any) => e.currentTarget.parentNode.parentNode.parentNode.style.display = 'none';

const AmountSpent = ({ spent }: any) => {
  // const { tasks, startDate, endDate}: any = useContext(StatCardsContext);
  // const spent = () => {
  //   let spent = 0;
  //   let t = startDate || endDate
  //     ? tasksInRange(tasks, 'CREATED_DATE', startDate, endDate)
  //     : tasks;
    
  //   t.forEach(({ state }: any) => {
  //     spent += +state.price;
  //   });

  //   return spent ? `€${Math.round(spent).toLocaleString()}` : 'could not count';
  // }

  return <div style={{ marginTop: '0.9em' }}>
      <Card
      body={<>
        <Header.H5 className="display-5 text-center"
          ><div
            onClick={displayNone}
      >€{spent.toLocaleString()}</div>
        </Header.H5>
        <div className="display-5 text-center"
        >Spent summary (default last 4 Quaters)</div>
        </>
      } />
    </div>
}

export { AmountOfCertifications, AmountSpent, CompletedCertifications, Products };