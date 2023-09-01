build:
	sudo docker build --tag=kyoheiudev/carbon:$(VER) .

push:
	sudo docker push kyoheiudev/carbon:$(VER)
