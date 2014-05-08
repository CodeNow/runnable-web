#!/usr/bin/env python

from fabric.api import *

env.user = "ubuntu"
env.use_ssh_config = True
env.note = ""
env.newrelic_application_id = ""

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
    'stage-web',
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
    'prod-web',
    # 'web1',
    # 'web2'
  ]
  env.newrelic_application_id = "3904226"

def integration():
  """
  Work on integration environment
  """
  env.requireNote = False;
  env.settings = 'integration'
  env.hosts = [
    'int-web'
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
  if env.newrelic_application_id:
    with cd('runnable-web'):
      branch = run('git rev-parse --abbrev-ref HEAD')
      commit = run('git rev-parse HEAD');
      project = 'harbourmaster'
      author = env.author
      note = env.note
      cmd = 'curl -H "x-api-key:b04ef0fa7d124e606c0c480ac9207a85b78787bda4bfead" \
        -d "deployment[application_id]=' + env.newrelic_application_id+'\" \
        -d "deployment[description]=branch:'+branch+'" \
        -d "deployment[revision]=' + commit + '" \
        -d "deployment[changelog]=' + note + '" \
        -d "deployment[user]=' + author + '" \
        https://api.newrelic.com/deployments.xml'
      run(cmd)

def checkout_latest():
  """
  Pull the latest code on the specified branch.
  """
  with cd('runnable-web'):
    run('git config --global credential.helper cache')
    run('git fetch --all')
    run('git reset --hard origin/%(branch)s' % env)
    run('git checkout -f %(branch)s' % env)
    run('git pull origin %(branch)s' % env)

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
    run('NODE_ENV=%(settings)s pm2 start index.js -n runnable-web' % env)

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

  prompt("your name please: ", "author")
  addNote()
  checkout_latest()
  track_deployment()
  install_requirements()
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
