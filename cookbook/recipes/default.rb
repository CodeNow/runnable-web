#
# Cookbook Name:: runnable_web
# Recipe:: default
#
# Copyright 2014, Runnable.com
#
# All rights reserved - Do Not Redistribute
#

include_recipe 'runnable_web::dependencies'
include_recipe 'runnable_web::deploy_ssh'
include_recipe 'runnable_web::deploy'