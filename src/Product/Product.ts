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
  tasks: {
    ID: string;
    TITLE: string;
    fullPrice: number;
  }[]
}[];


function Products(tasks: any[]) {
  // get unique products
  var products: Products = [];

  tasks.forEach(t => {
    if (t.state && t.state.article !== "") {
      let { article, standards, price, price2 } = t.state;
      standards = standards.split(', ');
      
      // check for existence
      const indexOfProduct = products.findIndex(product => product.article === article);
      const objToPush = {
        ID: t.ID,
        TITLE: t.TITLE.substring(0, t.TITLE.indexOf(' ')),
        fullPrice: Number(price) + Number(price2)
      };

      if (indexOfProduct > 0) {
        // exists
        products[indexOfProduct].standards = Array.from(new Set([...products[indexOfProduct].standards, ...standards]));
        products[indexOfProduct].tasks.push(objToPush);
      } else {
        // not exist
        products.push({
          article,
          standards,
          tasks: [objToPush]
        })
      }
    }
  });


  return { tasks, products };
}

export { Products };

            // if (products.hasOwnProperty(article)) {
      //   products[article].standards = Array.from(new Set([...products[article].standards, ...standards]));
      //   products[article].tasks.push({
      //     ID: t.ID,
      //     TITLE: t.TITLE.substring(0, t.TITLE.indexOf(' '))
      //   });
      // } else {
      //   products[article] = {
      //     standards, tasks: [{
      //       ID: t.ID,
      //       TITLE: t.TITLE.substring(0, t.TITLE.indexOf(' '))
      //     }]
      //   }
      // }
  // tasks.forEach(t => {
  //   if (t.state && t.state.article !== "") {
  //     let { article, standards } = t.state;
  //     standards = standards.split(', ');
  //     if (products.hasOwnProperty(article)) {
  //       products[article].standards = Array.from(new Set([...products[article].standards, ...standards]));
  //       products[article].tasks.push({
  //         ID: t.ID,
  //         TITLE: t.TITLE.substring(0, t.TITLE.indexOf(' '))
  //       });
  //     } else {
  //       products[article] = {
  //         standards, tasks: [{
  //           ID: t.ID,
  //           TITLE: t.TITLE.substring(0, t.TITLE.indexOf(' '))
  //         }]
  //       }
  //     }
  //   }
  // });


// type Products = {
//     [key: string]: {
//       standards: string[],
//       tasks: {
//         ID: string;
//         TITLE: string;
//       }[]
//     };
// };