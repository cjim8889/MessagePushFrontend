import React from 'react';
import { Button, Header, Divider } from 'semantic-ui-react';
import axios from 'axios';

export class UserInterface extends React.Component {
    constructor(props) {
        super(props);

        const userToken = this.props.userToken;
        this.state = { userToken, user: {}, userLoaded: false, activeIndex: -1 }
        
        this.getUserInfo = this.getUserInfo.bind(this);
        this.refreshToken = this.refreshToken.bind(this);

        this.getUserInfo(userToken);
    }

    handleClick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    async getUserInfo(token) {
        try {

            let response = await axios.get("https://localhost:5001/api/users/user", 
            {
                crossDomain: true,
                headers : {
                    "Authorization" : `Bearer ${token}`
                }
            });
            
            if (response.status === 200) {
                this.setState({user : response.data, userLoaded: true});
            } 

        } catch(err) {
            this.props.onFailed();
        }
    }

    async refreshToken() {

        try {
            let response = await axios.get("https://localhost:5001/api/users/user/token/refresh",
            {
                crossDomain: true,
                headers: {
                    "Authorization" : `Bearer ${this.state.userToken}`
                }
            });

            if (response.status === 200) {
                
                let user = this.state.user;

                user.adminToken = response.data.adminToken;
                user.pushToken = response.data.pushToken;

                this.setState({user: user});
            }

        } catch(err) {

        }
    }

    render() {

        return <div className="user-info">
                <Header as="h1">
                Hi there!
                <Button floated="right" onClick={this.props.logOut}>Log out</Button>
                </Header>
                <Divider hidden />
                <Header as="h3">PushToken</Header>
                <p>{this.state.user.pushToken}</p>
                <Header as="h3">AdminToken</Header>
                <p>{this.state.user.adminToken}</p>
                <Button onClick={this.refreshToken}>Refresh Token</Button>
            </div>

    }

}
