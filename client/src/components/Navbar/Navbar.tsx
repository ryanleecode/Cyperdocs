import React from 'react';
import {
  Button,
  Form,
  Media,
  Modal,
  Nav as NavBootstrap,
  Navbar as NavbarBootstrap,
  NavDropdown as NavBootstrapDropdown,
} from 'react-bootstrap';
import withSheet, { WithSheet } from 'react-jss';
import { CloseButton } from 'react-svg-buttons';
import { mapDispatchToProps, mapStateToProps } from './NavbarContainer';

const styles = (theme: any) => ({
  navbarBootstrapCollapse: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  kickButton: {
    background: 'transparent',
    border: 'none',
  },
});

type NavbarActions = typeof mapDispatchToProps;
type NavbarStateProps = ReturnType<typeof mapStateToProps>;

interface Props
  extends WithSheet<typeof styles>,
    NavbarActions,
    NavbarStateProps {}

interface State {
  areCredentialsShown: boolean;
  arePeersShown: boolean;
}

class Navbar extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      areCredentialsShown: false,
      arePeersShown: false,
    };
  }

  public render(): JSX.Element {
    const {
      role,
      documentID,
      swarmPrivateKey,
      authorizedPeers,
      classes,
      kickPeer,
    } = this.props;
    const { areCredentialsShown, arePeersShown } = this.state;

    return (
      <React.Fragment>
        <Modal
          show={arePeersShown}
          onHide={() => this.setState({ arePeersShown: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Manage Peers</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul className="list-unstyled">
              {authorizedPeers.size === 0 && (
                <p>You have no peers, try sharing your document!</p>
              )}
              {authorizedPeers.keySeq().map((peerID, idx) => (
                <Media id={authorizedPeers.get(peerID!!)} as="li">
                  <button
                    className={classes.kickButton}
                    onClick={() => kickPeer({ peerID: peerID!! })}
                  >
                    <CloseButton color="red" size={30} />
                  </button>
                  <Media.Body>
                    <h5>Bob {idx}</h5>
                    <code>{authorizedPeers.get(peerID!!)}</code>
                  </Media.Body>
                </Media>
              ))}
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ arePeersShown: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={areCredentialsShown}
          onHide={() => this.setState({ areCredentialsShown: false })}
        >
          <Modal.Header closeButton>
            <Modal.Title>Your Document Credentials</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            These are your credentials to access and edit this document. If you
            lose these credentials you will not be able to recover your
            document.
          </Modal.Body>
          <Modal.Body>
            <h6>Document Identifier</h6> <code>{documentID}</code>
            <h6>Swarm Private Key</h6> <code>{swarmPrivateKey}</code>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => this.setState({ areCredentialsShown: false })}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <NavbarBootstrap bg="light" expand="lg">
          <NavbarBootstrap.Brand href="#home">CypherDocs</NavbarBootstrap.Brand>
          <NavbarBootstrap.Toggle aria-controls="basic-navbar-nav" />
          <NavbarBootstrap.Collapse id="basic-navbar-nav">
            <NavBootstrap
              className="mr-auto"
              style={{ alignItems: 'flex-start' }}
            >
              <NavBootstrapDropdown title="Tools" id="basic-nav-dropdown">
                <NavBootstrapDropdown.Item>Action</NavBootstrapDropdown.Item>
                {role === 'Alice' && (
                  <React.Fragment>
                    <NavBootstrapDropdown.Item
                      onClick={() => this.setState({ arePeersShown: true })}
                    >
                      Manage Peers
                    </NavBootstrapDropdown.Item>
                    <NavBootstrapDropdown.Item
                      onClick={() =>
                        this.setState({ areCredentialsShown: true })
                      }
                    >
                      View your Credentials
                    </NavBootstrapDropdown.Item>
                  </React.Fragment>
                )}
                <NavBootstrapDropdown.Divider />
                <NavBootstrapDropdown.Item
                  href={`https://swarm-gateways.net/bzz:/${documentID}/`}
                  target="_blank"
                >
                  View Document On Swarm
                </NavBootstrapDropdown.Item>
              </NavBootstrapDropdown>
            </NavBootstrap>
            <Form inline>
              {role === 'Alice' && (
                <Button variant="outline-success">Share</Button>
              )}
            </Form>
          </NavbarBootstrap.Collapse>
        </NavbarBootstrap>
      </React.Fragment>
    );
  }
}

export default withSheet(styles)(Navbar);
