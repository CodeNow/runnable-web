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

gem_package 'sass' do
  version '3.2.9'
  action :install
end

gem_package 'compass' do
  version '0.12.2'
  action :install
end

node.set['runnable_nodejs']['version'] = '0.10.28'
include_recipe 'runnable_nodejs'
