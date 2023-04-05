#include <iostream>
#include <fstream>
#include <node.h>

namespace calculate {
using v8::FunctionCallbackInfo;
using v8 ::Isolate;
using v8 ::Local;
using v8 ::Number;
using v8 ::Object;
using v8 ::Value;

// C++ add function.
void Read(const FunctionCallbackInfo<Value> &args) {
  Isolate *isolate = args.GetIsolate();

  auto total = Number::New(isolate, x);
  args.GetReturnValue().Set(total);
}

// Exports our method
void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "read", Read);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);
} // namespace calculate
