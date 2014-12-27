@rem m: produce source maps
@rem w: watch the file, rerun command when change detected
@rem o: specify output folder
start cmd /c "coffee -m -w -o spec_compiled spec/scalarInputSpec.coffee"

@rem s: start server, with index.html as base page
livereloadx -s
