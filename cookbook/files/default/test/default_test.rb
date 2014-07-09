require 'minitest/spec'

describe_recipe 'runnable_web::default' do

  include MiniTest::Chef::Assertions
  include Minitest::Chef::Context
  include Minitest::Chef::Resources
  include Chef::Mixin::ShellOut

  it 'listens on port 3000' do
    assert shell_out('lsof -n -i :3000').exitstatus == 0
  end

   it 'generates json configuration' do
    node['runnable_web']['config'].each do |k,v|
      file("#{node['runnable_web']['deploy_path']}/current/configs/#{node.chef_environment}.json").must_include k
    end
  end

  it 'starts the runnable-web service' do
    r = Chef::Resource::Service.new("runnable-web", @run_context)
    r.provider Chef::Provider::Service::Upstart
    current_resource = r.provider_for_action(:start).load_current_resource
    current_resource.running.must_equal true
  end

  it 'passes deployment smoke test' do
    shell_out('wget -q -O /dev/null http://localhost:3000/').exitstatus.must_equal 0
  end
end
