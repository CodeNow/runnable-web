#!/usr/bin/env python

from fabric.api import *
import json

env.user = "ubuntu"
env.use_ssh_config = True
env.note = ""
env.newrelic_application_id = ""
"""
Environments
"""
def integration():
  """
  Work on integration environment
  """
  env.requireNote = False;
  env.settings = 'integration'
  env.redisHost = '10.0.1.14'
  env.redisKey = 'frontend:cloudcosmos.com'
  env.webHostIp = '10.0.1.150'
  env.hosts = [
    'int-web'
  ]

def staging():
  """
  Work on staging environment
  """
  env.requireNote = False;
  env.settings = 'staging'
  env.redisHost = '10.0.1.125'
  env.redisKey = 'frontend:runnable.pw'
  env.webHostIp = '10.0.1.55'
  env.hosts = [
    'stage-web'
  ]

def production():
  """
  Work on production environment
  """
  env.requireNote = True;
  env.settings = 'production'
  env.redisHost = '10.0.1.20'
  env.redisKey = 'frontend:runnable.com'
  env.webHostIp = '10.0.1.42'
  env.newrelic_application_id = "3904226"
  env.hosts = [
    'prod-web'
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
  Install server
  """
  require('settings', provided_by=[production, integration, staging])
  install_requirements()

def install_requirements():
  """
  Install the required packages using npm.
  """
  sudo('apt-get install -y curl redis-server');
  sudo('curl -s https://get.docker.io/ubuntu/ | sudo sh')
  sudo('sudo docker run ubuntu ls')

def track_deployment(image, container):
  """
  Update deployments for tracking
  """
  if env.newrelic_application_id:
    containerId = container;
    commit = image;
    project = 'web'
    author = env.author
    note = env.note
    cmd = 'curl -H "x-api-key:b04ef0fa7d124e606c0c480ac9207a85b78787bda4bfead" \
      -d "deployment[application_id]=' + env.newrelic_application_id+'\" \
      -d "deployment[description]=container:'+containerId+'" \
      -d "deployment[revision]=' + commit + '" \
      -d "deployment[changelog]=' + note + '" \
      -d "deployment[user]=' + author + '" \
      https://api.newrelic.com/deployments.xml'
    run(cmd)

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
def deploy(image):
  """
  Deploy the latest version of the site to the server.
  """
  require('settings', provided_by=[production, integration, staging])

  prompt("your name please: ", "author")
  addNote()
  pullImage(image);
  containerId = startNewContainer(image);
  port = getPortOfContainer(containerId);
  addContainerToRedis(port)
  stopPrevContainer(containerId);
  track_deployment(image, containerId)

def pullImage(image):
  """
  pull down current image
  """
  run("sudo docker pull registry.runnable.com/runnable/" + image);

def startNewContainer(image):
  """
  start container and return id
  """
  return run('sudo docker run -d -P -e "NODE_ENV='+env.settings+'" registry.runnable.com/runnable/' + image);

def getPortOfContainer(containerId):
  """
  get port of a container
  """
  info = run('sleep 1 && sudo docker inspect ' + containerId);
  infoObj = json.loads(info);
  try:
    port = infoObj[0]['NetworkSettings']['Ports']['3000/tcp'][0]['HostPort'];
  except KeyError:
    print 'ERROR GETTING CONTAINER PORT';
    exit();

  print 'container running on port', port
  return port

def addContainerToRedis(port):
  """
  add key into redis to register this backend
  """
  run('redis-cli -h ' + env.redisHost + ' lset ' + env.redisKey + ' 1 http://' + env.webHostIp + ':' + port);

def stopPrevContainer(containerId):
  """
  stop old container
  """
  run("sudo docker kill `sudo docker ps --no-trunc -q | grep -v "+containerId+"`");
