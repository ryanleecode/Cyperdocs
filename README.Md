# CypherDocs

Cypherdocs is a peer-to-peer document editing collaboration tool. Documents are encrypted using `Nucypher` and are uploaded to [Swarm](https://swarm-gateways.net/). However, primarily, Cypherdocs uses `Nucypher` to secure WebRTC websocket connection between its peers using a self devised handshake protocol.

This [project](https://coinlist.co/build/nucypher/projects/1f1a6229-8d20-43b9-b762-e62d0307c1ec) was submitted to the Nucypher Coinlist hackathon.


## Demo Video

A demostration video of how to install and it how it works can be found [here](https://www.youtube.com/watch?v=o8f9SGw5PrI)!

### Technical Specification

The technical specification can be found [here](./TECHNICAL_SPECIFICATION.MD)

## Requirements

* Node v10+
* Pipenv

## Installation

### Install Nucypher Fork

The fork adds the following features

* Enables CORs support, so my browser can talk to the nodes
* Makes the expiration date on grants actually work
* Allows Bob to retrieve multiple times

```sh
git clone https://github.com/drdgvhbh/nucypher.git
cd nucypher
pipenv install
pipenv shell
pipenv run install-solc
pip3 install .
```

Start the Ursula Node.

```sh
nucypher ursula run --federated-only --dev
```

### Clone This Repo

```sh
git clone https://github.com/drdgvhbh/nucypher-hackathon.git
cd nucypher-hackathon
```

#### Start the Peer Server

This server is basically the stun/turn/signalling server for Web RTC. You can read more about it [here](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Signaling_and_video_calling#The_signaling_server).

```sh
cd server
npm install
npm run build
npm run host
```

#### Use Ngrok

We'll need an `https` address to use this application. Go ahead and install [Ngrok](https://ngrok.com/) so you can expose your local server as https.

Once installed run

```sh
ngrok http 6666
```

Copy the https url created by ngrok. For example `https://28749c87.ngrok.io`.


#### Setup Client

This assumes you have returned to the root of the `nucypher-hackathon` project

```sh
cd client
cp .env.example .env
```

Paste the url created by ngrok in the field called `REACT_APP_PEER_SERVER_HOST`. You can leave the rest of the parameters as default.


##### Development

```sh
npm run start
```

##### Production

```sh
npm run build
serve -s build
```

### Running

Navigate to http://localhost:3000 or http://localhost:5000 in production mode.

You should now have the peer server, web client, and nucypher Ursula node running.

You'll now get to choose to be Alice or Bob. For the purposes of peer to peer communicate. Simply open another tab and choose the other respective character. From the browser's point of view, both your tabs will be considered peers, even though you're on the same computer of course.

