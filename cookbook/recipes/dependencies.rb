#
# Cookbook Name:: runnable_web
# Recipe:: dependencies
#
# Copyright 2014, Runnable.com
#
# All rights reserved - Do Not Redistribute
#

package 'git'

gem_package 'compass'

node.set['runnable_nodejs']['version'] = '0.10.28'
include_recipe 'runnable_nodejs'

execute 'npm install pm2@0.7.7 -g' do
  action :run
  not_if 'npm list -g pm2'
end

execute 'npm install grunt-cli -g' do
  action :run
  not_if 'npm list -g grunt-cli'
end

execute 'npm install bower -g' do
  action :run
  not_if 'npm list -g bower'
end