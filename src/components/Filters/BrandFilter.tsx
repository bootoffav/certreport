import React from 'react';

class BrandFilter extends React.Component<{
    tasks: any,
    update: any
}> {
    state: any;

    constructor(props: any) {
        super(props);
        this.state = {
            XMT: true,
            XMS: true,
            XMF: true,
            'No brand': false
        }
    }

    getActiveBrands() {
        let activeBrands: string[] =[];
        Object.keys(this.state).forEach((brand: any) => {
            if (this.state[brand]) activeBrands.push(brand);
        });
        return activeBrands;
    }

    handleChange = (e: any) => {
        e.stopPropagation();
        this.setState({
            [e.currentTarget.value]: e.currentTarget.checked
        }, () => this.props.update({ activeBrands: this.getActiveBrands() }));
    }

    render() {
        return (
            <div className="d-flex mt-1 align-items-center">
                <div className="btn-group" data-toggle="buttons">
                    <label className="btn btn-secondary" onClick={this.handleChange}>
                        <input
                            type="checkbox"
                            value="XMT"
                            checked={this.state.XMT}
                            onClick={this.handleChange}
                        /> XMT
                    </label>
                    <label className="btn btn-secondary" onClick={this.handleChange}>
                        <input
                            type="checkbox"
                            value="XMS"
                            checked={this.state.XMS}
                            onClick={this.handleChange}
                        /> XMS
                    </label>
                    <label className="btn btn-secondary">
                        <input
                            type="checkbox"
                            value="XMF"
                            checked={this.state.XMF}
                            onClick={this.handleChange}
                        /> XMF
                    </label>
                    <label className="btn btn-secondary">
                        <input
                            type="checkbox"
                            value="No brand"
                            checked={this.state['No brand']}
                            onClick={this.handleChange}
                        /> No brand
                    </label>
                </div>
            </div>);
    }
}

export default BrandFilter;