#
# Cookbook Name:: runnable_web
# Recipe:: dependencies
#
# Copyright 2014, Runnable.com
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'build-essential'

package 'git'

gem_package 'compass'

node.set['runnable_nodejs']['version'] = '0.10.28'
include_recipe 'runnable_nodejs'

execute 'npm install grunt-cli -g' do
  action :run
  not_if 'npm list -g grunt-cli'
end

execute 'npm install bower -g' do
  action :run
  not_if 'npm list -g bower'
end
