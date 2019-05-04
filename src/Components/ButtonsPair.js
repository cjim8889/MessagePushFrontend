import React from 'react';
import { Container, Button } from 'semantic-ui-react';

export class ButtonsPair extends React.Component {
    render() {
        return <Container className="buttons-pair">
            <Button onClick={this.props.primaryClicked} primary>{this.props.primaryText}</Button>
            <Button onClick={this.props.secondaryClicked} secondary>{this.props.secondaryText}</Button>
        </Container>
    }
}