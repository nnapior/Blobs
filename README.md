# Blobs

## Run Development Server
To install dependancies run `npm i` in the project root.
Run the server with `node server.js`.

## Docker
### Build Image
run `docker build -t nnapior/blobs .` in the project root.
### Run
`docker run -p 8080:8080 -d nnapior/blobs --restart always`
