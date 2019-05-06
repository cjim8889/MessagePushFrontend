import React, { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';


export default function LoginForm(props) {
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);
    const [logInFailed, setLogInFailed] = useState(false);

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }
    
    function handleLogInSuccess(token) {
        props.onSuccess(token);
    }

    function handleLogInFailure(status) {
        setLogInFailed(true);
    }

    async function handleLogIn(e) {        
        let response = await axios.get("http://localhost:5000/api/users/login", 
            {
                crossDomain: true,
                params : {
                    email,
                    password
                },
                validateStatus: () => true
            });

        if (response.status === 200) {
            handleLogInSuccess(response.data.message);
        } else {
            handleLogInFailure(response.status);
        }
    }

    

    return (
        <Form onSubmit={handleLogIn}>
            {
                logInFailed ?
                <Message negative>
                    <Message.Header>Log in attempt failed</Message.Header>
                    <p>Please try again</p>
                </Message>
                : null
            }
            <Form.Field error={logInFailed}>
                <label>Email Address</label>
                <input placeholder="Email..." name="email" onChange={handleEmailChange} />
            </Form.Field>
            <Form.Field error={logInFailed}>
                <label>Password</label>
                <input placeholder="Password..." name="password" onChange={handlePasswordChange}/>
            </Form.Field>
            <Button type='submit'>Log In</Button>
            <Button onClick={props.onCancel}>Cancel</Button>
        </Form>
    )
}
