import { useState } from 'react';
import { Grid, Table, Icon } from 'tabler-react';
import { ClientStorage } from '../../ClientStorage/ClientStorage';
import { ProductType } from '../../Product/Product';
import { taskPropMap } from '../../Task/Task';

interface IArticleProps {
  article: string;
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

function ArticleInCertifications({ article }: IArticleProps) {
  const [tasks, setTasks] = useState([]);

  ClientStorage.getSpecificProduct(article, 'products').then(
    ({ tasks }: ProductType) => {
      // @ts-ignore
      setTasks(tasks);
    }
  );

  const parameters = [
    'pretreatment1',
    'standards',
    'product',
    'code',
    'price',
    'stage',
    'resume',
  ];

  return (
    <>
      <Grid.Row>
        <Grid.Col width="12">
          <p className="text-center">
            <h3>{article} in certifications</h3>
          </p>
        </Grid.Col>
      </Grid.Row>
      <Grid.Row className="mt-2">
        <Grid.Col offset="2" width="8">
          <Table>
            <Table.Header>
              <Table.ColHeader>
                <h5>Parameter</h5>
              </Table.ColHeader>
              {tasks.map((task: any, index: number) => (
                <Table.ColHeader key={index}>
                  <a href={`/edit/${task.id}`}>
                    <h5>{task.title}</h5>
                  </a>
                </Table.ColHeader>
              ))}
            </Table.Header>
            <Table.Body>
              {parameters.map((param) => (
                <Table.Row>
                  <Table.Col>{getLabelForParam(param)}</Table.Col>
                  {tasks.map((task: any, index: number) => (
                    <Table.Col key={index}>
                      {formatOutput(task, param)}
                    </Table.Col>
                  ))}
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </Grid.Col>
      </Grid.Row>
    </>
  );
}

function getLabelForParam(param: string) {
  const key = Object.keys(taskPropMap).find(
    (key) => taskPropMap[key] === param
  );
  return <h5>{key}</h5>;
}

function formatOutput(task: any, param: string): JSX.Element | string {
  switch (param) {
    case 'resume':
      return resume[task.state[param]];
    case 'price':
      return (+task.state.price || 0 + +task.state.price2 || 0).toLocaleString(
        'ru-RU',
        {
          style: 'currency',
          currency: 'EUR',
        }
      );
    default:
      return task.state[param] as string;
  }
}

export { ArticleInCertifications };
