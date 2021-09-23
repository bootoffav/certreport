import qs from 'qs';
import { mainUrl, creatorId, webhookKey, step } from './B24';

function get_product(id = null) {
  if (id === null) {
    throw Error('Product id is not provided');
  }

  return fetch(`${mainUrl}/${creatorId}/${webhookKey}/crm.product.get?id=${id}`)
    .then((res) => res.json())
    .then((json) => json.result);
}

type SectionType = [string, string];

async function get_products() {
  const products: any = [];

  const productSections: SectionType[] = [
    ['8568', 'XMF'],
    ['8574', 'XMT'],
    ['8572', 'XMS'],
    ...(await getProductSectionsFromB2B()),
  ];
  debugger;
  let productsInSection: any[] = [];

  let start = 0;
  for (let [sectionId, brand] of productSections) {
    do {
      const { next, result } = await fetch(
        `${mainUrl}/${creatorId}/${webhookKey}/crm.product.list?` +
          qs.stringify({
            order: {
              NAME: 'ASC',
            },
            filter: {
              SECTION_ID: sectionId,
            },
            select: ['ID', 'NAME'],
            start,
          })
      )
        .then((res) => res.json())
        .then(step);
      start = next;
      productsInSection = productsInSection.concat(result);
    } while (start !== undefined);
    productsInSection = productsInSection.map((product) => ({
      value: product.ID,
      label: product.NAME,
    }));
    products.push({
      label: brand,
      options: [...productsInSection],
    });

    productsInSection.length = 0;
  }

  return products;
}

function getProductSectionsFromB2B(): Promise<SectionType[]> {
  return fetch(
    `${mainUrl}/${creatorId}/${webhookKey}/crm.productsection.list`,
    {
      method: 'post',
      body: qs.stringify({
        filter: { CATALOG_ID: 21 },
        select: ['ID', 'NAME', 'XML_ID'],
      }),
    }
  )
    .then((rsp) => rsp.json())
    .then(({ result }: any) => {
      return result
        .filter((section: { XML_ID: null | string }) => section.XML_ID)
        .map(({ ID, NAME }: { ID: string; NAME: string }) => [ID, NAME]);
    });
}

export { get_product, get_products };
