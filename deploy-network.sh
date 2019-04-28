#! /usr/bin/env bash
set -e
composer archive create --sourceType dir --sourceName . -a ./dist/cit-blockchain-network.bna
composer network install -c PeerAdmin@hlfv1 -a ./dist/cit-blockchain-network.bna
composer network start -c PeerAdmin@hlfv1 -n cit-blockchain-network -V 0.0.1 -A admin -S adminpw -f ./dist/admin@cit-blockchain-network.card
composer card import -f ./dist/admin@cit-blockchain-network.card
composer network ping -c admin@cit-blockchain-network  
