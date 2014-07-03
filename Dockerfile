#
# web_main Dockerfile
#
#
# Pull base image.
FROM 54.176.97.94:5000/web_base
# Download Runnable-web Repo
RUN eval $(ssh-agent) > /dev/null && ssh-add /.ssh/id_rsa && git clone git@github.com:CodeNow/runnable-web.git 

WORKDIR runnable-web 
RUN npm install 
RUN bower install  --allow-root
RUN grunt --force

# Expose port to Host
EXPOSE 3000
# Define default command.
CMD ["NODE_ENV=staging pm2 start server.js -n Runnable-web", "pm2 logs"]
