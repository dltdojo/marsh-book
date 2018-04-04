#!/bin/bash 
npm run prepublish
composer network install --archiveFile ./dist/mb-alpha-network.bna --card PeerAdmin@hlfv1
composer network start --networkName mb-alpha-network --networkVersion 0.0.1 --networkAdmin admin --networkAdminEnrollSecret adminpw --card PeerAdmin@hlfv11 --file networkadmin.card
composer card delete --card admin@mb-alpha-network
composer card import --file networkadmin.card 