cmd_Release/obj.target/test.node := g++ -o Release/obj.target/test.node -shared -pthread -rdynamic -m64  -Wl,-soname=test.node -Wl,--start-group Release/obj.target/test/main.o Release/obj.target/../node_modules/node-addon-api/nothing.a -Wl,--end-group 