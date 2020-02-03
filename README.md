# DockHand

An application that allows the management of containers on your local system in and intuitive ad helpful manner

## V1 Features

---

- See all containers running on your local machine whether started or stopped
- Provides container information such as the following:
  - Running or Stopped
  - Container Id with auto-copy
  - Image sha
  - Any Volumes present
  - Any Mounts present
  - Ports used
  - Command used to start container
- Start and stop containers that exist on your machine
- Remove stopped containers from your machine
- Spin up new containers with images that are already downloaded to your machine
- Stream logs from container
- Use quickfilters to filter by INFO, WARN, SEVERE
- Custom Filtering of logs based on input from user

## Getting started

- This app works with docker, it must be connected to docker.sock file for it to work correctly. This means if you are running this app locallym I expect for you to have Docker installed.
- first you will need to pull down the image to use by running `docker pull 4990814/dock-hand`
- Once you have the image available locally you can run the following command:
  `docker run -p "PORT_YOU_WANT_TO_VISIT:5642" -v "/var/run/docker.sock:/var/run/docker.sock" 4990814/dock-hand`
  - This runs the application locally on your machine
  - maps your local docker.sock file to the container's version
  - maps port 5642 of the container which is where the server is set up, to a port of your choice on your computer. You should replace `PORT_YOU_WANT_TO_VISIT` with an open port that is available on your machine.
  - visit `http://localhost:PORT_YOU_WANT_TO_VISIT/` and start using the application.

## Finding Bugs

Please if you find bugs with the application, I would appreciate them being logged in the Github Issues area.

### V2 (Coming Soon)

- Launch Docker compose files and manage them as clusters in app
- Clusters will allow containers in compose cluster to be managed easily together including getting logs from individual containers or combined logs
- Web console, which will allow a use to exec into a container and execute commands on any container from the GUI

## V3 (TBD)

- A wizard which allows a user to create a compose file in the GUI, which will be written and executed as a cluster automatically
