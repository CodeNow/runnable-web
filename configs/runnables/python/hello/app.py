## Creating a basic web server in python without
## any external modules or dependencies

import os
import SimpleHTTPServer
import SocketServer

PORT = int(os.getenv("OPENSHIFT_INTERNAL_PORT"))
IP = os.getenv("OPENSHIFT_INTERNAL_IP")

## 'SimpleHTTPRequestHeader' is setup to serve up any
## files located in the current directory
Handler = SimpleHTTPServer.SimpleHTTPRequestHandler

httpd = SocketServer.TCPServer((IP, PORT), Handler)

print "serving at port: ", PORT
httpd.serve_forever()