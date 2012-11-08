all: build
	./node_modules/.bin/browserify main.js > build/main.js
	cp manifest.json build/
	cp main.html build/
	cp background.js build/
	cp -r ui build/
	cp -r img build/
	cp -r css build/

build:
	mkdir build
