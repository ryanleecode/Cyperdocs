import autobind from 'autobind-decorator';
import axios from 'axios';
import nanoid from 'nanoid';
import React from 'react';
import {
  Button,
  Card,
  Form,
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
  documentIdentifier: {
    width: '50%',
    marginTop: '1rem',
  },
  swarmPrivateKey: {
    width: '50%',
    marginTop: '1rem',
  },
});

interface Props extends WithSheet<typeof styles>, RouteComponentProps {
  setDocumentID: (id: string) => void;
  setAliceBaseURL: (aliceBaseURL: string) => void;
  setEnricoBaseURL: (enricoBaseURL: string) => void;
  setSwarmPrivateKey: (swarmPrivateKey: string) => void;
  documentIdentifier: string;
  aliceBaseURL: string;
  policyEncryptingKey: string;
  enricoBaseURL: string;
  swarmPrivateKey: string;
  fakeBobBaseURL: string;
}

interface State {
  showEnrico: boolean;
  showFakeBob: boolean;
  showLabelInput: boolean;
  wantsToEditExistingDocument: boolean;
}

type OnChangeEvent = React.FormEvent<
  ReplaceProps<'input', BsPrefixProps<'input'> & FormControlProps>
>;

class AlicePage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showEnrico: false,
      showFakeBob: false,
      showLabelInput: false,
      wantsToEditExistingDocument: true,
    };
  }

  public componentWillReceiveProps(): void {
    this.setEnricoVisibilityConditionally();
  }

  public render(): JSX.Element {
    const {
      classes,
      documentIdentifier,
      setDocumentID,
      aliceBaseURL,
      setAliceBaseURL,
      policyEncryptingKey,
      enricoBaseURL,
      setEnricoBaseURL,
      swarmPrivateKey,
      setSwarmPrivateKey,
      fakeBobBaseURL,
    } = this.props;
    const {
      showEnrico,
      showLabelInput,
      wantsToEditExistingDocument,
      showFakeBob,
    } = this.state;
    return (
      <React.Fragment>
        <Card>
          <Card.Header>
            <h2>Hello Alice!</h2>
          </Card.Header>
          <Card.Body>
            <Card.Text>
              You are Alice. You have the ability to create documents and share
              it with others by giving explicit permissions using{' '}
              <code>Nucypher</code>.
            </Card.Text>
            <div className={classes.helperTextContainer}>
              <Card.Text>
                Before we get started, we'll need to make sure you are running
                an <code>Alice</code> node.
              </Card.Text>
              <Card.Text>
                This application is compatible with the{' '}
                <code>0.1.0-alpha.21</code> version of <code>Nucypher</code>.
              </Card.Text>
              <Card.Text>
                To get started run this command in your local terminal. You will
                only need to initialize Alice once, so the first line is only
                needed if you're new here.
              </Card.Text>
              <Card.Text>
                <code className={classes.commandBlock}>
                  nucypher alice init --config-root ~/.config/cypherdocs/alice
                  --federated-only --network dev
                  <br />
                  {`nucypher alice run --config-file ~/.config/cypherdocs/alice/alice.config
                    --federated-only --teacher-uri ${
                      process.env.REACT_APP_TEACHER_URL
                    }`}
                </code>
              </Card.Text>

              <Card.Text>
                Once the node is running, paste the server url in the box below.
              </Card.Text>
              <InputGroup className={classes.inputGroup}>
                <FormControl
                  placeholder="Alice Node URL"
                  defaultValue={aliceBaseURL}
                  onKeyPress={(e: { key: 'Enter' | string }) => {
                    if (e.key === 'Enter') {
                      this.onAliceTestURL();
                    }
                  }}
                  onChange={(event: OnChangeEvent) => {
                    setAliceBaseURL(event.currentTarget.value || '');
                  }}
                />
                <InputGroup.Append>
                  <Button
                    disabled={!aliceBaseURL}
                    size="sm"
                    onClick={this.onAliceTestURL}
                  >
                    Test
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </div>
            <div>
              {showLabelInput && (
                <Form>
                  <Form.Label>
                    Do you want to edit an existing document?
                  </Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      label="Yes"
                      inline
                      onChange={() => {
                        this.setState({
                          wantsToEditExistingDocument: true,
                          showEnrico: false,
                        }, () => {
                          this.setEnricoVisibilityConditionally();
                        });
                      }}
                      checked={wantsToEditExistingDocument}
                    />
                    <Form.Check
                      type="radio"
                      label="No"
                      inline
                      onChange={() => {
                        this.setState({
                          wantsToEditExistingDocument: false,
                          showEnrico: true,
                        });
                        setDocumentID(nanoid(26));
                      }}
                      checked={!wantsToEditExistingDocument}
                    />
                  </div>
                  {wantsToEditExistingDocument && (
                    <React.Fragment>
                      <Form.Control
                        className={classes.documentIdentifier}
                        required
                        type="text"
                        placeholder="Document Identifier"
                        value={documentIdentifier}
                        onChange={(value: OnChangeEvent) => {
                          setDocumentID(value.currentTarget.value || '');
                          this.setEnricoVisibilityConditionally();
                        }}
                      />
                      <Form.Control
                        className={classes.swarmPrivateKey}
                        required
                        type="text"
                        placeholder="Swarm Private Key"
                        value={swarmPrivateKey}
                        onChange={(value: OnChangeEvent) => {
                          setSwarmPrivateKey(value.currentTarget.value || '');
                          this.setEnricoVisibilityConditionally();
                        }}
                      />
                    </React.Fragment>
                  )}
                </Form>
              )}
            </div>
          </Card.Body>
        </Card>
        {showEnrico && (
          <Card>
            <Card.Header>
              <h2>Hello Enrico!</h2>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                Turns out as the author of these documents, you also happen to
                be the datasource, <code>Enrico</code>. Congratulations!
              </Card.Text>
              <Card.Text>
                In another terminal startup an <code>Enrico</code> node using
                the following command.
              </Card.Text>
              <Card.Text>
                <code className={classes.commandBlock}>
                  {`nucypher enrico run --policy-encrypting-key ${policyEncryptingKey}`}
                </code>
              </Card.Text>
              <InputGroup className={classes.inputGroup}>
                <FormControl
                  placeholder="Enrico Node URL"
                  defaultValue={enricoBaseURL}
                  onKeyPress={(e: { key: 'Enter' | string }) => {
                    if (e.key === 'Enter') {
                      this.onEnricoTestURL();
                    }
                  }}
                  onChange={(event: OnChangeEvent) => {
                    setEnricoBaseURL(event.currentTarget.value || '');
                  }}
                />
                <InputGroup.Append>
                  <Button
                    disabled={!enricoBaseURL}
                    size="sm"
                    onClick={this.onEnricoTestURL}
                  >
                    Test
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Card.Body>
          </Card>
        )}
        {showFakeBob && (
          <Card>
            <Card.Header>
              <h2>Hello Fake Bob!</h2>
            </Card.Header>
            <Card.Body>
              <Card.Text>
                It's your lucky day, you also get to be <code>Bob</code>! Well,
                sort of... <br />
              </Card.Text>
              <Card.Text>
                In the current state of the{' '}
                <code>Nucypher Character Control API</code>, <code>Alice</code>{' '}
                cannot decrypt her own messages.
              </Card.Text>
              <Card.Text>
                For temporary measures, we ask that you also run a Bob node.
              </Card.Text>
              <Card.Text>
                In another terminal startup an <code>Bob</code> node using the
                following command.
              </Card.Text>
              <Card.Text>
                <code className={classes.commandBlock}>
                  nucypher bob init --config-root ~/.config/cypherdocs/fake-bob
                  --federated-only --network dev
                  <br />
                  {`nucypher bob run --config-file ~/.config/cypherdocs/fake-bob/bob.config
                    --federated-only --teacher-uri ${
                      process.env.REACT_APP_TEACHER_URL
                    } --http-port 11161`}
                </code>
              </Card.Text>
              <Card.Text>
                Once the node is running, paste the server url in the box below.
              </Card.Text>
              <InputGroup className={classes.inputGroup}>
                <FormControl
                  placeholder="Fake Bob Node URL"
                  defaultValue={fakeBobBaseURL}
                  onKeyPress={(e: { key: 'Enter' | string }) => {
                    if (e.key === 'Enter') {
                      this.onFakeBobTestURL();
                    }
                  }}
                  onChange={(event: OnChangeEvent) => {
                    setAliceBaseURL(event.currentTarget.value || '');
                  }}
                />
                <InputGroup.Append>
                  <Button
                    disabled={!fakeBobBaseURL}
                    size="sm"
                    onClick={this.onFakeBobTestURL}
                  >
                    Test
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </Card.Body>
          </Card>
        )}
      </React.Fragment>
    );
  }

  @autobind
  private async onAliceTestURL(): Promise<void> {
    const { aliceBaseURL } = this.props;
    await this.testURL(
      `${aliceBaseURL}/derive_policy_encrypting_key/${nanoid(26)}`,
      'post',
      'Alice',
    );
    this.setEnricoVisibilityConditionally();
  }

  @autobind
  private async onEnricoTestURL(): Promise<void> {
    const { enricoBaseURL } = this.props;
    const isSuccessful = await this.testURL(
      `${enricoBaseURL}/encrypt_message`,
      'post',
      'Enrico',
      {
        message: uuid(),
      },
    );
    if (isSuccessful) {
      this.setState({ showFakeBob: true });
    }
  }

  @autobind
  private async onFakeBobTestURL(): Promise<void> {
    const { fakeBobBaseURL, documentIdentifier } = this.props;
    const isSuccessful = await this.testURL(
      `${fakeBobBaseURL}/public_keys`,
      'get',
      'Fake Bob',
    );
    if (isSuccessful) {
      this.props.history.push(`/editor/${documentIdentifier}`);
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

  private setEnricoVisibilityConditionally(): void {
    const { swarmPrivateKey, documentIdentifier } = this.props;
    const { wantsToEditExistingDocument } = this.state;
    this.setState({
      showEnrico:
        Boolean(swarmPrivateKey && documentIdentifier) ||
        !wantsToEditExistingDocument,
    });
  }
}

export default injectSheet(styles)(AlicePage);
