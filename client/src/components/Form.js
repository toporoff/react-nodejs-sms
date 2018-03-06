import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class Form extends Component {
    state = {
        phone: '',
        over18: false,
        acceptTerms: false
    }

    constructor() {
        super();

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    validateForm() {
        return this.state.over18
            && this.state.acceptTerms
            && this.state.phone.trim();
    }

    showMessage(text = '', type = 'danger') {
        const container = document.getElementById('place-for-response');
        const html = <div className={`alert alert-${type}`} role="alert">
            {text ? text : 'Something bad has happened'}
        </div>;
        ReactDOM.render(html, container, () => {
            setTimeout(() => { ReactDOM.unmountComponentAtNode(container); }, 3000);
        });
    }

    sendRequest() {
        fetch('/api/sms-promotion', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(this.state)
        })
        .then(response => response.json())
        .then((json) => {
            console.log('Request succeed:', json);
            this.showMessage(json.message, json.status);
        })
        .catch(error => {
            console.error('Request failed:', error);
            this.showMessage(error.message, error.status);
        });
    }

    handleChange(event) {
        const target = event.target;
        const name = target.name;
        const val = target.type === 'checkbox' ? target.checked : target.value;

        this.setState({ [name]: val });
    }

    handleSubmit(event) {
        event.preventDefault();

        if (this.validateForm()) {
            this.sendRequest();
        } else {
            this.showMessage('Missed required params');
        }
    }

    render() {
        return <div className='container'>
            <form style={{ marginTop: 30 }} onSubmit={this.handleSubmit} >
                <div className='form-group row'>
                    <label htmlFor='phone-number' className='col-sm-2 col-form-label'>Phone number</label>
                    <div className='col-sm-10'>
                        <input type='text' id='phone-number' className='form-control' name='phone' value={this.state.phone} onChange={this.handleChange} />
                    </div>
                </div>
                <div className='form-group row'>
                    <div className='checkbox-wrap offset-sm-2 col-sm-10 text-left'>
                        <div className='form-check'>
                            <input type='checkbox' id='over18' className='form-check-input' name='over18' value={this.state.over18} onChange={this.handleChange} />
                            <label htmlFor='over18' className='form-check-label'>I am over 18</label>
                        </div>
                    </div>
                </div>
                <div className='form-group row'>
                    <div className='checkbox-wrap offset-sm-2 col-sm-10 text-left'>
                        <div className='form-check'>
                            <input type='checkbox' id='accept-terms' className='form-check-input' name='acceptTerms' value={this.state.acceptTerms} onChange={this.handleChange} />
                            <label htmlFor='accept-terms' className='form-check-label'>I accept the terms and conditions</label>
                        </div>
                    </div>
                </div>
                <div className='form-group row'>
                    <div className='offset-sm-2 col-sm-10 text-left'>
                        <button type='submit' className='btn btn-primary'>Get promocode</button>
                    </div>
                </div>
                <div id='place-for-response'></div>
            </form>
        </div>
    }
}

export default Form;