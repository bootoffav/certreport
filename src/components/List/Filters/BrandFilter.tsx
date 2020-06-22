import React from 'react';
import './Filters.css';

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
            'No brand': true
        }
    }
    
    filter(activeBrands: string[]) {
        return this.props.tasks.filter((task: any) => {
            if (task.state.brand === '') {
                //@ts-ignore
                if (activeBrands.includes('No brand')) return true;
            }
            // @ts-ignore
            return activeBrands.includes(task.state.brand);
        });
    }

    componentDidUpdate(prevProps: any, prevState: any, snapshot: any) {
        let activeBrands: any = [];
        if (prevState !== this.state) {
            Object.keys(this.state).forEach((brand: any) => {
                if (this.state[brand]) activeBrands.push(brand);
            });
            this.props.update({
                brandFiltered: this.filter(activeBrands)
            });
        }
    }
    
    handleChange = (e: any) => {
        this.setState({
            [e.currentTarget.value]: e.currentTarget.checked
        });
        e.stopPropagation();
    }

    render() {
        return (
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
            </div>);
    }
}

export default BrandFilter;