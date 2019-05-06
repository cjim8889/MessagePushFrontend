import React, { useState } from 'react';
import { Button, Form, Message } from 'semantic-ui-react';
import axios from 'axios';
import Recaptcha from 'react-recaptcha';


export default function SignupForm(props) {
    const [signUpFailed, setsignUpFailed] = useState(false);
    const [password, setPassword] = useState(null);
    const [email, setEmail] = useState(null);
    const [recaptchaToken, setrecaptchaToken] = useState(null);

    const siteKey = "6LcW5KEUAAAAALv-3CULoySYrCK1zKmZjOo0MbAM";

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }

    function handleRecaptcha(token) {
        setrecaptchaToken(token);
    }

    function handleSignUpSuccess() {
        
    }

    async function handleSubmit() {
        try {

            let response = await axios.post("http://localhost:5000/api/users", 
            {
                "Email": email,
                "Password": password,
                "RecaptchaToken": recaptchaToken
            })

            if (response.status === 201) {
                console.log(response.data);
            }

        } catch (error) {
            setsignUpFailed(true);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            {
                signUpFailed ?
                <Message negative>
                    <Message.Header>Sign up attempt failed</Message.Header>
                    <p>Please try again</p>
                </Message>
                : null
            }
            <Form.Field>
                <label>Email Address</label>
                <input placeholder="Email..." name="email" onChange={handleEmailChange} />
            </Form.Field>
            <Form.Field>
                <label>Password</label>
                <input placeholder="Password..." name="password" onChange={handlePasswordChange}/>
            </Form.Field>
            <Recaptcha sitekey={siteKey} className="recaptcha" verifyCallback={handleRecaptcha}></Recaptcha>
            <Button type='submit'>Sign up</Button>
            <Button onClick={props.onCancel}>Cancel</Button>
        </Form>
    )
}