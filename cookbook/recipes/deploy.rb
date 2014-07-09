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
  command 'bower install --allow-root'
  cwd "#{node['runnable_web']['deploy_path']}/current"
  action :nothing
  notifies :run, 'execute[grunt build]', :immediately
end

execute 'grunt build' do  
  cwd "#{node['runnable_web']['deploy_path']}/current"
  action :nothing
  notifies :create, 'template[/etc/init/runnable-web.conf]', :immediately
end

template '/etc/init/runnable-web.conf' do
  source 'upstart.conf.erb'
  variables({
    :name     => 'runnable-web',
    :deploy_path  => "#{node['runnable_web']['deploy_path']}/current",
    :log_file   => '/var/log/runnable-web.log',
    :start_command => "node #{node['runnable_web']['deploy_path']}/current/lib/index.js",
    :node_env     => node.chef_environment
  })
  action :create
  notifies :restart, 'service[runnable-web]', :immediately
end

service 'runnable-web' do
  provider Chef::Provider::Service::Upstart
  action :nothing
end