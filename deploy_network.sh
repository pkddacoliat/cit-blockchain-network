#! /usr/bin/env bash
set -e
rm ./dist/cit-blockchain-network.bna           # remove after development
rm ./dist/admin@cit-blockchain-network.card    # remove after development
composer archive create --sourceType dir --sourceName . -a ./dist/cit-blockchain-network.bna
composer network install -c PeerAdmin@hlfv1 -a ./dist/cit-blockchain-network.bna
composer network start -c PeerAdmin@hlfv1 -n cit-blockchain-network -V 0.0.1 -A admin -S adminpw -f ./dist/admin@cit-blockchain-network.card
composer card delete -c admin@cit-blockchain-network    # remove after development
composer card import -f ./dist/admin@cit-blockchain-network.card
composer network ping -c admin@cit-blockchain-network  
