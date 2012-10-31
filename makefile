all: build
	./node_modules/.bin/bundle main.js > build/main.js
	cp manifest.json build/
	cp main.html build/
	cp background.js build/
	cp -r ui build/
	cp -r img build/
	cp -r css build/
	cp lib/jquery.js build/

build:
	mkdir build