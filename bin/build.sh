#!/bin/bash
#build app
pushd public
echo "browserify  -d js/main.js -o js/build.js"
browserify  -d js/main.js -o js/build.js &
pid1=$!
echo "browserify --exclude @excalidraw/excalidraw/dist/excalidraw.development.js  js/main.js  -t [ envify --NODE_ENV production  ] | uglifyjs -c dead_code  > js/build.min.js"
export NODE_ENV=production
browserify --exclude @excalidraw/excalidraw/dist/excalidraw.development.js js/main.js -t [ envify --NODE_ENV production  ] | uglifyjs -c dead_code > js/build.min.js &
pid2=$!
unset NODE_ENV
popd
wait $pid1
wait $pid2
