import B24 from './B24';
import * as Sentry from '@sentry/browser';

let selectOptions: {
    standards: any[];
    testingCompany: any[];
    articles: any[];
    brand: any[];
    stages: any[];
    [key: string]: any;
} = {
    brand: [
        { value: 'C_10033', label: 'XMT' },
        { value: 'C_10035', label: 'XMF' },
        { value: 'C_10037', label: 'XMS' },
        { value: 'C_10041', label: 'XMG' }
    ],
    testingCompany: [
        { value: 'Aitex (China)', label: 'Aitex (China)'},
        { value: 'Aitex (Spain)', label: 'Aitex (Spain)'},
        { value: 'BTTG (UK)', label: 'BTTG (UK)'},
        { value: 'CENTROCOT (Italy)', label: 'CENTROCOT (Italy)'},
        { value: 'CSI-Serico (Italy)', label: 'CSI-Serico (Italy)' },
        { value: 'Leitat (Spain)', label: 'Leitat (Spain)' },
        { value: 'Satra (UK)', label: 'Satra (UK)'}
    ],
    stages: [
        { value: '00. Paused', label: '00. Paused' },
        { value: '0. Sample to be prepared', label: '0. Sample to be prepared' },
        { value: '1. Sample Sent', label: '1. Sample Sent' },
        { value: '2. Sample Arrived', label: '2. Sample Arrived' },
        { value: '3. PI Issued', label: '3. PI Issued' },
        { value: '4. Payment Done', label: '4. Payment Done' },
        { value: '5. Testing is started', label: '5. Testing is started' },
        { value: '6. Pre-treatment done', label: '6. Pre-treatment done' },
        { value: '7. Test-report ready', label: '7. Test-report ready' },
        { value: '8. Certificate ready', label: '8. Certificate ready' },
        { value: '9. Ended', label: '9. Ended' }
    ],
    standards: JSON.parse(localStorage.getItem('standards') || '[]'),
    articles: JSON.parse(localStorage.getItem('articles') || '[]')
};

function initApp() {
    Sentry.init({ dsn: "https://09c5935753774acabba136bf59c9e31f@sentry.io/1796060" });
    const saveAndApply = (data: any[], item: string) => {
        localStorage.setItem(item, JSON.stringify(data));
        selectOptions[item] = data;
    }

    B24.get_products().then(data => saveAndApply(data, 'articles'));
    B24.get_standards().then(data => saveAndApply(data, 'standards'));
}

export { selectOptions, initApp };
