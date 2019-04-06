# CYPHERDOCS

## Installation

### Download Ngrok

[Ngrok](https://ngrok.com/) is a tool to expose your locally running server on https to the outside world.

### Start the Peer Server

```sh
cd server
npm run start

ngrok http 6666 # Expose endpoint on https
```

Copy the https url created by ngrok. For example `https://28749c87.ngrok.io`.

### Setup Client

```sh
cd client
cp .env.example .env
```

Paste the url created by ngrok in the field called `REACT_APP_PEER_SERVER_HOST`

```sh
npm run start
```

Navigate to localhost:3000

### Fire up Nucypher nodes

Clone my [fork](https://github.com/drdgvhbh/nucypher/tree/hackathon) of the Nucypher repo using the hackathon branch

```sh
git clone https://github.com/drdgvhbh/nucypher.git
cd nucypher
git checkout hackathon
pipenv install
pipenv shell # You should be in a python shell now
pip3 install .
```

Now nucypher is installed on your computer run an ursula node.

```sh
nucypher ursula run --dev --federated-only
```

### Return to your browser

You should now have the peer server, web client, and nucypher Ursula node running.

On `localhost:3000` click on `Try as Alice/Enrico`.

Follow the first step

When you rest the second step, use the following for the input fields respectively, `a29a436b36842f7ac1c3142be1cd45a6a408119b964eba4c9ad05b92c947d41c`, `40257950741098673124746788164450033172117631348671523857112930943788887933677`.

Continue following the steps.

In a new incognito browser, open the webpage and choose `Try as Bob`. Somewhere in your `Alice` web browser console, you should see an identifer somewhere. i.e. `3xvue5rwv3d00000`. In Bob's browser paste this ID in the connect box and connect bob.

## What still needs to be done?

I am currently working on managing the peer-to-peer connection to be authenticated using nucypher.

We still need to actually upload the document to swarm... right now I'm just pulling a hardcoded document I uploaded on swarm to test... hence why I told you to input that private key and document identifier. 

Were using erebos to communicate with swarm.... https://erebos.js.org/docs/examples-feeds
most of the working is already done... check `client/store/document/epics.ts` for where most of the action happens...