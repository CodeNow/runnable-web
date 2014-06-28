#
# Cookbook Name:: runnable_web
# Recipe:: deploy
#
# Copyright 2014, Runnable.com
#
# All rights reserved - Do Not Redistribute
#

deploy node['runnable_web']['deploy_path'] do
  repo 'git@github.com:CodeNow/runnable-web.git'
  git_ssh_wrapper '/tmp/git_sshwrapper.sh'
  branch 'master'
  deploy_to node['runnable_web']['deploy_path']
  migrate false
  create_dirs_before_symlink []
  purge_before_symlink []
  symlink_before_migrate({})
  symlinks({})
  action :deploy
  notifies :create, 'file[runnable-web_config]', :immediately
end

file 'runnable-web_config' do
  path "#{node['runnable_web']['deploy_path']}/current/configs/#{node.chef_environment}.json"
  content JSON.pretty_generate node['runnable_web']['config']
  action :nothing
  notifies :run, 'execute[npm install]', :immediately
end

execute 'npm install' do
  cwd "#{node['runnable_web']['deploy_path']}/current"
  action :nothing
  notifies :run, 'execute[bower install]', :immediately
end

execute 'bower install' do
  cwd "#{node['runnable_web']['deploy_path']}/current"
  action :nothing
  notifies :run, 'execute[grunt build]', :immediately
end

execute 'grunt build' do  
  cwd "#{node['runnable_web']['deploy_path']}/current"
  action :nothing
  notifies :restart, 'service[runnable-web', :immediately
end

service 'runnable-web' do
  action :start
  stop_command 'pm2 stop runnable-web'
  start_command "bash -c 'NODE_ENV=#{node.chef_environment} pm2 start #{node['runnable_docklet']['deploy_path']}/current/lib/index.js -n runnable-web'"
  status_command 'pm2 status | grep runnable-web | grep online'
  restart_command 'pm2 restart runnable-web'
  supports :start => true, :stop => true, :status => true, :restart => true
end