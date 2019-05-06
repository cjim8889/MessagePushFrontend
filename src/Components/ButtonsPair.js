import React from 'react';
import { Container, Button } from 'semantic-ui-react';

export default function ButtonsPair(props) {
    return (
        <Container className="buttons-pair">
            <Button onClick={props.primaryClicked} primary>{props.primaryText}</Button>
            <Button onClick={props.secondaryClicked} secondary>{props.secondaryText}</Button>
        </Container>
    )
}
