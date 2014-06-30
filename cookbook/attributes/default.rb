default['runnable_web']['deploy_path'] = '/opt/runnable-web'
default['runnable_web']['config'] = {
  'port' => 3000,
  'cookieKey'		=> "runnable.sid",
  'cookieSecret'	=> "$up3r,$3<r3t",
  'cookieExpires' 	=> "1 year",
  'rollbar'			=> 'bbbd8090514a4b40a0ec53fbed32d882',
  'api'				=> {
    'default' => {
      'protocol' => 'http'
    }
  },
  'redis' => {
    'port' => 6379
  },
  'rendrApp' => {
    'commitHash' => '{COMMIT_HASH}',
    'intercom' => {'app_id' => '980118989fd561bd1dce4ba4c7f8cb32da859c16'},
  }
}