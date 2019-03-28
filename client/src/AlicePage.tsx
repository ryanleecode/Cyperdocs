import React from 'react';
import { Card } from 'react-bootstrap';

class AlicePage extends React.Component {
  public render(): JSX.Element {
    return (
      <Card>
        <Card.Header>
          <h2>Hello Alice!</h2>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            You are Alice. You have the ability to create documents and share it
            with others by giving explicit permissions using{' '}
            <code>Nucypher</code>.
          </Card.Text>
          <Card.Text>
            <p>
              Before we get started, we'll need to make sure you are running an{' '}
              <code>Alice</code> node.
            </p>
            <p>
              This application is compatible with the{' '}
              <code>0.1.0-alpha.21</code> version of <code>Nucypher</code>.
            </p>
            <p>To get started run:</p>
            <code>
              {`nucypher alice run --dev --federated-only --teacher-uri
              ${process.env.REACT_APP_TEACHER_URL}`}
            </code>
          </Card.Text>
        </Card.Body>
      </Card>
    );
  }
}

export default AlicePage;
