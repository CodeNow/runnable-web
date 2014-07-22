#
# Cookbook Name:: runnable_web
# Recipe:: deploy_ssh
#
# Copyright 2014, Runnable.com
#
# All rights reserved - Do Not Redistribute
#

user 'runnable-web' do
  home '/opt/runnable-web'
  action :create
end

file '/tmp/git_sshwrapper.sh' do
  content "#!/usr/bin/env bash\n/usr/bin/env ssh -o 'StrictHostKeyChecking=no' -i '/runnable-web/.ssh/runnable_web-id_rsa' $1 $2\n"
  owner 'runnable-web'
  group 'runnable-web'
  mode 0755
  action :create
end

directory '/opt/runnable-web/.ssh' do
  owner 'runnable-web'
  group 'runnable-web'
  mode 0700
  action :create
  notifies :create, 'cookbook_file[/opt/runnable-web/.ssh/runnable_web-id_rsa]', :immediately
  notifies :create, 'cookbook_file[/opt/runnable-web/.ssh/runnable_web-id_rsa.pub]', :immediately
end

cookbook_file '/opt/runnable-web/.ssh/runnable_web-id_rsa' do
  source 'runnable_web-id_rsa'
  owner 'runnable-web'
  group 'runnable-web'
  mode 0600
  action :create
  notifies :deploy, "deploy[#{node['runnable_web']['deploy_path']}]", :delayed
  notifies :create, 'cookbook_file[/opt/runnable-web/.ssh/runnable_web-id_rsa.pub]', :immediately
end

cookbook_file '/opt/runnable-web/.ssh/runnable_web-id_rsa.pub' do
  source 'runnable_web-id_rsa.pub'
  owner 'runnable-web'
  group 'runnable-web'
  mode 0600
  action :create
  notifies :deploy, "deploy[#{node['runnable_web']['deploy_path']}]", :delayed
end
