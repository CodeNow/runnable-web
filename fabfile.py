#!/usr/bin/env python

from fabric.api import *

env.user = "ubuntu"
env.use_ssh_config = True

"""
Environments
"""
def production():
  """
  Work on production environment
  """
  env.settings = 'production'
  env.hosts = [ 
    'web'
  ]
 
def integration():
  """
  Work on staging environment
  """
  env.settings = 'integration'
  env.hosts = [ 
    'web-int'
  ]


"""
Branches
"""
def stable():
  """
  Work on stable branch.
  """
  env.branch = 'stable'
 
def master():
  """
  Work on development branch.
  """
  env.branch = 'master'
 
def branch(branch_name):
  """
  Work on any specified branch.
  """
  env.branch = branch_name


"""
Commands - setup
"""
def setup():
  """
  Install and start the server.
  """
  require('settings', provided_by=[production, integration])
  require('branch', provided_by=[stable, master, branch])

  clone_repo()
  checkout_latest()
  install_requirements()
  grunt()
  boot()
 
def clone_repo():
  """
  Do initial clone of the git repository.
  """
  run('git clone https://github.com/CodeNow/runnable-web.git')
 
def checkout_latest():
  """
  Pull the latest code on the specified branch.
  """
  with cd('runnable-web'):
    run('git checkout %(branch)s' % env)
    run('git pull origin %(branch)s' % env)
 
def install_requirements():
  """
  Install the required packages using npm.
  """
  sudo('npm install pm2 grunt-cli -g')
  with cd('runnable-web'):
    run('npm install')
  
def grunt():
  """
  Run grunt
  """
  with cd('runnable-web'):
    run('grunt')

def boot():
  """
  Start process with pm2
  """
  run('NODE_ENV=%(settings)s pm2 start runnable-web/index.js' % env)

"""
Commands - deployment
"""
def deploy():
  """
  Deploy the latest version of the site to the server.
  """
  require('settings', provided_by=[production, integration])
  require('branch', provided_by=[stable, master, branch])
      
  checkout_latest()
  install_requirements()
  grunt()
  reboot()
 
def reboot(): 
  """
  Restart the server.
  """
  run('pm2 stop index.js')
  boot()

"""
Commands - rollback
"""
def rollback(commit_id):
  """
  Rolls back to specified git commit hash or tag.
  
  There is NO guarantee we have committed a valid dataset for an arbitrary
  commit hash.
  """
  require('settings', provided_by=[production, integration])
  require('branch', provided_by=[stable, master, branch])

  checkout_latest()
  git_reset(commit_id)
  install_requirements()
  make()
  reboot()
    
def git_reset(commit_id):
  """
  Reset the git repository to an arbitrary commit hash or tag.
  """
  env.commit_id = commit_id
  run("cd runnable-web; git reset --hard %(commit_id)s" % env)

"""
Deaths, destroyers of worlds
"""
def shiva_the_destroyer():
  """
  Death Destruction Chaos.
  """
  run('pm2 stop index.js')
  run('rm -Rf runnable-web')
