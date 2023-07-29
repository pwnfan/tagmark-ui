PROJECT = "TagMark UI"

.PHONY: testserver changelog

testserver: ;@echo "Loading ${PROJECT} Test Server......\n";
	python3 -m http.server 

changelog: ;@echo "Making ${PROJECT} Changelog......\n"; \
	git log $(V_OLD)..$(V_NEW) --oneline --abbrev-commit --pretty="* %h %s" > $(OUT_FILE) && \
	echo "changelog between $(V_OLD) and $(V_NEW) has been written into file $(OUT_FILE)"
