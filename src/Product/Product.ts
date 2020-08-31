/*
  {
    "Aravis": {
      'standards': ['EN1', 'EN2'],
      'tasks': [{
        ID: '45032',
        TITLE: '262_Aitex'
      }]
    }
  }
*/

type Products = {
    article: string,
    standards: string[],
    brand: string,
    tasks: {
        ID: string;
        TITLE: string;
    }[]
}[];


function Products(tasks: any[]) {
  // get unique products
  var products: Products = [];

  tasks.forEach(t => {
      if (t.state && t.state.article !== "") {
      let { article, standards, brand } = t.state;
      standards = standards.split(', ');
      
      // check for existence
      const indexOfProduct = products.findIndex(product => product.article === article);
      const convertedTitle = {
        ...t,
        TITLE: t.TITLE.substring(0, t.TITLE.indexOf(' ')),
      };

      if (indexOfProduct > 0) {
        // exists
        products[indexOfProduct].standards = Array.from(new Set([...products[indexOfProduct].standards, ...standards]));
        products[indexOfProduct].tasks.push(convertedTitle);
      } else {
        // not exist
        products.push({
            article,
            standards,
            brand,
            tasks: [convertedTitle]
        })
      }
    }
  });


  return { tasks, products };
}

export { Products };