import React from 'react';
import { Button } from 'react-bootstrap';
import injectSheet, { WithSheet } from 'react-jss';
import { Background, Parallax } from 'react-parallax';
import { Link } from 'react-router-dom';
import { Sticky, StickyContainer } from 'react-sticky';
import { Theme } from './App';

const styles = (theme: typeof Theme) => ({
  banner: {
    position: 'sticky',
    maxWidth: '100%',
    top: 0,
    zIndex: -1,
  },
  bannerContainer: {
    height: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    textShadow: '0 2px 3px rgba(0,0,0,.2)',
    textAlign: 'center',
    marginBottom: '1rem',
  },
  subtitle: {
    color: '#F9FDFB',
    textShadow: '0 2px 3px rgba(0,0,0,.2)',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-around',
  },
});

class HomePage extends React.Component<WithSheet<typeof styles>> {
  public render(): JSX.Element {
    const { classes } = this.props;

    return (
      <div>
        <div style={{ position: 'sticky' }}>
          <Parallax blur={6} bgImage={'/banner.jpg'} strength={100}>
            <div className={classes.bannerContainer}>
              <div>
                <h1 className={classes.title}>CypherDocs</h1>
                <h4 className={classes.subtitle}>
                  The trustless peer to peer document collaboration tool
                </h4>
                <div className={classes.buttonContainer}>
                  <Link to="/alice">
                    <Button size="lg" variant="outline-info">
                      Try Now as Alice
                    </Button>
                  </Link>

                  <Button size="lg" variant="outline-info">
                    Try Now as Bob
                  </Button>
                </div>
              </div>
            </div>
          </Parallax>
        </div>
      </div>
    );
  }
}

export default injectSheet(styles)(HomePage);
