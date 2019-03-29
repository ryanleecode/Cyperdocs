import autobind from 'autobind-decorator';
import axios from 'axios';
import React from 'react';
import {
  Button,
  Card,
  FormControl,
  FormControlProps,
  InputGroup,
  Spinner,
} from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
import injectSheet, { WithSheet } from 'react-jss';
import { RouteComponentProps } from 'react-router';
import Swal from 'sweetalert2';
import uuid from 'uuid/v4';

const styles = () => ({
  commandBlock: {
    backgroundColor: '#E5E5E5',
  },
  inputGroup: {
    width: '50%',
  },
  helperTextContainer: {
    marginBottom: '1rem',
  },
});

interface Props extends WithSheet<typeof styles>, RouteComponentProps {}

interface State {
  aliceURL?: string;
  isTestingAliceURL: boolean;
}

type OnChangeEvent = React.FormEvent<
  ReplaceProps<'input', BsPrefixProps<'input'> & FormControlProps>
>;

class AlicePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isTestingAliceURL: false,
    };
  }

  public render(): JSX.Element {
    const { classes } = this.props;
    const { aliceURL, isTestingAliceURL } = this.state;
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
          <div className={classes.helperTextContainer}>
            <Card.Text>
              Before we get started, we'll need to make sure you are running an{' '}
              <code>Alice</code> node.
            </Card.Text>
            <Card.Text>
              This application is compatible with the{' '}
              <code>0.1.0-alpha.21</code> version of <code>Nucypher</code>.
            </Card.Text>
            <Card.Text>
              To get started run this command in your local terminal.
            </Card.Text>
            <Card.Text>
              <code className={classes.commandBlock}>
                {`nucypher alice run --dev --federated-only --teacher-uri
              ${process.env.REACT_APP_TEACHER_URL}`}
              </code>
            </Card.Text>

            <Card.Text>
              Once the node is running, paste the server url in the box below.
            </Card.Text>
            <InputGroup className={classes.inputGroup}>
              <FormControl
                placeholder="http://localhost:8151"
                onChange={(event: OnChangeEvent) => {
                  this.setState({ aliceURL: event.currentTarget.value });
                }}
              />
              <InputGroup.Append>
                <Button disabled={!aliceURL} size="sm" onClick={this.onTestURL}>
                  Test
                </Button>
                {isTestingAliceURL && (
                  <InputGroup.Text id="basic-addon2">
                    <Spinner animation="border" role="status" size="sm">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </InputGroup.Text>
                )}
              </InputGroup.Append>
            </InputGroup>
          </div>
        </Card.Body>
      </Card>
    );
  }

  @autobind
  private async onTestURL(): Promise<void> {
    const { aliceURL } = this.state;
    try {
      await axios.post(`${aliceURL}/derive_policy_encrypting_key/${uuid()}`);
      this.setState({ isTestingAliceURL: false });
      Swal.fire({
        title: 'Test Successful',
        html: `Great! We've detected your <code>Alice</code> node. <br /> You can now proceed.`,
        type: 'success',
        confirmButtonText: 'Continue',
      }).then(() => {
        this.props.history.push(`/editor/${uuid()}`);
      });
    } catch (err) {
      this.setState({ isTestingAliceURL: false });
      Swal.fire({
        title: 'Test Failed',
        html:
          'We were unable to hit your <code>Alice</code> node.<br />Try again.',
        type: 'error',
      });
    }
  }
}

export default injectSheet(styles)(AlicePage);
