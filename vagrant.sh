#!/bin/bash
apt-get -y update
apt-get -y install python-software-properties python g++ make vim git curl fontconfig diod
add-apt-repository -y ppa:chris-lea/node.js
apt-get -y update
apt-get -y install nodejs redis-server