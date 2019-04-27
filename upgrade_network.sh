#! /usr/bin/env bash

if [ $# -eq 0 ]
    then
        echo "No arguments supplied"
else
    rm ./dist/cit-blockchain-network.bna    # remove after development
    composer archive create --sourceType dir --sourceName . -a ./dist/cit-blockchain-network.bna
    composer network install -c PeerAdmin@hlfv1 -a ./dist/cit-blockchain-network.bna
    composer network upgrade -c PeerAdmin@hlfv1 -n cit-blockchain-network -V $1
    composer network ping -c admin@cit-blockchain-network
fi