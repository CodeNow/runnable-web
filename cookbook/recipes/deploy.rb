#
# Cookbook Name:: runnable_web
# Recipe:: deploy
#
# Copyright 2014, Runnable.com
#
# All rights reserved - Do Not Redistribute
#

user 'runnable-web' do
  action :create
end

deploy node['runnable_web']['deploy_path'] do
  repo 'git@github.com:CodeNow/runnable-web.git'
  git_ssh_wrapper '/tmp/git_sshwrapper.sh'
  branch node['runnable_web']['deploy_branch']
  deploy_to node['runnable_web']['deploy_path']
  user 'runnable-web'
  migrate false
  before_migrate do
    file 'runnable-web_config' do
      path "#{release_path}/configs/#{node.chef_environment}.json"
      content JSON.pretty_generate node['runnable_web']['config']
      action :create
      notifies :run, 'execute[npm cache clean]', :immediately
    end

    execute 'npm cache clean' do
      action :nothing
      notifies :run, 'execute[npm install]', :immediately
    end

    execute 'npm install' do
      cwd release_path
      environment({'NODE_ENV' => node.chef_environment})
      action :nothing
      notifies :run, 'execute[bower install]', :immediately
    end
    
    execute 'bower install' do
      command './node_modules/.bin/bower install'
      cwd release_path
      environment({'NODE_ENV' => node.chef_environment})
      action :nothing
      notifies :run, 'bash[npm run build]', :immediately
    end

    bash 'npm run build' do
      code <<-EOM
        log=`mktemp /tmp/grunt.log.XXXXXXXX`
        npm run build &> $log
        ret=$?
        echo "npm run build returned $ret" >> $log
        echo "env output: `env`" >> $log
        echo "locale output: `locale`" >> $log
        cat $log
        grep -v "Done, without errors." $log | grep -q -i -e warn -e error && exit 1
        exit $ret
      EOM
      environment({
        'NODE_ENV' => node.chef_environment,
        'LC_ALL' => 'en_US.UTF-8',
        'PATH' => '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/opt/chef/embedded/bin'
      })
      cwd release_path
      action :nothing
    end
  end
  before_restart do
    template '/etc/init/runnable-web.conf' do
      source 'upstart.conf.erb'
      variables({
        :name     => 'runnable-web',
        :deploy_path  => release_path,
        :log_file   => '/var/log/runnable-web.log',
        :start_command => "node #{release_path}/index.js",
        :node_env     => node.chef_environment
      })
      action :create
    end    
  end
  restart_command do
    service 'runnable-web' do
      provider Chef::Provider::Service::Upstart
      supports :restart => true, :start => true, :stop => true
      action [:enable, :restart]
    end
  end
  create_dirs_before_symlink []
  purge_before_symlink []
  symlink_before_migrate({})
  symlinks({})
  rollback_on_error true
  action :deploy
end


