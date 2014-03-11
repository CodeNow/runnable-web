#!/usr/bin/env python

from fabric.api import *

env.user = "ubuntu"
env.use_ssh_config = True

"""
Environments
"""
def staging():
  """
  Work on staging environment
  """
  env.requireNote = False;
  env.settings = 'staging'
  env.hosts = [
    'web-rep_int',
  ]

def runnable3():
  """
  Work on staging environment
  """
  env.requireNote = False;
  env.settings = 'runnable3'
  env.hosts = [
    'runnable3.net'
  ]

def production():
  """
  Work on production environment
  """
  env.requireNote = True;
  env.settings = 'production'
  env.hosts = [
    'web',
    # 'web1',
    # 'web2'
  ]

def integration():
  """
  Work on integration environment
  """
  env.requireNote = False;
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
  require('settings', provided_by=[production, integration, staging])
  require('branch', provided_by=[stable, master, branch])

  install_node()
  clone_repo()
  track_deployment()
  # checkout_latest()
  install_requirements()
  bower()
  grunt()
  boot()

def install_node():
  """
  Install Node.js stable
  """
  sudo('apt-get update')
  sudo('apt-get install -y python-software-properties python g++ make')
  sudo('FORCE_ADD_APT_REPOSITORY=1 add-apt-repository ppa:chris-lea/node.js')
  sudo('apt-get update')
  sudo('apt-get install -y nodejs git')

def clone_repo():
  """
  Do initial clone of the git repository.
  """
  if run('[ -d runnable-web ] && echo True || echo False') == 'False':
    run('git clone https://github.com/CodeNow/runnable-web.git')

def track_deployment():
  """
  Update deployments for tracking
  """
  run('echo Track Deployment:')
  if run('[ -d deployments ] && echo True || echo False') == 'False':
    run('git clone https://github.com/Runnable/deployments.git')
  with cd('deployments'):
    run('git fetch --all')
    run('git reset --hard origin/master')
  with cd('runnable-web'):
    run(
      'echo { branch: `git rev-parse --abbrev-ref HEAD`, ' \
      'commit: `git log origin/master | head -1 | awk \'{print $2}\'`, ' \
      'push_date: `date +%d-%m-%Y`, ' \
      'push_time: `date +%H:%M:%S`, ' \
      'project: runnable-web, ' \
      'author: `cat ~/.name`, '\
      'note: '+env.note+' } ' \
      '> ~/.notetmp')
    run('cat ~/.notetmp | sed \'s_, _\", \"_g\' | sed \'s_: _\": \"_g\' | sed \'s_{ _{ \"_g\' | sed \'s_ }_\" }_g\' >> ~/deployments/'+env.settings)
  with cd('deployments'):
    run('git add '+env.settings)
    run('git commit -m "update file"')
    run('git push origin master')

def checkout_latest():
  """
  Pull the latest code on the specified branch.
  """
  with cd('runnable-web'):
    run('git config credential.helper store')
    run('git fetch')
    run('git reset --hard')
    run('git checkout %(branch)s' % env)
    run('git pull origin %(branch)s' % env)
    run('git config --unset credential.helper')
    run('cat ~/.git-credentials | head -1 | grep -o //.*: | sed s_//__ | sed s_:__ > ~/.name')
    run('rm ~/.git-credentials')

def install_requirements():
  """
  Install the required packages using npm.
  """
  sudo('npm install pm2 grunt-cli bower -g')
  sudo('apt-get install -y rubygems')
  sudo('gem install compass')
  sudo('rm -rf ~/tmp')
  with cd('runnable-web'):
    run('npm install')

def bower():
  with cd('runnable-web'):
    run('bower install')

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
  with cd('runnable-web'):
    run('NODE_ENV=%(settings)s pm2 start index.js -i 40 -n runnable-web' % env)

def validateNote(input):
  """
  ensures note is not empty
  """
  if(bool(not input or input.isspace())):
    raise Exception('release note is REQUIRED. just jot down what is in this release alright')
  if ";" in input:
    raise Exception('can not use ; in note')
  return input

def addNote():
  """
  add note to deployment
  """
  if(env.requireNote):
    prompt("add release note: ", "note", validate=validateNote)

"""
Commands - deployment
"""
def deploy():
  """
  Deploy the latest version of the site to the server.
  """
  require('settings', provided_by=[production, integration, staging, runnable3])
  require('branch', provided_by=[stable, master, branch])

  addNote()
  checkout_latest()
  track_deployment()
  # install_requirements()
  bower()
  grunt()
  reboot()

def reboot():
  """
  Restart the server.
  """
  run('pm2 kill')
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
  require('settings', provided_by=[production, integration, staging, runnable3])
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
