const express = require("express");
const path = require("path");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const docker = require("./dockerapi");
const stream = require("stream");
const morgan = require("morgan");

const PORT = process.env.PORT || 3002;

const openLogStreams = new Map();
app.use(morgan("dev"));
app.use(express.static("public"));

app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

const refreshContainers = () => {
  docker.listContainers({ all: true }, (err, containers) => {
    io.emit("containers.list", containers);
  });
};

io.on("connection", socket => {
  socket.on("containers.list", () => {
    refreshContainers();
  });

  socket.on("container.start", args => {
    const container = docker.getContainer(args.id);

    if (container) {
      container.start((err, data) => refreshContainers());
    }
  });

  socket.on("container.stop", args => {
    const container = docker.getContainer(args.id);

    if (container) {
      container.stop((err, data) => refreshContainers());
    }
  });

  socket.on("container.pipe_logs", args => {
    const container = docker.getContainer(args.id);

    if (container) {
      // create a single stream for stdin and stdout
      const logStream = new stream.PassThrough();
      let results = [];
      logStream.on("data", chunk => {
        results.push(chunk.toString("utf8"));
        if (results.length > 100) {
          io.emit("container.return_piped_logs", { results });
          results = [];
        }
      });
      container.logs(
        {
          follow: true,
          stdout: true,
          stderr: true
        },
        (err, stream) => {
          if (err) {
            return logger.error(err.message);
          }
          openLogStreams.set(args.id, stream);
          container.modem.demuxStream(stream, logStream, logStream);
          stream.on("end", () => {
            logStream.end("!stop!");
            io.emit("container.return_piped_logs", { results });
          });
        }
      );
    }
  });

  socket.on("container.stop_pipe_logs", args => {
    const stream = openLogStreams.get(args.id);
    if (stream) {
      stream.destroy();
    }
  });

  socket.on("container.remove", args => {
    const container = docker.getContainer(args.id);

    if (container) {
      container.remove((err, data) => {
        if (err) io.emit("container.removed_fail", { err });
        io.emit("container.removed_success", { data });
      });
      return;
    }
    io.emit("container.removed_fail", { err: "No Container with that Id" });
  });

  socket.on("image.run", args => {
    docker.createContainer({ Image: args.name }, (err, container) => {
      if (!err)
        container.start((err, data) => {
          if (err) socket.emit("image.error", { message: err });
        });
      else socket.emit("image.error", { message: err });
    });
  });
});

setInterval(refreshContainers, 1000);
