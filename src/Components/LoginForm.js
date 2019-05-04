import React from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';

export class LoginForm extends React.Component {

    constructor(props) {
        super(props);

        this.state = { email: '', password: '', logInFailed: false };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.logInFailed = this.logInFailed.bind(this);
    }

    onChange = (e) => {
        this.setState({ [e.target.name] : e.target.value });
    }

    onSubmit = async (e) => {
        
        var email = this.state.email;
        var password = this.state.password;

        try {
            let response = await axios.get("https://localhost:5001/api/users/login", 
            {
                crossDomain: true,
                params : {
                    email,
                    password
                }
            });
            
            if (response.data.statusCode === 1) {
                this.logInSucceed(response.data.message);
            } 

        } catch(err) {
            this.logInFailed(err.response.status);
        }
    }

    logInSucceed(token) {
        this.props.onSuccess(token);
    }

    logInFailed(statusCode) {
        this.setState({ logInFailed : true });
    }
    render() {
        return <Form onSubmit={this.onSubmit}>
            {
                this.state.logInFailed ?
                <Message negative>
                    <Message.Header>Log in attempt failed</Message.Header>
                    <p>Please try again</p>
                </Message>
                : null
            }
            <Form.Field error={this.state.logInFailed}>
                <label>Email Address</label>
                <input placeholder="Email..." name="email" onChange={this.onChange} />
            </Form.Field>
            <Form.Field error={this.state.logInFailed}>
                <label>Password</label>
                <input placeholder="Password..." name="password" onChange={this.onChange}/>
            </Form.Field>
            <Button type='submit'>Log In</Button>
            <Button onClick={this.props.onCancel}>Cancel</Button>
        </Form>
    }
}