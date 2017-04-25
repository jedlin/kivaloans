#Kiva loans experiment app

# Running in Dev Mode

You'll need 2 terminal windows, One to monitor the Node server and one to monitor Webpack dev.

Start Express via pm2 with logs

    npm run start-pm2-dev

Start webpack dev in it's own terminal

    npm run start-webpack-dev

* Remember when shutting things down in dev or if you want to stop the server, use pm2 kill to halt that background process.


# Running on our current server

Start Express via pm2 with logs

    pm2 start ecosystem.config.js

- pm2 status (to view status)
- pm2 restart (to do just that)

Start webpack dev in it's own terminal

    sudo npm run build

- refresh the page to trigger the build
- refresh again to see the results

# Updating the App on the server

1. Go into kivaloans folder
2. sudo git pull



