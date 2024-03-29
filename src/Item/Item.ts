import { shortenTitle } from '../helpers';

type taskOfItem = {
  id: string;
  title: string;
};

type ItemType = {
  article: string;
  standards: string[];
  brand: string;
  testingCompany: string;
  tasks: taskOfItem[];
};

function Items(tasks: any[]): ItemType[] {
  // get unique products
  const items: ItemType[] = [];

  tasks.forEach((t) => {
    if (t.state && t.state.article) {
      let { article, standards, brand, testingCompany } = t.state;
      standards = standards === '' ? [] : standards.split(', ');

      // check for existence
      const indexOfItem = items.findIndex((item) => item.article === article);
      const taskWithConvertedTitle = {
        ...t,
        title: shortenTitle(t.title),
      };

      if (indexOfItem === -1) {
        // not exist
        items.push({
          article,
          standards,
          brand,
          testingCompany,
          tasks: [taskWithConvertedTitle],
        });
      } else {
        // exists
        items[indexOfItem].standards = Array.from(
          new Set([...items[indexOfItem].standards, ...standards])
        );
        items[indexOfItem].tasks.push(taskWithConvertedTitle);
      }
    }
  });

  return items;
}

export default Items;
export type { ItemType, taskOfItem };
