import { Role } from '@/store/role/types';
import autobind from 'autobind-decorator';
import axios from 'axios';
import React from 'react';
import {
  Button,
  Card,
  FormControl,
  FormControlProps,
  InputGroup,
} from 'react-bootstrap';
import { BsPrefixProps, ReplaceProps } from 'react-bootstrap/helpers';
import injectSheet, { WithSheet } from 'react-jss';
import { RouteComponentProps } from 'react-router';
import Swal from 'sweetalert2';

const styles = () => ({
  commandBlock: {
    backgroundColor: '#E5E5E5',
  },
  inputGroup: {
    width: '50%',
  },
});

type OnChangeEvent = React.FormEvent<
  ReplaceProps<'input', BsPrefixProps<'input'> & FormControlProps>
>;

interface Props extends WithSheet<typeof styles>, RouteComponentProps {
  bobBaseURL: string;
  setBobBaseURL: (url: string) => void;
  setRole: (role: Role) => void;
}

class BobPage extends React.Component<Props> {
  public componentDidMount(): void {
    const { setRole } = this.props;
    setRole('Bob');
  }

  public render(): JSX.Element {
    const { classes, bobBaseURL, setBobBaseURL } = this.props;
    return (
      <React.Fragment>
        <Card>
          <Card.Header>
            <h2>Hello Bob!</h2>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              You are <code>Bob</code>. You have the capability to edit and view
              documents created by <code>Alice</code>, in so far that you are
              given permissions to do so, using the <code>Nucypher</code>{' '}
              platform,
            </Card.Text>
            <Card.Text>
              This application is compatible with the{' '}
              <code>0.1.0-alpha.21</code> version of <code>Nucypher</code>.
            </Card.Text>
            <Card.Text>
              To get started run this command in your local terminal. You will
              only need to initialize Bob once, so the first line is only needed
              if you're new here.
            </Card.Text>
            <Card.Text>
              <code className={classes.commandBlock}>
                nucypher bob init --config-root ~/.config/cypherdocs/bob
                --federated-only --network dev
                <br />
                {`nucypher bob run --config-file ~/.config/cypherdocs/bob/bob.config
                    --federated-only --teacher-uri ${
                      process.env.REACT_APP_TEACHER_URL
                    }`}
              </code>
            </Card.Text>
            <InputGroup className={classes.inputGroup}>
              <FormControl
                placeholder="Bob Node URL"
                defaultValue={bobBaseURL}
                onKeyPress={(e: { key: 'Enter' | string }) => {
                  if (e.key === 'Enter') {
                    this.onBobTestURL();
                  }
                }}
                onChange={(event: OnChangeEvent) => {
                  setBobBaseURL(event.currentTarget.value || '');
                }}
              />
              <InputGroup.Append>
                <Button
                  disabled={!bobBaseURL}
                  size="sm"
                  onClick={this.onBobTestURL}
                >
                  Test
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Card.Body>
        </Card>
      </React.Fragment>
    );
  }

  @autobind
  private async onBobTestURL(): Promise<void> {
    const { bobBaseURL } = this.props;
    const isSuccessful = await this.testURL(
      `${bobBaseURL}/public_keys`,
      'get',
      'Bob',
    );
    if (isSuccessful) {
      this.props.history.push(`/editor`);
    }
  }

  private async testURL(
    url: string,
    method: 'post' | 'get',
    character: string,
    body?: any,
  ): Promise<boolean> {
    try {
      await axios(url, {
        method,
        data: body,
      });
      this.setState({ showLabelInput: true });
      await Swal.fire({
        title: 'Test Successful',
        html: `Great! We've detected your <code>${character}</code> node. <br /> You can now proceed.`,
        type: 'success',
      });
      return true;
    } catch (err) {
      await Swal.fire({
        title: 'Test Failed',
        html: `We were unable to hit your <code>${character}</code> node.<br />Try again.`,
        type: 'error',
      });
      return false;
    }
  }
}

export default injectSheet(styles)(BobPage);
