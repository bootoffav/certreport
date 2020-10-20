import { shortenTitle } from '../helpers';

type ProductType = {
  article: string;
  standards: string[];
  brand: string;
  tasks: {
    id: string;
    title: string;
  }[];
}[];

function Products(tasks: any[]) {
  // get unique products
  var products: ProductType = [];

  tasks.forEach((t) => {
    if (t.state && t.state.article !== '') {
      let { article, standards, brand } = t.state;
      standards = standards.split(', ');

      // check for existence
      const indexOfProduct = products.findIndex(
        (product) => product.article === article
      );
      const convertedTitle = {
        ...t,
        title: shortenTitle(t.title),
      };

      if (indexOfProduct > 0) {
        // exists
        products[indexOfProduct].standards = Array.from(
          new Set([...products[indexOfProduct].standards, ...standards])
        );
        products[indexOfProduct].tasks.push(convertedTitle);
      } else {
        // not exist
        products.push({
          article,
          standards,
          brand,
          tasks: [convertedTitle],
        });
      }
    }
  });

  return { tasks, products };
}

export { Products };
