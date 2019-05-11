import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Header, Divider } from 'semantic-ui-react';
import ButtonsPair from './Components/ButtonsPair'; 
import LoginForm from './Components/LoginForm';
import UserInterface from './Components/UserInterface';
import SignupForm from './Components/SignupForm';
import 'semantic-ui-css/semantic.min.css';
import './Static/css/main.css'


class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            loginFormVisibility: false,
            signupFormVisibility: false,
            mainButtonsVisibility: true,
            isLoggedIn: false
        }

        this.logInClicked = this.logInClicked.bind(this);
        this.cancelClicked = this.cancelClicked.bind(this);
        this.signUpClicked = this.signUpClicked.bind(this);
        this.logInSuccess = this.logInSuccess.bind(this);
        this.loadLocalState = this.loadLocalState.bind(this);
        this.logOut = this.logOut.bind(this);
        this.signUpSuccess = this.signUpSuccess.bind(this);
    }

    loadLocalState() {
        let userToken = localStorage.getItem("userToken");
        let isLoggedIn = localStorage.getItem("isLoggedIn");

        if (Boolean(isLoggedIn)) {
            this.logInSuccess(userToken);
        }
    }

    componentWillMount() {
        this.loadLocalState();
    }

    logInSuccess(info) {
        this.setState({userToken: info, isLoggedIn: true});
        this.setState({loginFormVisibility: false, signupFormVisibility: false, mainButtonsVisibility: false});

        localStorage.setItem("userToken", info);
        localStorage.setItem("isLoggedIn", "true");
    }

    signUpSuccess(response) {
        this.setState({signupFormVisibility: false, mainButtonsVisibility: false, loginFormVisibility: true});
    }

    logInClicked(e) {
        
        if (this.state.mainButtonsVisibility === true) {
            this.setState({ mainButtonsVisibility: false, loginFormVisibility: true});
        }
    }

    logOut() {
        this.setState({userToken: "", isLoggedIn: false, mainButtonsVisibility: true});


        localStorage.removeItem("userToken");
        localStorage.removeItem("isLoggedIn");

    }

    signUpClicked(e) {
        this.setState({signupFormVisibility: true, mainButtonsVisibility: false});
    }

    cancelClicked() {
        this.setState({
            mainButtonsVisibility: true,
            loginFormVisibility: false,
            signupFormVisibility: false
        });
    }


    render() {
        return <Container text className="main">
            <Header as="h1">TelePush</Header>
            <p>
            An elegant way of pushing your messages.
            <br/>
            一行HTTP API调用即可发送讯息到Telegram
            <br/>
            支持一对一,一对多发送
            </p>
            <Divider />
            {
                this.state.mainButtonsVisibility ?
                <ButtonsPair primaryText="Log in" secondaryText="Sign up" primaryClicked={(e) => this.logInClicked(e)} secondaryClicked={(e) => this.signUpClicked(e)}></ButtonsPair>
                : null
            }
            {
                this.state.loginFormVisibility ?
                <LoginForm onCancel={this.cancelClicked} onSuccess={this.logInSuccess}></LoginForm>
                : null
            }
            {
                this.state.isLoggedIn ?
                <UserInterface userToken={this.state.userToken} onLogOut={this.logOut}></UserInterface>
                : null
            }
            {
                this.state.signupFormVisibility ?
                <SignupForm onCancel={this.cancelClicked} onSuccess={this.signUpSuccess}></SignupForm>
                : null
            }
        </Container>
        

    }
}

ReactDOM.render(<App />, document.getElementById("root"));

