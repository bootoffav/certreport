import { Component } from 'react';

class BrandFilter extends Component<{
    tasks: any,
    update: any
}> {
    state: {
        [key: string]: boolean;
    } = {
        XMT: true,
        XMS: true,
        XMF: true,
        'No brand': false
    }

    getActiveBrands = () => Object.keys(this.state).filter(brand => this.state[brand]);

    handleChange = (e: any) => {
        e.stopPropagation();
        this.setState({
            [e.currentTarget.value]: e.currentTarget.checked
        }, () => this.props.update({ activeBrands: this.getActiveBrands() }));
    }

    render = () => (
        <div className="d-flex mt-1 align-items-center">
            <div className="btn-group pt-1" data-toggle="buttons">
                {Object.keys(this.state).map(brand =>
                    <label className="btn btn-secondary" key={brand}>
                        <input
                            type="checkbox"
                            value={brand}
                            defaultChecked={this.state[brand]}
                            onClick={this.handleChange}
                        /> {brand}
                    </label>)}
            </div>
        </div>);
}

export { BrandFilter };