import React from 'react';
import ReactDOM from 'react-dom';
import { Container, Header, Divider } from 'semantic-ui-react';
import { ButtonsPair } from './Components/ButtonsPair'; 
import { LoginForm } from './Components/LoginForm';
import { UserInterface } from './Components/UserInterface';
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
    }

    loadLocalState() {
        let userToken = localStorage.getItem("userToken");
        let isLoggedIn = localStorage.getItem("isLoggedIn");

        if (Boolean(isLoggedIn)) {
            this.logInSuccess(userToken);
        }
    }

    componentDidMount() {
        this.loadLocalState();
    }

    logInSuccess(info) {
        this.setState({userToken: info, isLoggedIn: true});
        this.setState({loginFormVisibility: false, signupFormVisibility: false, mainButtonsVisibility: false});

        localStorage.setItem("userToken", info);
        localStorage.setItem("isLoggedIn", "true");
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
                <UserInterface userToken={this.state.userToken} logOut={this.logOut}></UserInterface>
                : null
            }
        </Container>
        

    }
}

ReactDOM.render(<App />, document.getElementById("root"));

