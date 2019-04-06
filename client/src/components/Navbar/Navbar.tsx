import EditableTextField from '@/EditableTextField';
import { Role } from '@/store/role/types';
import React from 'react';
import {
  Button,
  ButtonToolbar,
  Nav as NavBootstrap,
  Navbar as NavbarBootstrap,
  NavDropdown as NavBootstrapDropdown,
} from 'react-bootstrap';
import withSheet, { WithSheet } from 'react-jss';

const styles = (theme: any) => ({
  navbarBootstrapCollapse: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  documentTitleText: {
    fontSize: '1.15rem',
    pointerEvents: 'auto',
    marginRight: '1rem',
  },
  documentTitleContainer: {
    position: 'absolute',
    pointerEvents: 'none',
    width: '100%',
  },
});

interface Props extends WithSheet<typeof styles> {
  role: Role;
}

class Navbar extends React.Component<Props> {
  public render(): JSX.Element {
    const { classes, role } = this.props;

    return (
      <NavbarBootstrap bg="light" expand="lg">
        <div className={classes.documentTitleContainer}>
          <EditableTextField
            className={classes.documentTitleText}
            defaultText="Untitled Document"
          />
        </div>
        <NavbarBootstrap.Brand href="#home">CypherDocs</NavbarBootstrap.Brand>
        <NavbarBootstrap.Toggle aria-controls="basic-navbar-nav" />
        <NavbarBootstrap.Collapse
          className={classes.navbarBootstrapCollapse}
          id="basic-navbar-nav"
        >
          <NavBootstrap>
            <NavBootstrap.Link href="#home">Home</NavBootstrap.Link>
            <NavBootstrap.Link href="#link">Link</NavBootstrap.Link>
            <NavBootstrapDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavBootstrapDropdown.Item href="#action/3.1">
                Action
              </NavBootstrapDropdown.Item>
              <NavBootstrapDropdown.Item href="#action/3.2">
                Another action
              </NavBootstrapDropdown.Item>
              <NavBootstrapDropdown.Item href="#action/3.3">
                Something
              </NavBootstrapDropdown.Item>
              <NavBootstrapDropdown.Divider />
              <NavBootstrapDropdown.Item href="#action/3.4">
                Separated link
              </NavBootstrapDropdown.Item>
            </NavBootstrapDropdown>
          </NavBootstrap>
          <ButtonToolbar>
            {role === 'Alice' && (
              <Button variant="outline-success">Share</Button>
            )}
            {/*             <Modal show={true} size="sm" centered>
              <Modal.Header closeButton>
                <Modal.Title>Share with a peer</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <InputGroup>

                </InputGroup>
              </Modal.Body>
              <Modal.Footer>dsadasd</Modal.Footer>
            </Modal> */}
          </ButtonToolbar>
        </NavbarBootstrap.Collapse>
      </NavbarBootstrap>
    );
  }
}

export default withSheet(styles)(Navbar);
