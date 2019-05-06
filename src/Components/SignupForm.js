import React, { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';
import Recaptcha from 'react-recaptcha';


export default function SignupForm(props) {
    const [signUpFailed, setsignUpFailed] = useState(false);
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [recaptchaToken, setrecaptchaToken] = useState(null);
    const [failureMessage, setFailureMessage] = useState(null);
    const [recaptchaInstance, setRecaptchaInstance] = useState(null);
    
    const siteKey = "6LcW5KEUAAAAALv-3CULoySYrCK1zKmZjOo0MbAM";

    function handleUsernameChange(e) {
        setUsername(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleRecaptcha(token) {
        setrecaptchaToken(token);
    }

    function handleSignUpSuccess(user) {
        props.onSuccess(user);
    }

    function handleSignUpFailure(statusCode) {

        recaptchaInstance.reset();

        switch (statusCode) {
            case 665:
                setFailureMessage("Invalid Username");
                break;
            case 666:
                setFailureMessage("Duplicate Username");
                break;
            case 399:
                setFailureMessage("Empty Recaptcha Token");
                break;
            case 400:
                setFailureMessage("Invalid Recaptcha Token");
                break;
            default:
                break;
        }
    }

    async function handleSubmit() {
        try {

            let response = await axios.post("http://localhost:5000/api/users", 
            {
                "Username": username,
                "Password": password,
                "RecaptchaToken": recaptchaToken
            })

            if (response.status === 201) {
                handleSignUpSuccess(response.data);
            }

        } catch (error) {
            setsignUpFailed(true);
            handleSignUpFailure(error.response.data.statusCode);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            {
                signUpFailed ?
                <Message negative>
                    <Message.Header>Sign up attempt failed</Message.Header>
                    <p>{failureMessage}</p>
                </Message>
                : null
            }
            <Form.Field>
                <label>Username</label>
                <input placeholder="Username..." name="username" onChange={handleUsernameChange} />
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input placeholder="Password..." name="password" onChange={handlePasswordChange}/>
            </Form.Field>
            <Recaptcha sitekey={siteKey} ref={e => setRecaptchaInstance(e)} className="recaptcha" verifyCallback={handleRecaptcha}></Recaptcha>
            <Button type='submit'>Sign up</Button>
            <Button onClick={props.onCancel}>Cancel</Button>
        </Form>
    )
}