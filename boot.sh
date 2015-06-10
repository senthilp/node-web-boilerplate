echo "Killing current node process"
pkill node

echo "Starting node server"
nohup nodejs server.js > output.log &