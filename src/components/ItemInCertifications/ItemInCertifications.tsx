import React from 'react';
import { useState, useEffect } from 'react';
import Loader from 'react-loader-spinner';
import { Grid, Icon } from 'tabler-react';
import { getItemAssociatedTasks } from 'B24/B24';
import { getTaskParamLabel } from 'Task/Task';
import './ItemInCertifications.css';
import { GoBackOrHomeButton } from '../NaviButton';
import { pullSpecificFiles } from '../FileManagement/FileManagement';
import CacheManager from 'CacheManager';
import { Items } from 'Item/Item';
import { getTaskTotalPriceHelper } from 'helpers';

interface IItemProps {
  item: string;
}

const resume: {
  [key: string]: any;
} = {
  pass: <Icon prefix="fe" width="60" className="greenIcon" name="thumbs-up" />,
  fail: <Icon prefix="fe" width="60" className="redIcon" name="thumbs-down" />,
  partly: (
    <Icon prefix="fe" width="60" className="yellowIcon" name="alert-circle" />
  ),
};

function ItemInCertifications({ item }: IItemProps) {
  item = decodeURIComponent(item);
  const [tasks, setTasks] = useState<any>([]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    getItemAssociatedTasks(item).then((tasks) => {
      const { items } = Items(tasks);
      setTasks(items[0].tasks);
      setIsUpdated(true);
      CacheManager.updateItem(items);
    });
  }, [item]);

  const parameters = [
    'pretreatment1',
    'standards',
    'price',
    'stage',
    'partNumber',
    'resume',
    'testReport',
    'certificate',
    'rem',
  ];

  return (
    <>
      <Grid.Col width="8" offset="2">
        <div className="d-flex justify-content-center">
          <span className="text-center text-uppercase item-name mr-2">
            {item} in certifications
          </span>
          {isUpdated ? (
            ''
          ) : (
            <Loader type="Oval" color="#5B7BE7" height={35} width={20} />
          )}
        </div>
      </Grid.Col>
      <Grid.Col width="8">
        <span className="itemsCommonParameters">
          <span className="font-weight-bold">Product: </span>
          {tasks.length ? tasks[0].state.product : ''}
        </span>
      </Grid.Col>
      <Grid.Col width="8" className="mb-1">
        <span className="itemsCommonParameters">
          <span className="font-weight-bold">Code:</span>{' '}
          {tasks.length ? tasks[0].state.code : ''}
        </span>
      </Grid.Col>
      <Grid.Col className="mt-2">
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th>Parameter</th>
              {tasks.map((task: any, index: number) => (
                <th key={index}>
                  <div className="d-flex justify-content-start">
                    <a href={`/edit/${task.id}`}>{task.title} </a>
                    &nbsp;|&nbsp;
                    <a
                      href={`${process.env.REACT_APP_B24_HOST}/company/personal/user/460/tasks/task/view/${task.id}/`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      B24
                    </a>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parameters.map((param) => (
              <tr key={param}>
                <td>{getTaskParamLabel(param)}</td>
                {tasks.map((task: any, index: number) => (
                  <td key={index}>
                    <div className="TD3Lines">{formatColumn(task, param)}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Grid.Col>
      <Grid.Col width="8" offset="2">
        <div className="d-flex justify-content-center mt-3">
          <GoBackOrHomeButton />
        </div>
      </Grid.Col>
    </>
  );
}

function formatColumn(task: any, param: string): any[] | string {
  switch (param) {
    case 'resume':
      return resume[task.state[param]];
    case 'testReport':
      const [, testReportFiles] = pullSpecificFiles(
        task.ufTaskWebdavFiles,
        'Test Report'
      );
      return testReportFiles.map((file) => (
        <div key={file.ATTACHMENT_ID}>
          <a href={`${process.env.REACT_APP_B24_HOST}${file.DOWNLOAD_URL}`}>
            {file.NAME}
          </a>
        </div>
      ));

    case 'certificate':
      const [, certificateFiles] = pullSpecificFiles(
        task.ufTaskWebdavFiles,
        'Certificate'
      );
      return certificateFiles.map((file) => (
        <div key={file.ATTACHMENT_ID}>
          <a href={`${process.env.REACT_APP_B24_HOST}${file.DOWNLOAD_URL}`}>
            {file.NAME}
          </a>
        </div>
      ));

    case 'price':
      return getTaskTotalPriceHelper(task.state).toLocaleString('ru-RU', {
        style: 'currency',
        currency: 'EUR',
      });
    default:
      return task.state[param];
  }
}

export { ItemInCertifications };
