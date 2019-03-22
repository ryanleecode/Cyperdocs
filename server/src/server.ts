import debug from 'debug';
import { PeerServer } from 'peer';

const port = process.env.PORT || 6666;

PeerServer({ port, path: '/swag' }, () => {
  debug('app')(`Peer Server is running on localhost:${port}`);
});
