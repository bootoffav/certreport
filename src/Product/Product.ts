import { shortenTitle } from '../helpers';

type taskOfProduct = {
  id: string;
  title: string;
};

type ProductType = {
  article: string;
  standards: string[];
  brand: string;
  tasks: taskOfProduct[];
};

function Products(tasks: any[]) {
  // get unique products
  var products: ProductType[] = [];

  tasks.forEach((t) => {
    if (t.state && t.state.article) {
      let { article, standards, brand } = t.state;
      standards = standards.split(', ');

      // check for existence
      const indexOfProduct = products.findIndex(
        (product) => product.article === article
      );
      const taskWithConvertedTitle = {
        ...t,
        title: shortenTitle(t.title),
      };

      if (indexOfProduct > 0) {
        // exists
        products[indexOfProduct].standards = Array.from(
          new Set([...products[indexOfProduct].standards, ...standards])
        );
        products[indexOfProduct].tasks.push(taskWithConvertedTitle);
      } else {
        // not exist
        products.push({
          article,
          standards,
          brand,
          tasks: [taskWithConvertedTitle],
        });
      }
    }
  });

  return { tasks, products };
}

export { Products };
export type { ProductType, taskOfProduct };
