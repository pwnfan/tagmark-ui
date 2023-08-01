PROJECT = "TagMark UI"

.PHONY: testserver changelog

testserver: ;@echo "Loading ${PROJECT} Test Server......\n";
	python3 -m http.server 

changelog: ;@echo "Making ${PROJECT} Changelog......\n"; \
	git log $(o)..$(n) --oneline --abbrev-commit --pretty="* %h %s" > $(f) && \
	echo "changelog between $(o) and $(n) has been written into file $(f)"
