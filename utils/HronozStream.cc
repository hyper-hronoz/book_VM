#include <fstream>
#include <iostream>
#include <node.h>
#include <string>

using namespace v8;

namespace demo {
using v8::Exception;
using v8::FunctionCallbackInfo;
using v8::Integer;
using v8::Isolate;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

std::string testString = "fucking addon"; // value is set elsewhere.

void Read(const FunctionCallbackInfo<Value> &args) {
  Isolate *isolate = args.GetIsolate();

  // Check the number of arguments passed.
  if (args.Length() < 3) {
    // Throw an Error that is passed back to JavaScript
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong number of arguments")
            .ToLocalChecked()));
    return;
  }

  if (!args[0]->IsNumber() || !args[1]->IsNumber() || !args[2]->IsString()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "Wrong arguments").ToLocalChecked()));
    return;
  }

  double takeFrom = args[0].As<Number>()->Value();
  double takeTo = args[1].As<Number>()->Value();
  String::Utf8Value fileName(isolate, args[2]);

  std::cout << *fileName << std::endl;

  std::ifstream file(*fileName, std::ios::in);

  if (!file.is_open()) {
    isolate->ThrowException(Exception::TypeError(
        String::NewFromUtf8(isolate, "File was not found").ToLocalChecked()));
  }

  file.seekg(takeFrom);

  std::string response{};
  int i = 0;
  char ch;
  while (file.get(ch) && i < takeTo) {
    response += ch;
    i++;
  }

  args.GetReturnValue().Set(
      String::NewFromUtf8(isolate, response.c_str()).ToLocalChecked());
}

void Initialize(Local<Object> exports) {
  NODE_SET_METHOD(exports, "read", Read);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize)
} // namespace demo
