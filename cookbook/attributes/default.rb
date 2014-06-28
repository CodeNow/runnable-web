default['runnable_web']['deploy_path'] = '/opt/runnable-web'
default['runnable_web']['config'] = {
  'port' => 3000,
  'cookieKey'		=> "runnable.sid",
  'cookieSecret'	=> "$up3r,$3<r3t",
  'cookieExpires' 	=> "1 year",
  'rollbar'			=> 'bbbd8090514a4b40a0ec53fbed32d882',
  'api'				=> {
    'default' => {
      'host' => 'api_server',
      'protocol' => 'http'
    }
  },
  'redis' => {
    'port' => 6379,
    'host' => 'redis_server'
  },
  'rendrApp' => {
    'commitHash' => '{COMMIT_HASH}',
    'intercom' => {'app_id' => '980118989fd561bd1dce4ba4c7f8cb32da859c16'},
  }
}

case node.chef_environment
when 'integration'
  default['runnable_web']['config']['rendrApp']['env'] = 'integration'	
  default['runnable_web']['config']['rendrApp']['domain'] = 'cloudcosmos.com'
  default['runnable_web']['config']['rendrApp']['mixpanel'] = {'key' => 'de848319a0091fb3a5876184d81a40ec'}
  default['runnable_web']['config']['rendrApp']['googleAnalytics'] = {'id' => 'UA-36631837-2'}
when 'staging'
  default['runnable_web']['config']['rendrApp']['env'] = 'production'
  default['runnable_web']['config']['rendrApp']['domain'] = 'runnable.pw'
  default['runnable_web']['config']['rendrApp']['mixpanel'] = {'key' => 'de848319a0091fb3a5876184d81a40ec'}
  default['runnable_web']['config']['rendrApp']['googleAnalytics'] = {'id' => 'UA-36631837-1'}
when 'production'
  default['runnable_web']['config']['rendrApp']['env'] = 'production'
  default['runnable_web']['config']['rendrApp']['domain'] = 'runnable.com'
  default['runnable_web']['config']['rendrApp']['mixpanel'] = {'key' => '8790acfcca0cab43adebbc796f1d4f96'}
  default['runnable_web']['config']['rendrApp']['googleAnalytics'] = {'id' => 'UA-36631837-1'}
  default['runnable_web']['config']['newrelic'] = {
  	'name' => 'web-production',
  	'key' => '338516e0826451c297d44dc60aeaf0a0ca4bfead'
  }
end