import React, { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';


export default function LoginForm(props) {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);
    const [logInFailed, setLogInFailed] = useState(false);

    function handleUsernameChange(e) {
        setUsername(e.target.value);
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
        let response = await axios.get("https://api.oxifus.com/v1.0/users/login", 
            {
                crossDomain: true,
                params : {
                    username,
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
                <label>Username</label>
                <input placeholder="Username..." name="username" onChange={handleUsernameChange} />
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
