name             'runnable_web'
maintainer       'Runnable.com'
maintainer_email 'ben@runnable.com'
license          'All rights reserved'
description      'Runnable.com web cookbook'
long_description IO.read(File.join(File.dirname(__FILE__), 'README.md'))
version          '0.1.1'

supports 'ubuntu'

%w{
  build-essential
  runnable_nodejs
}.each do |cb|
  depends cb
end

recipe "runnable_web::default", "Installs and configures runnable-web"
