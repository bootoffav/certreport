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
                <div className="btn-group pt-1" data-toggle="buttons">
                    <label className="btn btn-secondary"
                        onClick={(e) => e.preventDefault()}
                    >
                        <input
                            type="checkbox"
                            value="XMT"
                            defaultChecked={this.state.XMT}
                            onClick={this.handleChange}
                            // onChange={this.handleChange}
                        /> XMT
                    </label>
                    <label className="btn btn-secondary">
                        <input
                            type="checkbox"
                            value="XMS"
                            defaultChecked={this.state.XMS}
                            onClick={this.handleChange}
                        /> XMS
                    </label>
                    <label className="btn btn-secondary"
                    >
                        <input
                            type="checkbox"
                            value="XMF"
                            defaultChecked={this.state.XMF}
                            onClick={this.handleChange}
                        /> XMF
                    </label>
                    <label className="btn btn-secondary">
                        <input
                            type="checkbox"
                            value="No brand"
                            defaultChecked={this.state['No brand']}
                            onClick={this.handleChange}
                        /> No brand
                    </label>
                </div>
            </div>);
    }
}

export default BrandFilter;